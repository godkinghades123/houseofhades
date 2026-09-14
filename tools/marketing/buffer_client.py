"""
buffer_client.py
-----------------
Thin wrapper around Buffer's GraphQL API (https://api.buffer.com).
Auth token is read from the MARKETING__BRAND__AGENT secret / env var.
Never hardcode the token. Never log the token.
"""

import os
import sys
import json
import urllib.request
import urllib.error

BUFFER_ENDPOINT = "https://api.buffer.com"
SECRET_ENV_VAR = "MARKETING__BRAND__AGENT"


class BufferAPIError(RuntimeError):
    pass


def get_token() -> str:
    token = os.environ.get(SECRET_ENV_VAR)
    if not token:
        raise BufferAPIError(
            f"Missing {SECRET_ENV_VAR}. Set it as a GitHub Actions secret / "
            f"local env var before running any Buffer script."
        )
    return token.strip()


def graphql_request(query: str, variables: dict | None = None) -> dict:
    """POST a GraphQL query/mutation to Buffer and return the parsed JSON body."""
    token = get_token()
    payload = json.dumps({"query": query, "variables": variables or {}}).encode("utf-8")
    req = urllib.request.Request(
        BUFFER_ENDPOINT,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise BufferAPIError(f"Buffer API HTTP {e.code}: {detail}") from e
    except urllib.error.URLError as e:
        raise BufferAPIError(f"Could not reach Buffer API: {e}") from e
    if "errors" in body and body["errors"]:
        raise BufferAPIError(f"Buffer API returned errors: {body['errors']}")
    return body.get("data", {})


def eprint(*args):
    print(*args, file=sys.stderr)
