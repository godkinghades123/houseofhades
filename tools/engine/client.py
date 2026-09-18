"""
tools/engine/client.py
----------------------
Read-only Tastytrade client for House of Hades Engine.
Phase 1 gate: balances + balance-snapshots only. No orders.

Auth is bound to YOUR OAuth app + refresh token.
Account is verified via GET /customers/me/accounts before any balance call.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any

USER_AGENT = "houseofhades-engine/1.0"
PROD_BASE = "https://api.tastyworks.com"
CERT_BASE = "https://api.cert.tastyworks.com"


class EngineError(RuntimeError):
    pass


def _env(name: str, required: bool = True) -> str | None:
    val = os.environ.get(name)
    if required and not val:
        raise EngineError(f"Missing required env: {name}")
    return val.strip() if val else None


def base_url() -> str:
    env = (_env("TASTYTRADE_ENV", required=False) or "prod").lower()
    return CERT_BASE if env in ("cert", "sandbox") else PROD_BASE


def get_access_token() -> str:
    """Exchange refresh token for a 15-minute access token."""
    client_secret = _env("TASTYTRADE_CLIENT_SECRET")
    refresh = _env("TASTYTRADE_REFRESH_TOKEN")
    client_id = _env("TASTYTRADE_CLIENT_ID", required=False)

    payload: dict[str, str] = {
        "grant_type": "refresh_token",
        "refresh_token": refresh,
        "client_secret": client_secret,
    }
    if client_id:
        payload["client_id"] = client_id

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{base_url()}/oauth/token",
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise EngineError(f"OAuth token failed HTTP {e.code}: {detail}") from e

    token = data.get("access_token")
    if not token:
        raise EngineError(f"No access_token in response: {data}")
    return token


def _request(path: str, token: str, params: dict | None = None) -> dict:
    url = f"{base_url()}{path}"
    if params:
        qs = "&".join(
            f"{k}={urllib.request.quote(str(v))}"
            for k, v in params.items()
            if v is not None
        )
        url = f"{url}?{qs}"

    req = urllib.request.Request(
        url,
        method="GET",
        headers={
            "Authorization": f"Bearer {token}",
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise EngineError(f"API {path} HTTP {e.code}: {detail}") from e


def list_my_accounts(token: str) -> list[dict]:
    """Only returns accounts that belong to the authenticated user."""
    data = _request("/customers/me/accounts", token)
    items = data.get("data", {}).get("items") or data.get("items") or []
    accounts = []
    for it in items:
        acct = it.get("account") if isinstance(it.get("account"), dict) else it
        accounts.append(acct)
    return accounts


def resolve_account_number(token: str) -> str:
    """
    Hard lock:
    1. List accounts for the authenticated user.
    2. If TASTYTRADE_ACCOUNT_NUMBER is set, it MUST appear in that list.
    3. If not set and exactly one account exists, use it (and log loudly).
    4. Otherwise abort.
    """
    accounts = list_my_accounts(token)
    numbers = [a.get("account-number") for a in accounts if a.get("account-number")]

    if not numbers:
        raise EngineError(
            "No accounts returned for this OAuth user. Wrong credentials or empty account."
        )

    expected = _env("TASTYTRADE_ACCOUNT_NUMBER", required=False)

    if expected:
        if expected not in numbers:
            raise EngineError(
                f"TASTYTRADE_ACCOUNT_NUMBER={expected} is NOT in the accounts "
                f"belonging to this OAuth user. Found: {numbers}. Aborting."
            )
        print(f"[engine] Account lock OK: {expected}", file=sys.stderr)
        return expected

    if len(numbers) == 1:
        print(f"[engine] Single account auto-selected: {numbers[0]}", file=sys.stderr)
        return numbers[0]

    raise EngineError(
        f"Multiple accounts found {numbers}. Set TASTYTRADE_ACCOUNT_NUMBER to lock to one."
    )


def get_balances(token: str, account_number: str) -> dict:
    data = _request(f"/accounts/{account_number}/balances", token)
    return data.get("data") or data


def get_balance_snapshots(
    token: str,
    account_number: str,
    *,
    time_of_day: str = "EOD",
    snapshot_date: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    per_page: int = 50,
) -> list[dict]:
    params: dict[str, Any] = {
        "time-of-day": time_of_day,
        "per-page": per_page,
    }
    if snapshot_date:
        params["snapshot-date"] = snapshot_date
    if start_date:
        params["start-date"] = start_date
    if end_date:
        params["end-date"] = end_date

    data = _request(f"/accounts/{account_number}/balance-snapshots", token, params)
    items = data.get("data", {}).get("items") or data.get("items") or []
    return items


def _num(v) -> float | None:
    if v is None:
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def fetch_engine_snapshot() -> dict:
    """One-shot: auth → lock account → live balances + recent EOD snapshots."""
    token = get_access_token()
    acct = resolve_account_number(token)

    bal = get_balances(token, acct)
    snaps = get_balance_snapshots(token, acct, time_of_day="EOD", per_page=14)

    net_liq = _num(bal.get("net-liquidating-value") or bal.get("net_liquidating_value"))
    cash = _num(bal.get("cash-balance") or bal.get("cash_balance"))
    deriv_bp = _num(
        bal.get("derivative-buying-power") or bal.get("derivative_buying_power")
    )

    return {
        "accountNumber": acct,
        "netLiq": net_liq,
        "cashBalance": cash,
        "optionsBuyingPower": deriv_bp,
        "rawBalance": bal,
        "recentEodSnapshots": snaps,
        "source": "tastytrade-api",
        "env": "cert" if "cert" in base_url() else "prod",
    }


if __name__ == "__main__":
    snap = fetch_engine_snapshot()
    print(
        json.dumps(
            {
                "accountNumber": snap["accountNumber"],
                "netLiq": snap["netLiq"],
                "cashBalance": snap["cashBalance"],
                "optionsBuyingPower": snap["optionsBuyingPower"],
                "snapshotCount": len(snap["recentEodSnapshots"]),
                "env": snap["env"],
            },
            indent=2,
        )
    )
