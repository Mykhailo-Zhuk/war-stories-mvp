#!/usr/bin/env python3
"""
md-to-article.py — переносить Obsidian .md нотатки в OPE-5 (knowledge_articles)
та OPE-6 (stories) через Supabase.

Використання:
  # OPE-5 — створити статтю знань
  python3 scripts/md-to-article.py ope5 /шлях/до/нотатки.md
  
  # OPE-6 — створити історію  
  python3 scripts/md-to-article.py ope6 /шлях/до/нотатки.md
  
  # Всі .md з папки
  python3 scripts/md-to-article.py ope5 ~/obsidian/Projects/*.md
"""

import os
import sys
import json
import re
import argparse
from datetime import datetime
from pathlib import Path

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Потрібен supabase-py: pip install supabase")
    sys.exit(1)


# ─── Supabase config ──────────────────────────────────────
# Бере з .env або змінних середовища
SUPABASE_CONFIGS = {
    "ope5": {
        "url": os.getenv("OPE5_SUPABASE_URL", ""),
        "key": os.getenv("OPE5_SUPABASE_SERVICE_KEY", ""),
        "table": "knowledge_articles",
        "columns": ["title", "content", "type", "category", "tags"],
    },
    "ope6": {
        "url": os.getenv("OPE6_SUPABASE_URL", ""),
        "key": os.getenv("OPE6_SUPABASE_SERVICE_KEY", ""),
        "table": "stories",
        "columns": ["title", "content", "location", "tags", "status", "user_id"],
    },
}


def get_env_paths() -> dict:
    """Шукає .env в домашній директорії або поруч зі скриптом."""
    search = [
        Path.home() / ".env",
        Path(__file__).resolve().parent.parent / ".env",
        Path(__file__).resolve().parent / ".env",
    ]
    for p in search:
        if p.exists():
            with open(p) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            break


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Парсинг YAML frontmatter з .md файлу."""
    frontmatter = {}
    content = text

    # Obsidian frontmatter: --- ... ---
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if m:
        raw = m.group(1)
        content = text[m.end():]
        for line in raw.strip().split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                # Теги можуть бути списком: [tag1, tag2] або "tag1, tag2"
                if k == "tags":
                    if v.startswith("["):
                        v = [t.strip().strip('"').strip("'") for t in v.strip("[]").split(",")]
                    else:
                        v = [t.strip() for t in v.split(",") if t.strip()]
                frontmatter[k] = v

    return frontmatter, content.strip()


def extract_obsidian_links(text: str) -> str:
    """[[Нотатка]] → Нотатка (посилання в Obsidian не конвертуємо)."""
    return re.sub(r"\[\[([^\]]+)\]\]", r"\1", text)


def build_payload_ope5(frontmatter: dict, body: str) -> dict:
    """Збирає payload для knowledge_articles (OPE-5)."""
    return {
        "title": frontmatter.get("title", body.split("\n")[0][:80]),
        "content": body,
        "type": frontmatter.get("type", "article"),
        "category": frontmatter.get("category") or frontmatter.get("relates-to", "").replace("[[", "").replace("]]", ""),
        "tags": frontmatter.get("tags", []),
    }


def build_payload_ope6(frontmatter: dict, body: str) -> dict:
    """Збирає payload для stories (OPE-6)."""
    # Для OPE-6 потрібен user_id (service role може писати без цього, 
    # але краще вказати явно)
    return {
        "title": frontmatter.get("title", body.split("\n")[0][:80]),
        "content": body,
        "location": frontmatter.get("location") or frontmatter.get("relates-to", ""),
        "tags": frontmatter.get("tags", []),
        "status": "published",
    }


def process_file(project: str, filepath: str, supabase: Client, user_id: str = None) -> bool:
    """Обробляє один .md файл."""
    path = Path(filepath)
    if not path.exists():
        print(f"  ❌ Файл не знайдено: {path}")
        return False

    with open(path, encoding="utf-8") as f:
        raw = f.read()

    frontmatter, body = parse_frontmatter(raw)
    body = extract_obsidian_links(body)

    config = SUPABASE_CONFIGS[project]

    if project == "ope5":
        payload = build_payload_ope5(frontmatter, body)
    else:
        payload = build_payload_ope6(frontmatter, body)
        if user_id:
            payload["user_id"] = user_id

    # Перевірка чи вже існує така стаття (за заголовком)
    existing = supabase.table(config["table"]).select("id").eq("title", payload["title"]).execute()
    if existing.data:
        print(f"  ⏭ Вже існує: {payload['title']}")
        return True

    result = supabase.table(config["table"]).insert(payload).execute()

    if hasattr(result, 'error') and result.error:
        print(f"  ❌ Помилка: {result.error}")
        return False

    print(f"  ✅ {payload['title']}")
    return True


def main():
    get_env_paths()

    parser = argparse.ArgumentParser(description="Перенесення .md нотаток у веб-проект")
    parser.add_argument("project", choices=["ope5", "ope6"], help="OPE-5 (MIL-FPV) або OPE-6 (War Stories)")
    parser.add_argument("files", nargs="+", help="Шлях до .md файлу(ів)")
    parser.add_argument("--user-id", help="ID користувача в Supabase (для OPE-6)")
    args = parser.parse_args()

    config = SUPABASE_CONFIGS[args.project]
    if not config["url"] or not config["key"]:
        print(f"❌ Не налаштовано Supabase для {args.project}")
        print(f"   Додай в .env:")
        print(f"   {args.project.upper()}_SUPABASE_URL=...")
        print(f"   {args.project.upper()}_SUPABASE_SERVICE_KEY=...")
        sys.exit(1)

    supabase: Client = create_client(config["url"], config["key"])

    success = 0
    fail = 0

    print(f"\n📄 Перенесення в {args.project.upper()}")
    print("=" * 50)

    for f in args.files:
        name = Path(f).name
        print(f"  {name}:")
        if process_file(args.project, f, supabase, args.user_id):
            success += 1
        else:
            fail += 1

    print("=" * 50)
    print(f"✅ Успішно: {success} | ❌ Помилок: {fail}")


if __name__ == "__main__":
    main()
