"""Tests for the HQ money parser (run: python -m pytest scripts -q)."""
import os
import re
import sys
from pathlib import Path

os.environ.setdefault("NOTION_API_KEY", "x")
os.environ.setdefault("NOTION_HQ_PAGE_ID", "y")
sys.path.insert(0, str(Path(__file__).resolve().parent))
import sync_ops_map as S  # noqa: E402

NL = [r"Net Liq[^\d\n]{0,40}\$?" + S._NUM, r"Tastytrade[^\d\n]{0,40}\$?" + S._NUM]


def test_plain_and_trailing_period():
    assert S.parse_money("Net Liq: $245.32", NL, 287.0) == 245.32
    assert S.parse_money("Net Liq: $245.32.", NL, 287.0) == 245.32     # was -> default 287


def test_thousands_separator():
    assert S.parse_money("Net Liq: $1,234.56", NL, 287.0) == 1234.56    # was -> 1.0


def test_label_does_not_grab_number_from_next_line():
    assert S.parse_money("Net Liq - pending\nKeyBank ~$700", NL, 287.0) == 287.0  # was -> 700


def test_engine_phase_not_treated_as_balance():
    src = Path(S.__file__).read_text()
    assert not re.search(r'r"Engine\[', src)                              # was -> $1
