import json
import re
import unicodedata
from pathlib import Path

COURSES = [
    ("preschool", "Preschool"),
    ("kindergarten", "Kindergarten"),
    ("elementary", "Elementary"),
    ("middle-school", "Middle School"),
    ("summer-school", "Summer School"),
    ("high-school", "High School"),
    ("undergraduate-freshman", "Undergraduate - Freshman"),
    ("undergraduate-sophomore", "Undergraduate - Sophomore"),
    ("undergraduate-junior", "Undergraduate - Junior"),
    ("undergraduate-senior", "Undergraduate - Senior"),
    ("graduation", "Graduation"),
]

SECTION_RE = re.compile(r"^### (.+?)\s*$")
LINKED_RE = re.compile(r"^ {4}(\d+)\.\s+\[(.+?)\]\((https://www\.babypips\.com/learn/forex/[^)]+)\)(.*)$")
BARE_RE = re.compile(r"^ {4}(\d+)\.\s+(.*?)\s*$")
STOP_HEADINGS = ("#### Trusted Partners", "#### Latest", "## Latest", "#### Popular")


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text


def clean_title(title):
    title = title.strip()
    # BabyPips tags newer lessons with a trailing "New" badge that bleeds into the text.
    title = re.sub(r"\s*New$", "", title)
    return title.strip()


def parse(path, course_slug):
    lines = Path(path).read_text(encoding="utf-8").splitlines()
    sections = []
    current = None
    started = False
    pending_desc_for = None

    for i, line in enumerate(lines):
        if any(line.startswith(h) for h in STOP_HEADINGS):
            if started:
                break
            continue

        m = SECTION_RE.match(line)
        if m and not line.startswith("### ["):
            title = clean_title(m.group(1))
            grade = None
            gm = re.match(r"^Grade (\d+)\s*(.*)$", title)
            if gm:
                grade = int(gm.group(1))
                title = gm.group(2).strip()
            current = {
                "slug": slugify(title),
                "title": title,
                "grade": grade,
                "summary": "",
                "lessons": [],
            }
            sections.append(current)
            started = True
            pending_desc_for = None
            continue

        if current is None:
            continue

        m = LINKED_RE.match(line)
        if m:
            title = clean_title(m.group(2))
            current["lessons"].append({
                "slug": m.group(3).rsplit("/", 1)[-1],
                "title": title,
                "summary": m.group(4).strip(),
                "source": m.group(3),
            })
            pending_desc_for = None
            continue

        m = BARE_RE.match(line)
        if m and m.group(2):
            title = clean_title(m.group(2))
            lesson = {
                "slug": slugify(title),
                "title": title,
                "summary": "",
                "source": f"https://www.babypips.com/learn/forex/{course_slug}",
            }
            current["lessons"].append(lesson)
            pending_desc_for = lesson
            continue

        stripped = line.strip()
        if pending_desc_for is not None and stripped:
            if pending_desc_for["summary"]:
                pending_desc_for["summary"] += " " + stripped
            else:
                pending_desc_for["summary"] = stripped
            continue

        if stripped and not current["lessons"] and not current["summary"] and not stripped.startswith(("[", "#", "!", "*")):
            current["summary"] = stripped

    return [s for s in sections if s["lessons"]]


out = []
total = 0
for slug, title in COURSES:
    sections = parse(f"/tmp/bp/{slug}.md", slug)
    count = sum(len(s["lessons"]) for s in sections)
    total += count
    out.append({"slug": slug, "title": title, "sections": sections, "lessonCount": count})
    print(f"{title:32} sections={len(sections):2}  lessons={count:3}")

print(f"{'TOTAL':32}                lessons={total}")
Path("/tmp/bp/syllabus.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
