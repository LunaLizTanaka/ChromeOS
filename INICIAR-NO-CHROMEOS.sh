#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Galaxy Legacy: http://localhost:8000"
echo "Pressione Ctrl+C para encerrar."
python3 -m http.server 8000
