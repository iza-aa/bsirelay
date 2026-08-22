# 📐 EA Codebase Harness — Architecture & Code Patterns Domain
> **Version:** `v5.1.0` | **Last Updated:** `2026-08-21` | **Status:** `Active SSOT (100% Exact Copy-Paste Pilar UI Docs Library)`

Dokumentasi ini adalah **SSOT Domain Arsitektur & Cetak Biru Kode** tim EA. Seluruh penulisan kode komponen, modal, routing, dan integrasi API wajib berpatokan pada **Golden Feature Folder** dan **Pustaka Dokumentasi Fisik 100% Eksak** di folder docs UI library (`ui_library.docs_folder` dari `team.json`; untuk EA: `.agents/pilar-docs/`).

---

## ⛔ BATASAN HAK AKSES & PERMISSION PERINTAH (STRICT BOUNDARIES)

> Semua path di bawah bersifat **repo-relatif** atau dibaca dari `.agents/team.json` — tidak ada path absolut perangkat.

### 1. **Frontend App (repo workspace ini)**
- ✍️ **Write Scope (Area Edit):** Hanya diizinkan mengubah/membuat file di dalam:
  👉 `frontend.module_root` dari `team.json` (EA: `projects/uiigateway/ea/`)
- 🛠️ **Allowed Commands:** Tidak ada build/kompilasi otomatis oleh Agent; verifikasi build dilakukan manual oleh User.
- 🚫 **Dilarang:** `git push`, merge request, `ng build`, `ngx build`, atau `ng build --configuration=production` otomatis.

### 2. **Backend Lumen (`backend.default_repo` dari `team.json`, default `../svc-ea-lumen`)**
- 📖 **Code Access:** Strictly **READ-ONLY** (Hanya dibaca untuk inspeksi Route, Controller, DTO).
- 🛠️ **Allowed Commands HANYA yang tercantum di `backend.allowed_commands` (team.json):**
  1. `git pull` (Untuk mengambil update kode BE terbaru jika diminta user)
  2. `php artisan serve --port=8000` (Untuk menjalankan server BE lokal)
- 🚫 **Dilarang:** Mengubah file BE, `git push`, `artisan migrate`, atau perintah BE lainnya.

### 3. **Pilar UI Library (`ui_library.default_repo` dari `team.json` & Web Docs Server)**
- 📖 **Code Access & Online Docs:** Strictly **READ-ONLY**.
- 🌟 **Link Dokumentasi Utama (WEB DOCS SERVER):** `ui_library.web_docs_url` dari `team.json`.
- 🛠️ **Allowed Commands:** `git pull` (Untuk mengambil update Pilar UI library terbaru).
- 📄 **Fallback:** Jika repo UI library tidak di-clone di perangkat, snapshot docs di `ui_library.docs_folder` adalah yang authoritative.

---

## 📁 INDEX PUSTAKA DOKUMENTASI FISIK 100% EKSAK (`.agents/pilar-docs/`)

Setiap kali Agent hendak menggunakan komponen Pilar UI, Agent **WAJIB MENGOUTPUTKAN / MEMBACA DOKUMEN FISIK 100% EKSAK** berikut dari folder `.agents/pilar-docs/`:

| Kategori | Nama Komponent | Path Dokumen Fisik |
| :--- | :--- | :--- |
| **General** | Button | [pilar-docs/button.md](pilar-docs/button.md) |
| | Badge | [pilar-docs/badge.md](pilar-docs/badge.md) |
| | Chips | [pilar-docs/chips.md](pilar-docs/chips.md) |
| | Tag | [pilar-docs/tag.md](pilar-docs/tag.md) |
| | Services | [pilar-docs/services.md](pilar-docs/services.md) |
| | Timeline | [pilar-docs/timeline.md](pilar-docs/timeline.md) |
| | Quote | [pilar-docs/quote.md](pilar-docs/quote.md) |
| | Rating | [pilar-docs/rating.md](pilar-docs/rating.md) |
| **Form Input** | Form Input | [pilar-docs/form-input.md](pilar-docs/form-input.md) |
| | Dropdown V2 | [pilar-docs/dropdown-v2.md](pilar-docs/dropdown-v2.md) |
| | Switch | [pilar-docs/switch.md](pilar-docs/switch.md) |
| | Date Time Picker V2 | [pilar-docs/date-time-picker-v2.md](pilar-docs/date-time-picker-v2.md) |
| | File Upload V2 | [pilar-docs/file-upload-v2.md](pilar-docs/file-upload-v2.md) |
| | Text Editor (WYSIWYG) | [pilar-docs/text-editor.md](pilar-docs/text-editor.md) |
| | Slider | [pilar-docs/slider.md](pilar-docs/slider.md) |
| **Navigation** | Accordion V2 | [pilar-docs/accordion-v2.md](pilar-docs/accordion-v2.md) |
| | Tabset V2 | [pilar-docs/tabset-v2.md](pilar-docs/tabset-v2.md) |
| | Wizard V2 | [pilar-docs/wizard-v2.md](pilar-docs/wizard-v2.md) |
| | Stepper | [pilar-docs/stepper.md](pilar-docs/stepper.md) |
| | Pagination V2 | [pilar-docs/pagination-v2.md](pilar-docs/pagination-v2.md) |
| **Data Display** | Infobox V2 | [pilar-docs/infobox-v2.md](pilar-docs/infobox-v2.md) |
| | Information | [pilar-docs/information.md](pilar-docs/information.md) |
| | Content Loader | [pilar-docs/content-loader.md](pilar-docs/content-loader.md) |
| | Table V2 | [pilar-docs/table-v2.md](pilar-docs/table-v2.md) |
| | Table Skeleton | [pilar-docs/table-skeleton.md](pilar-docs/table-skeleton.md) |
| **Feedback** | Modal | [pilar-docs/modal.md](pilar-docs/modal.md) |
| | Toast | [pilar-docs/toast.md](pilar-docs/toast.md) |
| | Tooltip | [pilar-docs/tooltip.md](pilar-docs/tooltip.md) |
| | Progress Bar | [pilar-docs/progress-bar.md](pilar-docs/progress-bar.md) |

---

## 🎨 ATURAN FIGMA NODE-ID & KONFIRMASI EKSPLISIT KOMPONEN

> **Node-ID merupakan batas utama implementasi. Ambil satu tampilan penuh sehingga seluruh node dan satu level parent layout terlihat. Gunakan detail screenshot hanya untuk elemen yang tidak terbaca. Jangan mengimplementasikan sibling di luar node kecuali diminta user.**

### ⚠️ **Langkah Konfirmasi Wajib (Sebelum Tulis Kode):**
Setelah Agent mengambil screenshot & menganalisis Node-ID Figma, Agent **DILARANG** langsung menulis kode. Agent **WAJIB** menampilkan ringkasan konfirmasi ke User:
1. **Daftar Komponen UI yang Dideteksi dari Figma.**
2. **Pemetaan Tag Komponen Web Docs Pilar UI di atas yang Akan Digunakan.**
3. **Daftar Komponen yang Perlu Dibuat Custom (jika ada yang missing di Pilar).**
4. **Tanyakan:** *"Apakah rincian komponen di atas sudah sesuai untuk dieksekusi?"* dan **menunggu persetujuan User**.

---

## 🏆 GOLDEN FEATURE ACUAN KODE: `list-service-management`

Segala struktur penulisan kode wajib merujuk pada folder percontohan resmi:
👉 `frontend.golden_feature` dari `team.json` (EA: `projects/uiigateway/ea/src/lib/modules/ea-management/list-service-management/`)
