---
name: config
description: Melihat dan mengelola konfigurasi workspace aktif — path backend dan UI library (via team.json + config.local.json) serta preferensi workspace (scroll direction) untuk workflow pengerjaan task.
---

# ⚙️ Skill Document: `config` (Workspace Config Manager)

## 📖 Deskripsi Skill

Skill ini digunakan untuk melihat, mengecek, dan mengubah path lokasi repository yang digunakan Agent dalam workflow `newtask`. Konfigurasi dibagi menjadi dua sumber:

| Sumber | File | Sifat |
|---|---|---|
| Profil tim | `.agents/team.json` | Di-commit, dibagikan ke seluruh tim |
| Override perangkat | `.agents/config.local.json` | Lokal, tidak di-commit |

## 🔎 Resolusi Path (urutan prioritas)

1. `config.local.json` (path absolut perangkat developer — menang).
2. `team.json` (path default tim, biasanya relatif terhadap akar repo).
3. Relatif terhadap akar repo workspace.

> Path **FE App tidak perlu dikonfigurasi** — akar repo workspace *adalah* aplikasi frontend. Yang perlu dikonfigurasi hanya path repo eksternal: **backend** (`backend.default_repo`) dan **UI library** (`ui_library.default_repo`).

## 📁 KONFIGURASI DEFAULT (dibaca dari `team.json`)

- 📁 **Path FE App:** akar repo workspace ini *(Area Edit: `frontend.module_root`)*
- 📁 **Path Backend:** nilai `backend.default_repo` *(Read-Only)*
- 📁 **Path UI Library:** nilai `ui_library.default_repo` *(Read-Only)*
- 🖱️ **Scroll Direction (Figma DevTools):** `adaptive` *(mulai base `deltaY = -3000` untuk DOWN / `+3000` untuk UP; jika tampilan masih sama/overlapping, naikkan magnitude `+500` per scroll berikutnya; berhenti begitu bottom border node terfoto utuh)*

## 🔄 ALUR EKSEKUSI (`config <subcommand>`)

Skill ini punya 3 subcommand: `status` (default), `set`, dan `doctor`.

### 📊 `config` / `config status` — Tampilkan Konfigurasi Aktif

1. **Baca profil tim** dari `.agents/team.json`, lalu gabungkan dengan override dari `.agents/config.local.json` (jika ada; skema lihat `config.default.json`).
2. **Tampilkan Status Konfigurasi Saat Ini:**
   - Path FE App *(auto: akar repo workspace)* + `frontend.module_root`
   - Path Backend: nilai efektif `backend_repo` (`config.local.json` → `team.json`) + status ada/tidak di disk
   - Path UI Library: nilai efektif `ui_library_repo` + status ada/tidak di disk
   - Jika `ui_library_repo` bernilai `null`/absen → tampilkan: *"repo UI library tidak di-clone di perangkat ini — snapshot `ui_library.docs_folder` adalah authoritative"*
   - Scroll Direction (Figma DevTools): `adaptive` *(SSOT: `skills/newtask/figma-devtools-guide.md`)*
3. **Tanyakan Apakah Ingin Ada Perubahan:**
   - Agent menanyakan: *"Apakah Anda ingin mengubah salah satu konfigurasi ini?"*
   - Option 1: `Tidak` (Tetap gunakan config efektif)
   - Option 2: `1` → Ubah Path Backend
   - Option 3: `2` → Ubah Path UI Library
   - Option 4: `3` → Tampilkan standar **Scroll Direction adaptive** (tidak dapat diubah).
4. **Jika User meminta perubahan Scroll Direction:**
   - Jelaskan bahwa standar Figma DevTools bersifat adaptive: scroll dimulai dari base `deltaY = 3000` (`-3000` untuk DOWN / `+3000` untuk UP), lalu magnitude dinaikkan `+500` per scroll berikutnya apabila tampilan masih sama/overlapping sebelum bottom border node terfoto utuh. Tidak ada mode `fixed`/`natural` alternatif dan tidak ada scroll bertahap tanpa evaluasi.
   - Jangan menulis nilai lain ke field **`SCROLL_DIR`**.

### ✏️ `config set <key> <value>` — Ubah Override Perangkat

1. Key yang diizinkan HANYA: `backend_repo`, `ui_library_repo`, `device`. Key lain → tolak dengan pesan.
2. Nilai `null` diperbolehkan untuk `ui_library_repo` (artinya repo tidak di-clone; snapshot docs authoritative).
3. Tulis perubahan ke `.agents/config.local.json` (BUKAN ke `team.json` — itu milik tim).
4. Tampilkan konfirmasi nilai sebelum → sesudah.

### 🩺 `config doctor` — Preflight Check Workspace

Jalankan pemeriksaan berikut (**read-only** — doctor tidak mengubah file apa pun), lalu laporkan tabel `PASS / WARN / FAIL` per item beserta saran perbaikan:

| # | Check | FAIL jika | WARN jika |
|---|---|---|---|
| 1 | `.agents/team.json` ada & valid JSON, field wajib terisi (`team`, `frontend.module_root`, `frontend.services_file`, `frontend.golden_feature`) | tidak ada / invalid / field kosong | — |
| 2 | `.agents/teammemory.md` ada | tidak ada | — |
| 3 | `.agents/memory/local.md` ada (memori pribadi) | — | belum ada (buat manual, gitignored) |
| 4 | `.agents/config.local.json` valid JSON (jika ada) | syntax error | — |
| 5 | Path FE dari `team.json` ada di disk: `module_root`, `services_file`, `routing_file`, `module_file`, `styles_file`, `golden_feature` | ada yang tidak ada | — |
| 6 | Repo backend: resolve `backend_repo` (local → team.json default); `git -C <path> status` berjalan | path tidak ada | belum pernah di-clone |
| 7 | Repo UI library: resolve `ui_library_repo`; `null`/absen = tidak di-clone | path di-set tapi tidak ada | tidak di-clone → snapshot docs authoritative |
| 8 | `ui_library.docs_folder` ada & berisi minimal 1 file docs | tidak ada / kosong | — |
| 9 | Runtime: `node --version` & `npx --version` jalan | tidak tersedia | — |
| 10 | Figma inspection runtime (chrome-devtools-mcp): cek `npm view chrome-devtools-mcp version` (butuh jaringan); cek endpoint attach `curl -s http://127.0.0.1:9222/json/version` | `node`/`npx` absen (check 9 FAIL) | tidak ada jaringan / endpoint 9222 mati → gunakan mode fresh-launch (D4) |

**Interpretasi hasil:**
- Semua PASS → workspace siap; `/newtask` dapat dijalankan.
- Ada WARN → boleh lanjut, tapi sebutkan implikasinya (mis. snapshot docs dipakai).
- Ada FAIL → sebutkan cara memperbaiki per item; jangan jalankan `/newtask` sebelum FAIL teratasi atau user secara eksplisit melanjutkan.
