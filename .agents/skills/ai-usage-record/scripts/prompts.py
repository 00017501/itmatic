#!/usr/bin/env python3
"""Helpers for the ai-usage-record skill. Read-only: never writes files.

  prompts.py list [--since ISO_TIMESTAMP] [--dir TRANSCRIPT_DIR]
      Print the messages the user typed in Claude Code sessions for this folder,
      oldest first, after the given timestamp. Skips tool results, system
      reminders, hook output, slash-command wrappers, skill text and interrupts.

  prompts.py check [RECORD]
      Check the record: watermark present, no private paths or secrets,
      no American spellings, and print the prompt count per stage and per tag.
      Exits 1 if a check fails.
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
RECORD = os.path.join(ROOT, "ai-usage", "prompts.md")
WATERMARK = re.compile(r"<!--\s*transcripts-read-up-to:\s*(\S+)\s*-->")


def transcript_dir(given):
    if given:
        return given
    slug = ROOT.replace("/", "-")
    for home in ("~/.claude-personal", "~/.claude"):
        d = os.path.expanduser(f"{home}/projects/{slug}")
        if os.path.isdir(d):
            return d
    sys.exit(f"No transcript folder found for {ROOT}. Pass --dir.")


def typed_text(entry):
    # A message typed while the agent was working is saved as a queued_command attachment.
    att = entry.get("attachment") if entry.get("type") == "attachment" else None
    if isinstance(att, dict) and att.get("type") == "queued_command" and att.get("commandMode") == "prompt":
        return (att.get("prompt") or "").strip() or None
    if entry.get("type") != "user" or entry.get("isMeta") or entry.get("isSidechain"):
        return None
    content = entry.get("message", {}).get("content")
    if isinstance(content, list):
        content = "\n".join(
            x.get("text", "") for x in content if isinstance(x, dict) and x.get("type") == "text"
        )
    text = (content or "").strip()
    if not text or text.startswith("[Request interrupted") or text.startswith("Base directory for this skill"):
        return None
    if text.startswith("<") and not text.startswith("<pasted_content"):
        m = re.search(r"<command-name>(.*?)</command-name>.*?<command-args>(.*?)</command-args>", text, re.S)
        return f"{m.group(1)} {m.group(2)}".strip() if m else None
    return text


def cmd_list(args):
    since, d = "", None
    while args:
        a = args.pop(0)
        if a == "--since":
            since = args.pop(0)
        elif a == "--dir":
            d = args.pop(0)
    if not since and os.path.exists(RECORD):
        m = WATERMARK.search(open(RECORD, encoding="utf8").read())
        since = m.group(1) if m else ""
    rows = []
    for f in glob.glob(os.path.join(transcript_dir(d), "*.jsonl")):
        for line in open(f, encoding="utf8"):
            try:
                e = json.loads(line)
            except ValueError:
                continue
            t = typed_text(e)
            ts = e.get("timestamp", "")
            if t and ts > since:
                rows.append((ts, os.path.basename(f)[:8], t))
    print(f"# Typed messages after {since or 'the start'}: {len(rows)}")
    for ts, sid, t in sorted(rows):
        print(f"\n--- {ts}  session {sid}  ({len(t)} chars)\n{t}")


def cmd_check(args):
    path = args[0] if args else RECORD
    text = open(path, encoding="utf8").read()
    failed = False

    def report(ok, msg):
        nonlocal failed
        print(("PASS  " if ok else "FAIL  ") + msg)
        failed |= not ok

    report(bool(WATERMARK.search(text)), "watermark <!-- transcripts-read-up-to: ... --> present")
    private = re.findall(r"/Users/\S+|~/\S+|\S+@\S+\.\w+|\b(?:sk|ghp|gho|xox[bp])[-_][A-Za-z0-9]{8,}", text)
    report(not private, "no private paths, emails or tokens" + (f": {private[:5]}" if private else ""))
    us = re.findall(r"\b(?:enroll\w*|\w*organiz\w*|colors?|behaviors?|centers?|summariz\w*|recogniz\w*|analyz\w*)\b", text, re.I)
    report(not us, "British spelling" + (f": {sorted(set(us))}" if us else ""))
    todos = re.findall(r"^TODO \(Hamid\):.*$", text, re.M)
    print(f"NOTE  {len(todos)} TODO (Hamid) line(s) left; the zip needs none")

    stage, counts, tags = None, {}, {}
    for line in text.splitlines():
        if line.startswith("## Stage"):
            stage = line[3:]
            counts[stage] = 0
        elif line.startswith("## ") and not line.startswith("## Stage"):
            stage = None
        elif stage and line.startswith("`[Claude"):
            counts[stage] += 1
            tag = re.match(r"`(\[[^\]]+\])`", line).group(1)
            tags[tag] = tags.get(tag, 0) + 1
    print("\nPrompts per stage:")
    for s, n in counts.items():
        print(f"  {n:3}  {s}")
    print("Prompts per tag:")
    for t, n in sorted(tags.items()):
        print(f"  {n:3}  {t}")
    print(f"  {sum(counts.values()):3}  total")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    argv = sys.argv[1:]
    if not argv or argv[0] not in ("list", "check"):
        sys.exit(__doc__)
    (cmd_list if argv[0] == "list" else cmd_check)(argv[1:])
