"""
tools/gumroad/client.py
-----------------------
Read-only Gumroad client for the HADES Underworld Education Academy.

Phase 1: products + sales + summary only.
No product create/edit, no refunds, no publish toggles.

Auth: HADES__GUMROAD (GitHub Actions secret / local env).
Never log the token.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timezone
from typing import Any

USER_AGENT = "houseofhades-gumroad/1.0"
API_BASE = "https://api.gumroad.com/v2"
SECRET_ENV = "HADES__GUMROAD"


class GumroadError(RuntimeError):
    pass


def get_token() -> str:
    token = os.environ.get(SECRET_ENV)
    if not token:
        raise GumroadError(
            f"Missing {SECRET_ENV}. Set it as a GitHub Actions secret or local env var."
        )
    return token.strip()


def _request(
    path: str,
    *,
    method: str = "GET",
    params: dict[str, Any] | None = None,
) -> dict:
    """Call Gumroad v2. Token via Bearer + access_token query (compat)."""
    token = get_token()
    q = dict(params or {})
    q["access_token"] = token
    qs = urllib.parse.urlencode({k: v for k, v in q.items() if v is not None})
    url = f"{API_BASE}{path}?{qs}"

    req = urllib.request.Request(
        url,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise GumroadError(f"Gumroad {path} HTTP {e.code}: {detail}") from e
    except urllib.error.URLError as e:
        raise GumroadError(f"Could not reach Gumroad API: {e}") from e

    if body.get("success") is False:
        raise GumroadError(f"Gumroad {path}: {body.get('message', body)}")
    return body


def list_products() -> list[dict]:
    """All products for the authenticated creator."""
    data = _request("/products")
    return data.get("products") or []


def get_product(product_id: str) -> dict:
    data = _request(f"/products/{product_id}")
    product = data.get("product")
    if not product:
        raise GumroadError(f"No product in response for id={product_id}")
    return product


def list_sales(
    *,
    after: str | None = None,
    before: str | None = None,
    product_id: str | None = None,
    email: str | None = None,
    max_pages: int = 20,
) -> list[dict]:
    """Successful sales. Cursor-paginated via page_key when present."""
    sales: list[dict] = []
    page_key: str | None = None
    pages = 0

    while pages < max_pages:
        params: dict[str, Any] = {}
        if after:
            params["after"] = after
        if before:
            params["before"] = before
        if product_id:
            params["product_id"] = product_id
        if email:
            params["email"] = email
        if page_key:
            params["page_key"] = page_key

        data = _request("/sales", params=params)
        batch = data.get("sales") or []
        sales.extend(batch)
        pages += 1

        page_key = data.get("next_page_key") or None
        if not page_key or not batch:
            break

    return sales


def _money(v: Any) -> float:
    if v is None:
        return 0.0
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def summarize_sales(sales: list[dict]) -> dict:
    """Aggregate gross, net (price - fee when present), count, by product."""
    total_gross = 0.0
    total_net = 0.0
    by_product: dict[str, dict] = {}

    for s in sales:
        price = _money(s.get("price") or s.get("formatted_display_price"))
        # Gumroad often returns price in cents as int; detect and normalize
        if price >= 100 and isinstance(s.get("price"), int):
            price = price / 100.0
        fee = _money(s.get("gumroad_fee") or s.get("fee"))
        if fee >= 100 and isinstance(s.get("gumroad_fee"), int):
            fee = fee / 100.0
        net = price - fee if fee else _money(s.get("seller_received") or price)

        total_gross += price
        total_net += net

        name = s.get("product_name") or s.get("product_id") or "unknown"
        bucket = by_product.setdefault(
            name, {"count": 0, "gross": 0.0, "net": 0.0}
        )
        bucket["count"] += 1
        bucket["gross"] += price
        bucket["net"] += net

    return {
        "saleCount": len(sales),
        "gross": round(total_gross, 2),
        "net": round(total_net, 2),
        "byProduct": {
            k: {
                "count": v["count"],
                "gross": round(v["gross"], 2),
                "net": round(v["net"], 2),
            }
            for k, v in by_product.items()
        },
    }


def fetch_academy_snapshot(
    *,
    after: str | None = None,
    before: str | None = None,
    product_id: str | None = None,
) -> dict:
    """
    One-shot: products + sales window + summary.
    product_id optional — when set, sales are filtered to that Academy SKU.
    """
    products = list_products()
    sales = list_sales(after=after, before=before, product_id=product_id)
    summary = summarize_sales(sales)

    return {
        "syncedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "gumroad-api",
        "productCount": len(products),
        "products": [
            {
                "id": p.get("id"),
                "name": p.get("name"),
                "price": p.get("price"),
                "published": p.get("published"),
                "sales_count": p.get("sales_count"),
                "currency": p.get("currency"),
                "url": p.get("short_url") or p.get("url"),
            }
            for p in products
        ],
        "window": {"after": after, "before": before, "product_id": product_id},
        "summary": summary,
        "saleSample": [
            {
                "id": s.get("id"),
                "product_name": s.get("product_name"),
                "created_at": s.get("created_at"),
                "email": s.get("email"),
                "price": s.get("price"),
            }
            for s in sales[:5]
        ],
    }


if __name__ == "__main__":
    after = os.environ.get("GUMROAD_AFTER")  # YYYY-MM-DD optional
    product_id = os.environ.get("GUMROAD_PRODUCT_ID")  # optional filter
    snap = fetch_academy_snapshot(after=after, product_id=product_id)
    print(
        json.dumps(
            {
                "syncedAt": snap["syncedAt"],
                "productCount": snap["productCount"],
                "summary": snap["summary"],
                "products": snap["products"],
            },
            indent=2,
        )
    )
