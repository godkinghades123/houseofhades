"""
list_channels.py
-----------------
One-time / occasional lookup script: prints your Buffer organization ID
and every connected channel's ID, name, and service (instagram, twitter, tiktok...).
Run this first to fill in the CHANNEL_IDS map used by create_post.py.

Usage:
    python tools/marketing/list_channels.py
"""

from buffer_client import graphql_request, eprint, BufferAPIError

ACCOUNT_QUERY = """
query GetAccount {
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
query GetChannels($organizationId: OrganizationId!) {
  channels(input: { organizationId: $organizationId }) {
    id
    name
    displayName
    service
    isDisconnected
  }
}
"""


def main():
    try:
        account_data = graphql_request(ACCOUNT_QUERY)
    except BufferAPIError as e:
        eprint(f"[error] {e}")
        raise SystemExit(1)

    orgs = account_data.get("account", {}).get("organizations", [])
    if not orgs:
        eprint("No organizations found on this Buffer account/token.")
        raise SystemExit(1)

    for org in orgs:
        print(f"\nOrganization: {org['name']}  (id: {org['id']})")
        try:
            ch_data = graphql_request(CHANNELS_QUERY, {"organizationId": org["id"]})
        except BufferAPIError as e:
            eprint(f"  [error fetching channels] {e}")
            continue

        channels = ch_data.get("channels", [])
        if not channels:
            print("  (no channels connected)")
            continue

        for ch in channels:
            status = "DISCONNECTED" if ch.get("isDisconnected") else "connected"
            print(
                f"  - {ch['service']:<10} {ch.get('displayName') or ch['name']:<25} "
                f"id: {ch['id']}  [{status}]"
            )

    print(
        "\nCopy the channel IDs you need (Instagram / X / TikTok) into "
        "your environment as BUFFER_CHANNEL_INSTAGRAM, BUFFER_CHANNEL_X, "
        "BUFFER_CHANNEL_TIKTOK, or pass --channel-id directly to create_post.py."
    )


if __name__ == "__main__":
    main()
