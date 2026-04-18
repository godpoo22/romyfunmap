from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(r"D:\parenting-site-v1")


VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}


def format_html(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff")
    text = text.replace("><", ">\n<")
    text = re.sub(r">\s+<", ">\n<", text)
    tokens = re.findall(r"<!--.*?-->|<!DOCTYPE.*?>|<[^>]+>|[^<]+", text, flags=re.S | re.I)
    lines = [token.strip() for token in tokens if token.strip()]

    formatted: list[str] = []
    indent = 0

    for line in lines:
        if line.startswith("<!--"):
            formatted.append(("  " * indent) + line)
            continue

        if line.startswith("</"):
            indent = max(indent - 1, 0)

        formatted.append(("  " * indent) + line)

        if line.startswith("<!"):
            continue

        if line.startswith("<?"):
            continue

        tag_match = re.match(r"<([a-zA-Z0-9:-]+)\b", line)
        if not tag_match:
            continue

        tag = tag_match.group(1).lower()
        closes_same_line = f"</{tag}>" in line
        self_closing = line.endswith("/>") or tag in VOID_TAGS

        if not closes_same_line and not self_closing and not line.startswith("</"):
            indent += 1

    return "\n".join(formatted) + "\n"


def should_format(path: Path) -> bool:
    if path.suffix.lower() != ".html":
        return False
    return True


def main() -> None:
    changed = 0
    for path in sorted(ROOT.rglob("*.html")):
        if not should_format(path):
            continue
        original = path.read_text(encoding="utf-8", errors="ignore")
        formatted = format_html(original)
        if formatted != original:
            path.write_text(formatted, encoding="utf-8")
            changed += 1
    print(changed)


if __name__ == "__main__":
    main()
