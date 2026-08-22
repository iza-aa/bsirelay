#!/usr/bin/env bash
# ==============================================================================
# sync-ui-docs.sh — Syncs Pilar UI Docs from private repository
# ==============================================================================
set -uo pipefail

AGENTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_DIR="$AGENTS_DIR/pilar-docs"
DOCS_REPO="https://github.com/iza-aa/pilar-docs.git"

echo "🔄 Syncing Pilar UI Documentation..."

if [ -d "$DOCS_DIR/.git" ]; then
    echo "📦 Updating existing pilar-docs repository..."
    if (cd "$DOCS_DIR" && git pull origin main >/dev/null 2>&1); then
        echo "✅ Pilar Docs updated successfully."
        exit 0
    else
        echo "⚠️  Could not pull latest updates from $DOCS_REPO (authentication or network required)."
        exit 0
    fi
fi

if [ -d "$DOCS_DIR" ] && [ "$(ls -A "$DOCS_DIR" 2>/dev/null)" ]; then
    echo "✅ Local pilar-docs snapshot is active ($(ls -1 "$DOCS_DIR" | wc -l | tr -d ' ') files)."
    exit 0
fi

echo "📥 Cloning private pilar-docs from GitHub ($DOCS_REPO)..."
if git clone --depth 1 "$DOCS_REPO" "$DOCS_DIR" 2>/dev/null; then
    echo "✅ Pilar Docs cloned successfully ($(ls -1 "$DOCS_DIR" | wc -l | tr -d ' ') files)."
else
    echo "⚠️  Pilar Docs repository is private and was skipped (access/auth required)."
    echo "💡 Tip: Once you have access, run '.agents/scripts/sync-ui-docs.sh' to download the docs."
    # Graceful exit without error
    exit 0
fi
