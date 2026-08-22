---
name: setup
description: Inisialisasi & orientasi workspace bsirelay untuk developer baru — auto-scaffold config.local.json, setup memory/local.md, install chrome-devtools-mcp, konfigurasi path backend & UI library, serta menjalankan preflight health doctor.
---

# 🚀 Skill Document: `setup` (Workspace Onboarding & Initialization)

## 📖 Deskripsi Skill

Skill `setup` digunakan saat **developer baru pertama kali menggunakan bsirelay** di suatu repository frontend. Skill ini memandu inisialisasi lingkungan lokal dan meng-install dependensi inspeksi Figma (`chrome-devtools-mcp`) secara otomatis agar agent siap bekerja tanpa hambatan path atau tool yang belum terkonfigurasi.

---

## 🔄 ALUR EKSEKUSI (`setup` / `/setup`)

Saat user memanggil `setup` atau `/setup`:

### **Langkah 1 — Auto-Scaffolding File Lokal (Gitignored)**
1. **Periksa `.agents/config.local.json`:**
   - Jika belum ada, salin dari `.agents/templates/config.default.json`.
2. **Periksa `.agents/memory/local.md`:**
   - Jika belum ada, buat file memori pribadi dengan template:
     ```markdown
     # 👤 Developer Personal Memory & Preferences
     > Sifat: Lokal, pribadi, tidak di-commit ke Git.

     ## 📌 Preferensi Komunikasi & Interview
     - Gaya interview: Sekuansial 1-per-1.
     - Kata kunci approval: "go" (atau "run", "proceed").

     ## 📜 Riwayat Koreksi Pribadi (/learn)
     *(Poin koreksi pribadi Anda akan dicatat otomatis di sini)*
     ```

---

### **Langkah 2 — Interactive Configuration Wizard**
Agent menanyakan 2 konfigurasi path lokal kepada developer secara ringkas:

1. **Path Repository Backend Lumen Lokal:**
   - Default: Nilai `backend.default_repo` dari `team.json`.
   - Tanya: *"Di mana letak folder repository Backend lokal Anda? (Ketik path absolut, atau tekan Enter untuk menggunakan default/null jika tidak di-clone)"*
2. **Path Repository Pilar UI Library Lokal:**
   - Default: `null` (Authoritative snapshot docs di `.agents/pilar-docs/`).
   - Tanya: *"Apakah Anda memiliki clone repository UI library lokal? (Ketik path atau tekan Enter untuk menggunakan snapshot dokumen bawaan)"*

> Tulis hasil jawaban user ke `.agents/config.local.json`.

---

### **Langkah 3 — Auto-Install Dependensi Inspeksi Figma (`chrome-devtools-mcp`)**
Agent menjalankan perintah instalasi / caching dependensi agar tidak ada jeda saat inspeksi Figma nanti:

```bash
# Pre-install & cache chrome-devtools-mcp
npm install -g chrome-devtools-mcp 2>/dev/null || npx -y chrome-devtools-mcp@latest --version
```

- Jika agent harness mendukung MCP config file (Claude Code, Cursor, Antigravity), pastikan server `chrome-devtools` terdaftar di konfigurasi MCP lokal:
  ```json
  {
    "mcpServers": {
      "chrome-devtools": {
        "command": "npx",
        "args": ["-y", "chrome-devtools-mcp@latest"]
      }
    }
  }
  ```

---

### **Langkah 4 — Automated Preflight Check (Health Doctor)**
Agent langsung menjalankan pemeriksaan kesehatan workspace (`doctor.sh`):
- Membaca validitas `.agents/team.json`.
- Memeriksa keberadaan `.agents/teammemory.md`.
- Memverifikasi ketersediaan folder modul Frontend (`frontend.module_root`).
- Memeriksa ketersediaan runtime Node.js & Git.
- Memeriksa instalasi `chrome-devtools-mcp` dan status port debugging Chrome (`127.0.0.1:9222`).

---

### **Langkah 5 — Konfirmasi Selesai & Ready to Code**
Tampilkan laporan status ringkas:
```text
🎉 Workspace Setup Selesai!
--------------------------------------------------
✅ Personal Config   : .agents/config.local.json (Ready)
✅ Personal Memory   : .agents/memory/local.md (Ready)
✅ Team SSOT         : .agents/teammemory.md (Loaded)
✅ UI Docs Snapshot  : .agents/pilar-docs/ (Authoritative)
✅ Figma DevTools MCP: chrome-devtools-mcp (Installed & Cached)
✅ Preflight Health  : ALL CHECKS PASS
--------------------------------------------------
🚀 Anda siap mulai bekerja! Ketik /newtask untuk memulai pengerjaan fitur/slicing pertama Anda.
```
