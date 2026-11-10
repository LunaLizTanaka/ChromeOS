#!/usr/bin/env python3
"""Build a single-file standalone version of Galaxy Legacy."""
from pathlib import Path
import re
import base64
import json

ROOT = Path(__file__).resolve().parents[1]
package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
version = package["version"]

index = (ROOT / "index.html").read_text(encoding="utf-8")
body_match = re.search(r"<body>([\s\S]*?)</body>", index, re.I)
if not body_match:
    raise SystemExit("Could not find the application body in index.html.")
body = body_match.group(1)
body = re.sub(
    r"\s*<script\s+type=[\"']module[\"']\s+src=[\"']\./src/main\.js[\"']\s*>\s*</script>\s*",
    "\n",
    body,
    flags=re.I,
)

style_paths = [
    "styles/main.css",
    "styles/notes.css",
    "styles/internet.css",
    "styles/library.css",
    "styles/window-resize.css",
]
css = "\n\n".join((ROOT / path).read_text(encoding="utf-8") for path in style_paths)

icon = (ROOT / "assets/galaxy-legacy-icon.svg").read_bytes()
icon_uri = "data:image/svg+xml;base64," + base64.b64encode(icon).decode("ascii")

modules = {
    path.relative_to(ROOT).as_posix(): path.read_text(encoding="utf-8")
    for path in sorted((ROOT / "src").rglob("*.js"))
}
import_re = re.compile(
    r"^\s*import\s+\{([\s\S]*?)\}\s+from\s+(['\"])([^'\"]+)\2\s*;?\s*$",
    re.M,
)
exports_re = re.compile(
    r"^\s*export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)",
    re.M,
)
module_ids = {path: f"__glModule{i}" for i, path in enumerate(modules)}
order = []
visiting = set()
visited = set()


def target_path(from_path: str, specifier: str) -> str:
    if not specifier.startswith("."):
        raise ValueError(f"External import is not supported: {from_path} -> {specifier}")
    parts = from_path.split("/")[:-1]
    for item in specifier.split("/"):
        if not item or item == ".":
            continue
        if item == "..":
            if not parts:
                raise ValueError(f"Import escapes the source root: {from_path} -> {specifier}")
            parts.pop()
        else:
            parts.append(item)
    target = "/".join(parts)
    if target not in modules:
        raise ValueError(f"Module is missing: {target}")
    return target


def visit(path: str) -> None:
    if path in visited:
        return
    if path in visiting:
        raise ValueError(f"Circular module dependency: {path}")
    visiting.add(path)
    for match in import_re.finditer(modules[path]):
        visit(target_path(path, match.group(3)))
    visiting.remove(path)
    visited.add(path)
    order.append(path)


visit("src/main.js")
if len(order) != len(modules):
    unused = sorted(set(modules) - set(order))
    raise ValueError(f"Unreferenced JavaScript modules: {unused}")

sections = []
exports = {}
for path in order:
    source = modules[path]
    names = exports_re.findall(source)
    exports[path] = names

    def replace_import(match: re.Match) -> str:
        imported = match.group(1).strip()
        if re.search(r"\s+as\s+", imported):
            raise ValueError(f"Import alias needs explicit handling in {path}: {imported}")
        target = target_path(path, match.group(3))
        for name in (part.strip() for part in imported.split(",")):
            if name not in exports.get(target, []):
                raise ValueError(f"{name} is not exported by {target} (imported from {path})")
        return f"const {{{imported}}} = {module_ids[target]};"

    source = import_re.sub(replace_import, source)
    if re.search(r"^\s*import\b", source, re.M):
        raise ValueError(f"Unprocessed import remains in {path}.")
    source = re.sub(r"(^\s*)export\s+", r"\1", source, flags=re.M)
    exported_names = "{" + ", ".join(names) + "}" if names else "{}"
    sections.append(
        f"// Bundled module: {path}\n"
        f"const {module_ids[path]} = (() => {{\n{source}\nreturn {exported_names};\n}})();"
    )

bundle = "\n\n".join(sections)
head = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#f5c5d9">
  <meta name="description" content="Galaxy Legacy — desktop web pixel coquette personalizável para ChromeOS.">
  <link rel="icon" href="{icon_uri}" type="image/svg+xml">
  <title>Galaxy Legacy — ChromeOS Desktop v{version} (Standalone)</title>
  <style>
"""
footer = (
    """
  </style>
</head>
<body>
"""
    + body
    + "\n<script>\n"
    + bundle
    + "\n</script>\n</body>\n</html>\n"
)
output = head + css + footer
destination = ROOT / "standalone.html"
destination.write_text(output, encoding="utf-8")

if '<script type="module"' in output or 'src="./src/' in output or 'href="./styles/' in output:
    raise SystemExit("Standalone output still contains modular external references.")
if len(order) != len(modules):
    raise SystemExit("Standalone bundle does not contain every module.")

print(f"Standalone generated: {len(output.encode('utf-8'))} bytes")
print(f"Bundled modules: {len(order)}")
