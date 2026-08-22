---
name: newtask
description: Workflow terstruktur untuk agent dalam membaca desain Figma, slicing UI sesuai framework tim (dari team.json), integrasi API backend, serta Fixing Bug / Refactoring kode secara lokal.
---

# 🛠️ Skill Document: `newtask` (Workflow Interview & Routing Domain)

## 📖 Deskripsi Workflow
Workflow ini menangani **Interview Sekuansial 1-per-1** dan routing domain pengerjaan task (Fitur Baru / Slicing, API Integration, atau Bug Fix / Refactoring). Seluruh path dan konvensi spesifik tim dibaca dari `.agents/team.json`.

---

## 🚨 PHASE 0 — PRASYARAT ABSOLUT SEBELUM TINDAKAN APA PUN

Saat `/newtask` dimulai, tindakan pertama Agent **WAJIB** membaca seluruh file memori `.agents/teammemory.md`, `.agents/memory/local.md` (jika ada), dan `.agents/team.json`. Agent **DILARANG** menanyakan Scope Pekerjaan, membuka Figma, menampilkan Progress List, menginspeksi codebase, menjalankan command, atau melakukan tindakan task lainnya sebelum pembacaan Phase 0 selesai.

## 🔄 ALUR INTERVIEW SEKUANSIAL 1-PER-1 (SETELAH PHASE 0 SELESAI)

Agent **WAJIB** menanyakan **SCOPE PEKERJAAN TERLEBIH DAHULU**, kemudian melanjutkan pertanyaan berikutnya secara sekuansial 1-per-1:

### **Langkah 1 (Pertanyaan Pertama - Wajib):**
Tanyakan ke User: **"Apa Scope Pekerjaan untuk Task ini?"**
- Option 1: `Full` (Slicing UI Figma + Integrasi API Backend)
- Option 2: `UI Only` (Slicing UI Figma saja)
- Option 3: `API Integration Only` (Integrasi API Backend ke UI yang sudah ada)
- Option 4: `Bug Fix / Refactor` (Perbaikan bug / refactoring fitur yang sudah ada)

---

### **Langkah 2 dst (Dinamis Sesuai Pilihan Scope):**

#### **Jika User Memilih `Full` (UI + API):**
- Pertanyaan 2: **Link Figma Permalink Utama** (URL spesifik ke frame/node KESELURUHAN halaman/screen)
- Pertanyaan 3: **Nama Modul / Fitur**
- Pertanyaan 4: **Status API Backend** (`1. Sudah Siap (Repo BE Lokal)`, `2. Sudah Siap (Lisan/Postman)`, `3. Belum Siap`, atau `4. Perlu Git Pull`)
- Pertanyaan 5: **Catatan Khusus / Custom Instructions** (Opsional)

#### **Jika User Memilih `UI Only`:**
- Pertanyaan 2: **Link Figma Permalink Utama** (URL spesifik ke frame/node KESELURUHAN halaman/screen)
- Pertanyaan 3: **Nama Modul / Fitur**
- Pertanyaan 4: **Catatan Khusus / Custom Instructions** (Gunakan opsi umum/general seperti: `1. Sesuai standar project & Figma`, `2. Tuliskan catatan khusus`)

#### **Jika User Memilih `API Integration Only`:**
- Pertanyaan 2: **Pilihan File Dokumentasi API di folder `backend.api_docs_folder` (dari `team.json`)**
  - Agent **WAJIB** mengecek isi folder tersebut dan menanyakan ke User: *"Dokumentasi API mana yang ingin digunakan?"* (menampilkan opsi daftar file `*.md` di folder tersebut + opsi `Tidak ada MD (Agent git pull & cek sendiri ke folder Backend)`).
  - *Jika User memilih file MD*: Agent membaca & mematuhi 100% isi file MD tersebut sebagai SSOT API tanpa perlu mengecek folder Backend.
- Pertanyaan 3: **Endpoint-endpoint ini akan diterapkan di page mana?** (Sebutkan rute URL page)
- Pertanyaan 4: **Catatan Khusus / Custom Instructions** (Opsional)

#### **Jika User Memilih `Bug Fix / Refactor`:**
- Pertanyaan 2: **Nama Modul / Komponen / Halaman yang bermasalah**
- Pertanyaan 3: **Deskripsi Bug / Ekspektasi Perbaikan**
- Pertanyaan 4: **Apakah perlu inspeksi Backend / UI Library?** (`Ya` / `Tidak`)
- Pertanyaan 5: **Catatan Khusus / Log Error (Opsional)**

---

## 🔄 TAHAPAN EKSEKUSI (CONTEXT-AWARE DOMAIN LOADING)

Sebelum dan selama pengerjaan task, Agent **WAJIB** mengeksekusi tahapan berikut:

0. **Phase 0 — Reading Team & Personal Memory (SSOT Check — tindakan pertama):**
   - **⚠️ PRASYARAT WAJIB MEMBACA MEMORI SEBELUM TINDAKAN APA PUN:** Agent **WAJIB** membaca `.agents/teammemory.md`, `.agents/memory/local.md` (jika ada), dan `.agents/team.json` terlebih dahulu untuk meninjau seluruh aturan tim, preferensi User, dan riwayat koreksi interrupt (`/learn`) yang pernah terjadi agar tidak mengulangi kesalahan masa lalu. Phase 0 harus selesai sebelum interview, inspeksi, command, atau penulisan file apa pun.
1. **Phase 0.1 — PRA-Implementasi Gateway Pengaturan (jika `gateway.admin_url` ada di `team.json`):**
   Verifikasi pendaftaran Menu & Otorisasi API di `gateway.admin_url`.
2. **Phase 1 — Visual Inspection, Progress List & HTML Plan:**
   - **Langkah 1:** Tampilkan **Progress List** pengerjaan task.
   - **Langkah 2 (Figma Chrome DevTools Inspection):**
     - Agent **WAJIB** mematuhi panduan di [figma-devtools-guide.md](figma-devtools-guide.md) untuk inspeksi WebGL canvas dan zoom.
     - **⚠️ AUTOMATIC SCROLL ADAPTIF (BASE 3000 + INCREMENT 500):** Setelah screenshot segmen atas, jika bottom border node belum terfoto utuh, Agent **DILARANG MENANYAKAN PILIHAN KEPADA USER**. Agent **WAJIB LANGSUNG AUTO-SCROLL** canvas ke bawah dimulai dari base `deltaY = 3000` (`-3000` untuk DOWN). Jika tampilan foto masih sama/overlapping sebelum bottom border terfoto, naikkan magnitude `deltaY` sebesar `+500` (`-3500`, `-4000`, dst) pada scroll berikutnya, dan **LANGSUNG BERHENTI** begitu bottom border terfoto utuh.
   - **Langkah 3 (Hirarki Komponen & Inspeksi Codebase Minimal 3 Page):**
     - **⚠️ INSPEKSI CODEBASE MINIMAL 3 FOLDER/PAGE:** Sebelum membuat pemetaan HTML & TS, Agent **WAJIB** membaca dan menginspeksi minimal 3 pasang file HTML & TS dari folder page yang BERBEDA di `frontend.module_root` (dari `team.json`) untuk mempelajari konvensi penamaan variabel, struktur HTML, dan pola arsitektur yang sudah ada.
     - **⚠️ DILARANG BUAT BREADCRUMB:** Dilarang membuat header breadcrumb (`page-titles`, `ol.breadcrumb`), karena breadcrumb diatur oleh host app container.
     - **⚠️ DILARANG UBAH PUBLIC-API.TS:** Dilarang membuat/mengubah file `public-api.ts` atau file di luar permintaan eksplisit User.
     - **⚠️ TAHAP ALUR PENCARIAN KOMPONEN:**
       1. **UI LIBRARY (`ui_library.docs_folder` dari `team.json`)**: Cek apakah komponen tersedia di UI library tim.
       2. **DEPENDENCY (`package.json`)**: Cek library npm yang sudah ada di project.
       3. **EXISTING FILE / FOLDER (`frontend.module_root`)**: Cek implementasi/pola serupa di komponen yang sudah ada.
     - **⚠️ WAJIB HIGHLIGHT CUSTOM COMPONENT:** Tampilkan tabel terpisah yang secara eksplisit menghighlight komponen yang harus dibuat **CUSTOM** (jika tidak ada di UI library maupun Dependency), beserta alasan teknisnya.
     - **WAJIB menjabarkan rancangan struktur kode HTML (`.component.html`) secara eksplisit & lengkap di pesan obrolan**, serta skema **Data Dummy** lengkap di `.ts`.
   - **Langkah 4 (WAIT FOR APPROVAL - Kata Kunci "go"):**
     - **AGENT DILARANG MENULIS KODE FILE FISIK** sebelum User secara eksplisit mengonfirmasi dengan mengetik kata kunci **`"go"`** (atau variasi konfirmasi: `"run"`, `"proceed"`, `"yes"`).
3. **Phase 2 — Slicing UI & Dummy Data (`frontend.module_root` dari `team.json`):**
   - Jalankan pemuatan kode fisik setelah menerima kata kunci konfirmasi **`"go"`**.
   - Gunakan cetakan golden feature (`frontend.golden_feature` dari `team.json`) dari [harness.md](../../harness.md).
   - **WAJIB menyediakan Data Dummy Lengkap:** Komponen `.ts` harus langsung diisi mock data lengkap (baris tabel, angka infobox stat, status validasi) agar tampilan UI langsung terisi kaya menyerupai Figma.
4. **Phase 3 & 4 — Inspeksi Backend & Integrasi API (API Tasks Only):**
   - Agent **WAJIB** menyajikan rancangan integrasi **SANGAT DETAIL PER ENDPOINT**, mencakup:
     1. Nama Endpoint & HTTP Method
     2. URL Route Page
     3. Nama Komponen & Path File Fisik Angular (`.component.ts`, `.component.html`, services file)
     4. Method pemicu & binding state data pada komponen.
   - Jalankan server backend lokal bila diperlukan (hanya perintah yang diizinkan di `backend.allowed_commands` dari `team.json`) & daftarkan 100% endpoint di `frontend.services_file` (dari `team.json`).
5. **Phase 5 — Review Manual User (No Auto Build):**
   Agent **DILARANG** menjalankan build/kompilasi terminal secara otomatis. Setelah penulisan file fisik selesai, proses review dan verifikasi build dilakukan sepenuhnya secara manual oleh User.
