#!/usr/bin/env python3
"""
List Buffer organizations and channels for HADES Marketing setup.

Usage:
  export MARKETING__BRAND__AGENT="<token>"
  python tools/marketing/list_channels.py

Prints org IDs and every channel (id, name, service) so you can set:
  BUFFER_CHANNEL_INSTAGRAM
  BUFFER_CHANNEL_X
  BUFFER_CHANNEL_TIKTOK
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from buffer_client import BufferAPIError, eprint, graphql_request

ACCOUNT_QUERY = """
query {
  account {
    id
    organizations {
      id
      name
    }
  }
}
"""

CHANNELS_QUERY = """
query ($orgId: String!) {
  channels(input: { organizationId: $orgId }) {
    id
    name
    service
  }
}
"""


def main() -> None:
    try:
        data = graphql_request(ACCOUNT_QUERY)
    except BufferAPIError as e:
        eprint(f"error: {e}")
        sys.exit(1)

    account = data.get("account") or {}
    orgs = account.get("organizations") or []
    if not orgs:
        eprint("error: No organizations found on this Buffer account.")
        sys.exit(1)

    print("=== Buffer account ===")
    print(f"account_id: {account.get('id')}")
    print()

    for org in orgs:
        org_id = org.get("id")
        org_name = org.get("name") or "(unnamed)"
        print(f"=== Organization: {org_name} ===")
        print(f"organization_id: {org_id}")
        print()

        try:
            ch_data = graphql_request(CHANNELS_QUERY, {"orgId": org_id})
        except BufferAPIError as e:
            print(f"  (failed to list channels: {e})")
            continue

        channels = ch_data.get("channels") or []
        if not channels:
            print("  (no channels)")
            continue

        print(f"{'service':<12} {'name':<28} channel_id")
        print("-" * 72)
        for ch in channels:
            service = (ch.get("service") or "?").lower()
            name = ch.get("name") or ""
            cid = ch.get("id") or ""
            print(f"{service:<12} {name:<28} {cid}")
        print()

    print("Next: export the channel IDs you need, e.g.")
    print('  export BUFFER_CHANNEL_INSTAGRAM="<id>"')
    print('  export BUFFER_CHANNEL_X="<id>"')
    print('  export BUFFER_CHANNEL_TIKTOK="<id>"')


if __name__ == "__main__":
    main()
