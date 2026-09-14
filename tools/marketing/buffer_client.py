#!/usr/bin/env python3
"""
Shared Buffer GraphQL client for HADES Marketing agent.

Auth: MARKETING__BRAND__AGENT env var (Bearer token).
Never logs or prints the token.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any

BUFFER_ENDPOINT = "https://api.buffer.com"
SECRET_NAME = "MARKETING__BRAND__AGENT"


class BufferError(Exception):
    """Raised when Buffer returns a GraphQL or HTTP error."""

    def __init__(self, message: str, payload: dict[str, Any] | None = None):
        super().__init__(message)
        self.payload = payload or {}


def get_token() -> str:
    token = os.environ.get(SECRET_NAME, "").strip()
    if not token:
        raise BufferError(
            f"Missing secret: set env var {SECRET_NAME} to your Buffer API Bearer token."
        )
    # Allow accidental "Bearer xxx" paste
    if token.lower().startswith("bearer "):
        token = token[7:].strip()
    return token


def graphql(query: str, variables: dict[str, Any] | None = None) -> dict[str, Any]:
    """
    Execute a GraphQL operation against Buffer.
    Returns the top-level `data` object on success.
    Raises BufferError on HTTP or GraphQL errors.
    """
    token = get_token()
    body: dict[str, Any] = {"query": query}
    if variables:
        body["variables"] = variables

    req = urllib.request.Request(
        BUFFER_ENDPOINT,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "User-Agent": "HouseOfHades-MarketingAgent/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            raw = resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        raise BufferError(
            f"Buffer HTTP {e.code}: {err_body[:500]}",
            {"status": e.code, "body": err_body},
        ) from e
    except urllib.error.URLError as e:
        raise BufferError(f"Buffer network error: {e.reason}") from e

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as e:
        raise BufferError(f"Buffer returned non-JSON: {raw[:300]}") from e

    if "errors" in parsed and parsed["errors"]:
        msgs = []; 
        for err in parsed["errors"]:
            if isinstance(err, dict):
                msgs.append(str(err.get("message", err)))
            else:
                msgs.append(str(err))
        raise BufferError("; ".join(msgs), parsed)

    data = parsed.get("data")
    if data is None:
        raise BufferError("Buffer response missing data", parsed)
    return data


def die(msg: str, code: int = 1) -> None:
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(code)
