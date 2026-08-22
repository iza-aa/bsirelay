#!/usr/bin/env bash
# ==============================================================================
# bsirelay — Universal Multi-Agent Installer
# Supports: Antigravity, Claude Code, ZCode, Cursor, Hermes, Codex, OpenCode
# ==============================================================================

set -e

REPO_URL="https://github.com/iza-aa/bsirelay.git"
TARGET_DIR="${1:-.agents}"

echo ""
echo "⚡ bsirelay Installer — Multi-Agent Delivery Framework"
echo "======================================================"

# Check git
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is required but not installed."
    exit 1
fi

echo "📦 Installing bsirelay into: ${TARGET_DIR}..."

if [ -d "${TARGET_DIR}/.git" ]; then
    echo "🔄 Existing installation detected. Updating..."
    (cd "${TARGET_DIR}" && git pull origin main)
elif [ -d "${TARGET_DIR}" ] && [ "$(ls -A "${TARGET_DIR}")" ]; then
    echo "⚠️  Directory ${TARGET_DIR} already exists and is not empty."
    echo "   Cloning skills into ${TARGET_DIR}..."
    git clone --depth 1 "${REPO_URL}" "${TARGET_DIR}_tmp"
    cp -rn "${TARGET_DIR}_tmp/"* "${TARGET_DIR}/" 2>/dev/null || true
    rm -rf "${TARGET_DIR}_tmp"
else
    git clone --depth 1 "${REPO_URL}" "${TARGET_DIR}"
fi

echo "🔧 Configuring agent harness integrations..."

# 1. Claude Code (.claude/skills)
if [ -d ".claude" ] || command -v claude &> /dev/null; then
    mkdir -p .claude/skills
    for skill_dir in "${TARGET_DIR}"/skills/*; do
        if [ -d "$skill_dir" ]; then
            skill_name=$(basename "$skill_dir")
            ln -sfn "../../${TARGET_DIR}/skills/${skill_name}" ".claude/skills/${skill_name}" 2>/dev/null || cp -r "$skill_dir" .claude/skills/
        fi
    done
    echo "  ✅ Claude Code integration linked (.claude/skills/)"
fi

# 2. Antigravity & ZCode (Native .agents/ support)
echo "  ✅ Antigravity & ZCode native discovery ready (.agents/skills/)"

# 3. Cursor (.cursorrules pointer)
if [ -d ".cursor" ] || [ -f ".cursorrules" ]; then
    if [ ! -f ".cursorrules" ]; then
        echo "# Cursor Rules for bsirelay" > .cursorrules
        echo "Always load and respect .agents/teammemory.md and .agents/skills/ before proposing code changes." >> .cursorrules
    fi
    echo "  ✅ Cursor workspace rules ready (.cursorrules)"
fi

# 4. Local configuration template
if [ ! -f "${TARGET_DIR}/config.local.json" ] && [ -f "${TARGET_DIR}/templates/config.default.json" ]; then
    cp "${TARGET_DIR}/templates/config.default.json" "${TARGET_DIR}/config.local.json"
    echo "  ✅ Personal configuration created (${TARGET_DIR}/config.local.json)"
fi

# 5. Pre-cache / Install chrome-devtools-mcp
echo "🌐 Installing and caching Chrome DevTools MCP for Figma inspection..."
if command -v npm &> /dev/null; then
    npm install -g chrome-devtools-mcp 2>/dev/null || npx -y chrome-devtools-mcp@latest --version 2>/dev/null || true
    echo "  ✅ chrome-devtools-mcp cached & ready"
else
    echo "  ⚠️  npm not found; please ensure Node.js is installed"
fi

echo ""
echo "🎉 Installation complete!"
echo "------------------------------------------------------"
echo "👉 Quick Start: Run '/setup' in your agent chat to initialize!"
echo ""
echo "Core commands available:"
echo "  /setup    - Initialize workspace & configure paths"
echo "  /brain    - Read team rules & developer preferences"
echo "  /config   - Manage workspace paths & run health doctor"
echo "  /newtask  - Start task interview & Figma slicing"
echo "  /learn    - Capture human feedback & update memory"
echo "  /update   - Distill feedback logs into permanent rules"
echo "------------------------------------------------------"
echo ""
