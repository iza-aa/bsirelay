#!/usr/bin/env bash
# doctor.sh — preflight check workspace agent (Team Agent Framework v5.1, /config doctor)
# Read-only: tidak mengubah file apa pun. Exit 0 = tidak ada FAIL; exit 1 = ada FAIL.
set -uo pipefail

AGENTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$AGENTS_DIR/.." && pwd)"
PASS=0; WARN=0; FAIL=0

report() { # $1=status $2=check $3=detail
  case "$1" in
    PASS) PASS=$((PASS+1)); printf '✅ PASS | %s | %s\n' "$2" "$3";;
    WARN) WARN=$((WARN+1)); printf '⚠️  WARN | %s | %s\n' "$2" "$3";;
    FAIL) FAIL=$((FAIL+1)); printf '❌ FAIL | %s | %s\n' "$2" "$3";;
  esac
}

# ---------- Helper baca konfigurasi (node: parser JSON portabel) ----------
cfg() { # $1 = ekspresi JS yang return string
  (cd "$REPO_ROOT" && node -e "
    const fs=require('fs');
    let team={},local={};
    try{team=JSON.parse(fs.readFileSync('.agents/team.json','utf8'))}catch(e){}
    try{local=JSON.parse(fs.readFileSync('.agents/config.local.json','utf8'))}catch(e){}
    const out=($1);
    console.log(out===null||out===undefined?'':String(out));
  " 2>/dev/null)
}

# ---------- 1. team.json ----------
if [ ! -f "$AGENTS_DIR/team.json" ]; then
  report FAIL "1. team.json" "tidak ada"
elif ! node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$AGENTS_DIR/team.json" 2>/dev/null; then
  report FAIL "1. team.json" "invalid JSON"
else
  MISSING=$(cfg "['team',(team.frontend||{}).module_root,(team.frontend||{}).services_file,(team.frontend||{}).golden_feature].filter(x=>!x).length")
  if [ "${MISSING:-1}" = "0" ]; then
    report PASS "1. team.json" "valid & field wajib terisi (team=$(cfg "team.team"))"
  else
    report FAIL "1. team.json" "field wajib kosong (team/frontend.module_root/services_file/golden_feature)"
  fi
fi

# ---------- 2. teammemory.md ----------
[ -f "$AGENTS_DIR/teammemory.md" ] && report PASS "2. teammemory.md" "ada" || report FAIL "2. teammemory.md" "tidak ada"

# ---------- 3. memory/local.md ----------
[ -f "$AGENTS_DIR/memory/local.md" ] && report PASS "3. memory/local.md" "ada" || report WARN "3. memory/local.md" "belum ada (buat manual; gitignored)"

# ---------- 4. config.local.json ----------
if [ -f "$AGENTS_DIR/config.local.json" ]; then
  if node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$AGENTS_DIR/config.local.json" 2>/dev/null; then
    report PASS "4. config.local.json" "valid JSON (device=$(cfg "local.device"))"
  else
    report FAIL "4. config.local.json" "syntax error"
  fi
else
  report WARN "4. config.local.json" "belum ada (opsional; override per perangkat)"
fi

# ---------- 5. Path FE dari team.json ----------
FE_KEYS="module_root services_file routing_file module_file styles_file golden_feature"
FE_FAIL=0
for K in $FE_KEYS; do
  V=$(cfg "(team.frontend||{})['$K']")
  if [ -z "$V" ] || [ ! -e "$REPO_ROOT/$V" ]; then report FAIL "5. frontend.$K" "tidak ada di disk: $V"; FE_FAIL=1; fi
done
[ "$FE_FAIL" = "0" ] && report PASS "5. frontend paths" "semua path team.json ada di disk"

# ---------- Helper: resolve path relatif terhadap akar repo ----------
resolve() { # $1 = path mungkin relatif
  case "$1" in
    /*) printf '%s' "$1";;
    *) printf '%s' "$REPO_ROOT/$1";;
  esac
}

# ---------- 6. Repo backend ----------
BE=$(cfg "local.backend_repo!==undefined?local.backend_repo:(team.backend||{}).default_repo")
BER=$(resolve "$BE")
if [ -z "$BE" ]; then
  report WARN "6. backend repo" "tidak dikonfigurasi"
elif [ ! -d "$BER" ]; then
  report FAIL "6. backend repo" "path di-set tapi tidak ada: $BE (resolved: $BER)"
elif git -C "$BER" status >/dev/null 2>&1; then
  report PASS "6. backend repo" "ada & git valid: $BE"
else
  report FAIL "6. backend repo" "ada tapi bukan repo git: $BE"
fi

# ---------- 7. Repo UI library ----------
UL=$(cfg "local.ui_library_repo!==undefined?local.ui_library_repo:(team.ui_library||{}).default_repo")
ULR=$(resolve "$UL")
if [ -z "$UL" ] || [ "$UL" = "null" ]; then
  report WARN "7. ui_library repo" "tidak di-clone — snapshot docs authoritative"
elif [ ! -d "$ULR" ]; then
  report FAIL "7. ui_library repo" "path di-set tapi tidak ada: $UL (resolved: $ULR)"
else
  report PASS "7. ui_library repo" "ada: $UL"
fi

# ---------- 8. docs folder ----------
DF=$(cfg "(team.ui_library||{}).docs_folder")
DN=$(ls -1 "$REPO_ROOT/$DF" 2>/dev/null | wc -l | tr -d ' ')
if [ -z "$DF" ] || [ ! -d "$REPO_ROOT/$DF" ]; then
  report WARN "8. ui_library.docs_folder" "belum diunduh (opsional: jalankan sync-ui-docs.sh)"
elif [ "$DN" -lt 1 ]; then
  report WARN "8. ui_library.docs_folder" "kosong (opsional: jalankan sync-ui-docs.sh)"
else
  report PASS "8. ui_library.docs_folder" "$DF ($DN entri)"
fi

# ---------- 9. Runtime node/npx ----------
if command -v node >/dev/null 2>&1 && command -v npx >/dev/null 2>&1; then
  report PASS "9. runtime" "node $(node --version), npx $(npx --version | head -1)"
else
  report FAIL "9. runtime" "node/npx tidak tersedia"
fi

# ---------- 10. chrome-devtools-mcp + mode D4 ----------
if command -v node >/dev/null 2>&1; then
  MCPV=$(npm view chrome-devtools-mcp version 2>/dev/null || true)
  if [ -n "$MCPV" ]; then
    DETAIL="chrome-devtools-mcp@$MCPV tersedia via npx"
  else
    MCPV="?"; DETAIL="tidak bisa cek versi (tanpa jaringan?) — npx -y chrome-devtools-mcp@latest tetap bisa dicoba"
  fi
  if curl -sf --max-time 2 http://127.0.0.1:9222/json/version >/dev/null 2>&1; then
    report PASS "10. figma runtime" "$DETAIL; endpoint 9222 LIVE → mode attach tersedia"
  else
    report WARN "10. figma runtime" "$DETAIL; endpoint 9222 mati → gunakan mode fresh-launch (D4)"
  fi
else
  report FAIL "10. figma runtime" "node absen (check 9 FAIL)"
fi

echo "――――――――――――――――――――――――――――――"
echo "Ringkasan: $PASS PASS · $WARN WARN · $FAIL FAIL"
[ "$FAIL" = "0" ] && echo "✅ Workspace siap — /newtask dapat dijalankan." || echo "❌ Ada FAIL — atasi dulu (lihat tabel) sebelum /newtask."
exit $([ "$FAIL" = "0" ] && echo 0 || echo 1)
