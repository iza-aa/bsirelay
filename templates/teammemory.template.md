# 🧠 Team Memory EA — Aturan Tim & Riwayat Koreksi (`/learn`)
> **Version:** `v5.1.0` | **Last Updated:** `2026-08-21` | **Status:** `Active SSOT (Team Layer)`

Dokumen ini adalah **Single Source of Truth (SSOT)** aturan yang berlaku untuk **seluruh tim EA** (di-commit & dibagikan). Preferensi pribadi per-developer TIDAK disimpan di sini — melainkan di `.agents/memory/local.md` (gitignored).

---

## 📌 CETAK BIRU ARSITEKTUR KODE (CODEBASE HARNESS)

👉 Untuk cetak biru arsitektur kode, pustaka dokumentasi eksak copy-paste (`.agents/pilar-docs/`, path via `ui_library.docs_folder` di `team.json`), template penulisan (Module, Component TS/HTML/SCSS, Routing, Service), dan batasan perintah lokal, Agent **WAJIB MENGIKUTI 100% CETAK BIRU DI [.agents/docs/harness.md](harness.md)** tanpa perlu meneliti file project lain dari nol.

---

## ⚙️ KONFIGURASI WORKSPACE

> Seluruh path & konvensi tim dikelola terpusat — **DILARANG hardcode path absolut** di file mana pun:

| Kebutuhan | Sumber SSOT | Alat |
|---|---|---|
| Identitas tim, path FE/BE/UI-lib, golden feature, whitelist perintah | `.agents/team.json` | `/config` |
| Override path absolut per perangkat | `.agents/config.local.json` *(gitignored)* | `/config set` |
| Standar scroll Figma DevTools (adaptive base 3000 + 500) | `.agents/skills/newtask/figma-devtools-guide.md` *(satu-satunya SSOT)* | — |

Path FE App **tidak perlu dikonfigurasi** — akar repo workspace *adalah* aplikasi frontend (area edit: `frontend.module_root` dari `team.json`).

---

## 📌 ATURAN UTAMA WORKSPACE (ATURAN TIM)

1. **LARANGAN KERAS MENGARANG (ZERO HALLUCINATION RULE):**
   - Agent **DILARANG KERAS MENGARANG** atau merekonstruksi sintaks/komentar/dokumen dari ingatan!
   - Semua sampel HTML, komentar TypeScript, dan referensi CSS **WAJIB MENGIKUTI 100% TEKS DOKUMENTASI FISIK** di folder docs UI library (`ui_library.docs_folder` dari `team.json`; untuk EA: `.agents/pilar-docs/`).

2. **Alur Interview Sekuansial:**
   - Urutan pertanyaan interview (diawali **Scope Pekerjaan**: `Full`, `UI Only`, `API Integration Only`, atau `Bug Fix / Refactor`) diatur oleh skill framework `skills/newtask/SKILL.md`.
   - Gaya penyajian 1-per-1 (bukan form panjang) adalah **preferensi pribadi developer** → lihat `.agents/memory/local.md`.

3. **Konfirmasi Wajib Komponen Figma & UI Library:**
   - Setelah inspeksi Node-ID Figma, Agent **WAJIB MENGONFIRMASI RINCIAN KOMPONEN** yang dideteksi & pemetaan tag UI library (EA: Pilar UI V2) yang akan dipakai ke User sebelum mulai menulis kode.

4. **PRA-Implementasi Gateway Pengaturan Check:**
   - Memverifikasi pendaftaran Menu (Individu/Sub Menu) dan Otorisasi API di `gateway.admin_url` (dari `team.json`) sebelum integrasi agar tidak `401 Unauthorized`.

5. **Izin Perintah Repo Eksternal (Read-Only):**
   - Repo backend & UI library bersifat **read-only**; perintah yang diizinkan HANYA yang tercantum di `backend.allowed_commands` dan `ui_library.allowed_commands` (dari `team.json`).

6. **Lingkungan Lokal Murni:**
   - Tidak boleh ada `git push`, MR, atau production build.

---

## ⚠️ RIWAYAT INTERRUPT & KOREKSI USER (`/learn`)

*Poin koreksi baru dicatat otomatis di bawah ini saat `/learn` dipanggil:*

- [2026-07-28] **Workflow Interview:** User tidak menyukai form instan panjang. Bertanya harus sekuansial 1-per-1 diawali dari Scope Pekerjaan.
- [2026-07-28] **Config Command:** Pengaturan path dipisahkan menjadi command tersendiri (`/eaconfig`).
- [2026-07-31] **Architectural Harness v4.0.0:** Seluruh penulisan kode wajib mematuhi cetak biru arsitektur di `.agents/docs/harness.md` berbasis golden feature `list-service-management` & 100% pustaka dokumentasi eksak copy-paste di `.agents/pilar-docs/`.
- [2026-07-31] **BE & Pilar Commands Boundary:** Di repo BE `svc-ea-lumen` diizinkan `git pull` & `php artisan serve --port=...`. Di repo Pilar `lib-uii-gateway-pilar-angular` diizinkan `git pull`.
- [2026-07-31] **Gateway Pengaturan:** Verifikasi pendaftaran Menu (Induk & Sub Menu) dan Assignment API di Gateway Pengaturan sebelum integrasi.
- [2026-07-31] **Figma Node & Component Confirmation:** Agent wajib mengonfirmasi rincian komponen Figma & pemetaan Pilar UI ke User sebelum membuat file kode.
- [2026-07-31] **Koreksi Mengarang (/learn TRIGGERED):** Agent dilarang keras mengarang atau mensintesis sintaks/komentar kode dari asumsi. Semua rujukan wajib diambil 100% langsung dari file `.agents/pilar-docs/` tanpa pengubahan.
- [2026-08-02] **Workflow Standard Newtask Slicing:**
  1. Tampilkan **Progress List** langkah pengerjaan.
  2. Buka link Figma Node via **Chrome DevTools MCP**. Ikuti **9 Step resep eksak** di [`figma-devtools-guide.md`](skills/newtask/figma-devtools-guide.md) — mencakup: **Foto 1 Overview (Zoom ~25-30%)** untuk Peta Makro Komponen (Atas $\rightarrow$ Bawah), **Zoom-in adaptif ke 80%**, **Foto 2, 3, 4 (Zoom 80%)** via format baku canvas scroll (fixed `deltaY = -2700` untuk DOWN / `+2700` untuk UP) untuk Verifikasi Bukti Mikro (background `#FAFAFA`, border-radius, alignment width button filter, legenda chart, badge), dan konfirmasi komponen ke user.
  3. Opsi `ask_question` WAJIB general/umum. DILARANG opsi kaku spesifik teknis.
  4. **DILARANG AUTO PROCEED:** Tunggu kata kunci **`"go"`** sebelum menulis file fisik.
- [2026-08-02] **Inspeksi Figma Node Penuh & Highlight Custom Components (/learn TRIGGERED):**
  1. Agent **WAJIB** melakukan scroll down dan screenshot hingga bagian paling bawah dari node Figma benar-benar terlihat (bottom border garis biru/hijau penuh terfoto secara utuh). Dilarang berhenti prematur sebelum ujung bawah node terjangkau.
  2. Agent **WAJIB** menghighlight **CUSTOM Component** secara terpisah dan eksplisit dalam tabel konfirmasi, disertai penjelasan teknis mengapa harus membuat custom component (misal: komponen tersebut tidak tersedia di perpustakaan Pilar UI V2).
- [2026-08-02] **Hirarki Pencarian & Penggunaan Komponen (/learn TRIGGERED):**
  - Agent **WAJIB** mematuhi **3 Tahap Hirarki Pencarian Komponen**:
    👉 **1. PILAR UI (`.agents/pilar-docs/`)** — Cek apakah komponen tersedia di perpustakaan Pilar UI V2.
    👉 **2. DEPENDENCY (`package.json`)** — Cek library/package npm yang sudah terpasang di project (contoh: `angular-highcharts`, `highcharts`, `d3`, `ngx-select-ex`).
    👉 **3. EXISTING FILE / FOLDER (`projects/uiigateway/ea/`)** — Cek apakah sudah ada pola/implementasi serupa di komponen yang sudah ada (contoh: `MonitoringAssetComponent` menggunakan `Chart` dari `angular-highcharts`).
- [2026-08-02] **Koreksi Strict Boundary & Aturan Slicing UI (/learn TRIGGERED):**
  1. **Public API & File Boundary**: DILARANG KERAS mengubah `public-api.ts` atau file di luar permintaan eksplisit User.
  2. **DILARANG BUAT BREADCRUMB**: DILARANG KERAS membuat header breadcrumb (`page-titles`, `ol.breadcrumb`) pada komponen slicing UI, karena breadcrumb bukan tugas agent.
  3. **Inspeksi Chrome DevTools**: Hanya fokus membaca elemen yang berada **DI DALAM KOTAK NODE FIGMA** saja.
  4. **Inspeksi Kode Codebase Minimal 3 Folder/Page (Sebelum Pemetaan)**: Sebelum membuat pemetaan komponen HTML & TS, Agent **WAJIB** membaca dan menginspeksi minimal 3 pasang file HTML & TS dari folder page yang BERBEDA di codebase (`projects/uiigateway/ea/src/lib/modules/`) untuk mempelajari konvensi penamaan variabel, pola arsitektur, dan struktur HTML yang sudah ada.
  5. **DILARANG JALANKAN BUILD AUTOMATICALLY**: Agent DILARANG KERAS menjalankan `ng build` / `ngx build` atau kompilasi terminal otomatis. Cukup selesaikan penulisan file kode fisik, karena review dan verifikasi build akan dilakukan secara manual oleh User.
- [2026-08-02] **Preservasi Import Existing pada Replace File (/learn TRIGGERED):** Saat melakukan modifikasi/penambahan import komponen baru pada file routing/module (`ea.routing.ts` / `ea.module.ts`), Agent **WAJIB** memastikan baris import komponen lain yang sudah ada sebelumnya (seperti `ListDatabaseEditComponent`) TIDAK terhapus secara tidak sengaja.
- [2026-08-02] **Aturan Global Styling (`styles.scss`) & Penempatan Header (/learn TRIGGERED):**
  1. **Penggunaan `styles.scss` Global**: Seluruh style umum (seperti `.monitoring-page-container`, `.button-container`, `.custom-button`, `.custom-well`, `.custom-filter-well`) wajib ditaruh di stylesheet global `projects/uiigateway/ea/src/assets/stylesheets/styles.scss` di bawah `.ugw-ea-uii-ea`, BUKAN dibuat khusus di SCSS komponen individu.
  2. **Penempatan Judul Header H4/H3**: Judul `<h4 class="content-header-title">Title</h4>` ditaruh di paling luar di atas `<div class="monitoring-page-container">`, sehingga judul berdiri sendiri tanpa terpengaruh padding container, sedangkan seluruh tabset switcher dan card grafik di bawahnya mendapatkan `padding: 20px` presisi dari `.monitoring-page-container`.
  3. **Struktur Grid Donut Card (Eksplisit `gap: 20px`)**: Tiga card kategori berbaris horizontal dibungkus `.donut-charts-row` (`display: flex; gap: 20px;`) tanpa `margin-bottom` di wrapper-nya, agar jarak horizontal antar card presisi 20px dan vertikal margin tetap single 20px dari `.custom-well`.
  4. **Filter Card #FAFAFA**: Filter card (`.custom-filter-well`) menggunakan `background-color: #FAFAFA; border: 1px solid #E0E0E0; border-radius: 8px; padding: 20px; margin-bottom: 20px;`.
- [2026-08-02] **Struktur `.content-body` & Donut Cards Flex Gap (/learn TRIGGERED):**
  1. `<div class="content-body">` membungkus **SELURUH** isi konten halaman di bawah `<h4 class="content-header-title">`, termasuk **Tabset Button (`.button-container`)**, Filter Card (`.custom-filter-well`), Donut Charts, dan Table.
  2. Untuk 3 Donut Card Kategori, wajib menggunakan `.donut-charts-row` dengan `display: flex; gap: 20px;` (BUKAN auto bootstrap gap) tanpa `margin-bottom` pada container `.donut-charts-row`, sehingga jarak antar card presisi 20px dan margin-bottom ke elemen di bawahnya tetap murni 20px dari `.custom-well`.
- [2026-08-02] **Larangan Utility Margin-Top / Bottom (/learn TRIGGERED):** Agent **DILARANG KERAS** membuat atau menulis class utility margin (seperti `.margin-top-15`, `.margin-top-20`, atau sejenisnya) di `styles.scss` maupun di SCSS/HTML komponen! Gunakan margin bawaan dari `.custom-well` / `.custom-filter-well` (`margin-bottom: 20px`).
- [2026-08-02] **Donut Chart Total Badge & Highcharts Clipping (/learn TRIGGERED):** DILARANG KERAS menaruh badge/pill total ringkasan (seperti `Total: 60 Aplikasi`) di dalam subtitle Highcharts dengan y-offset yang menyebabkan potongan batas bawah (bottom border)! Render badge total di HTML template secara langsung di bawah elemen `[chart]` dengan height chart `220px-240px` agar border-bottom card `.custom-well` terlihat utuh sempurna.
- [2026-08-02] **Larangan [chart] Langsung pada .custom-well (/learn TRIGGERED):** DILARANG KERAS menaruh atribut `[chart]` langsung di tag `<div class="custom-well">`! Highcharts menyuntikkan `overflow: hidden` pada elemen target yang memotong `border-bottom` 1px dan `box-shadow` card. WAJIB selalu membungkus Highcharts dalam div terpisah di dalam card: `<div class="custom-well"><div [chart]="chartObj" style="height: 360px; width: 100%;"></div></div>`.
- [2026-08-07] **Aturan Baku Scrolling Canvas Figma Adaptif (/learn TRIGGERED):**
  1. **Node Utama (Utuh/Keseluruhan):** Link Figma permalink yang diminta HARUS merupakan Node KESELURUHAN halaman/screen (Main Frame).
  2. **DILARANG TANYA NODE KOMPONEN SPESIFIK:** DILARANG KERAS menanyakan apakah ada node komponen spesifik. Agent WAJIB otomatis menganggap 'Tidak ada' dan langsung lanjut ke langkah berikutnya.
  3. **ALUR SCROLL ADAPTIF (BASE 3000 + INCREMENT 500):** Scrolling canvas Figma WAJIB dimulai dari base `deltaY = 3000` (`-3000` untuk DOWN, `+3000` untuk UP). Jika Agent melihat tampilan foto masih sama/overlapping dan bottom border belum terfoto utuh, Agent **WAJIB MENAIKKAN MAGNITUDE deltaY SEBESAR +500** (menjadi 3500, 4000, dst) pada scroll berikutnya. Agent **WAJIB LANGSUNG BERHENTI** mengambil foto begitu garis bottom border node terfoto utuh.
- [2026-08-02] **Struktur Children Route & Highcharts Explicit Series Type (/learn TRIGGERED):**
  1. **Route Modul Monitoring (Children Array)**: Rute halaman modul monitoring WAJIB dibungkus dalam struktur `children: [{ path: "", component: ... }]` pada `ea.routing.ts` agar Angular Router pada FE App Shell Gateway dapat mencocokkan URL rute secara presisi saat diakses dari menu/navigasi.
  2. **Highcharts Series Type & Container Dimensions**: Atribut `[chart]` WAJIB dibungkus dalam div kontainer dengan dimensi eksplisit `style="height: ...; width: 100%;"`, dan setiap objek series data Highcharts di TypeScript wajib mencantumkan `type: 'pie'` atau `type: 'column'` secara eksplisit pada tiap item series agar grafik ter-render sempurna tanpa layar kosong.
- [2026-08-02] **Wajib Menggunakan Card Wrapper `.custom-well` & `.donut-charts-row` (/learn TRIGGERED):**
  - **Penyebab Card Pembungkus Chart Tidak Muncul**: Agent sebelumnya menggunakan class non-standar `.chart-card` di SCSS lokal alih-alih menggunakan class global standar project `.custom-well` dan `.donut-charts-row` (`.card-donut-col`).
  - **Aturan Wajib**: Seluruh elemen grafik Highcharts WAJIB dibungkus dengan `<div class="custom-well">` dari stylesheet global `styles.scss`. Untuk 3 Donut Chart, WAJIB menggunakan struktur `.donut-charts-row > .card-donut-col > .custom-well` agar border card, background putih, padding, dan box-shadow card standar muncul membungkus grafik secara sempurna.
- [2026-08-02] **Donut Card Full-Width Bottom Banner & Height Anti-Clipping (/learn TRIGGERED):**
  - **Penyebab Banner Terpotong / Menggantung**: Banner ringkasan total (`Total: 60 Aplikasi`, `199 Service`, `79 Database`) berada di dalam container dengan inner-padding `padding: 20px`, sehingga banner tidak membentang 100% full-width hingga ke ujung pinggir kiri-kanan & bawah card. Tinggi grafik Highcharts `280px` juga mendesak banner sehingga terpotong oleh SVG canvas Highcharts.
  - **Aturan Wajib**: Donut Card pembungkus (`.custom-well`) WAJIB diset `padding: 0 !important; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;`. Grafik Highcharts dibungkus div internal `<div class="donut-chart-container"><div [chart]="..." style="height: 220px; width: 100%;"></div></div>` (padding `16px 16px 0 16px`), dan banner total ditaruh di paling bawah sebagai `<div class="card-footer-banner footer-blue/pink/teal">` dengan `width: 100%; border-radius: 0 0 7px 7px;` sehingga membentang full-width 100% rapi tanpa terpotong chart.
- [2026-08-02] **Filter Dropdown Preview Value & Footer Banner Margin-Top 20px (/learn TRIGGERED):**
  - **Filter Dropdown Preview**: Pada penyiapan awal `selectOptions`, WAJIB diisi nilai default (`selectOptions = { kd_pemilik: '1', tahun: '2024', ... }`) agar komponen `<uii-dropdown-v2>` langsung menampilkan item preview terdaftar (bukan placeholder kosong) saat pertama kali dimuat.
  - **Footer Banner Margin-Top 20px**: Properti `.card-footer-banner` WAJIB diberi `margin-top: 20px;` dan tinggi canvas Highcharts Donut Chart diset max `210px` (`spacingBottom: 0`, `marginTop: 10`) agar footer banner terbawah (`Total: 60 Aplikasi`, dll) tidak terdorong/terpotong oleh elemen SVG Highcharts.
- [2026-08-02] **Standard Tabset Button Switching (`.button-container` & `.custom-button`) (/learn TRIGGERED):**
  - **Penyebab Styling Tabset Tidak Sesuai**: Agent sebelumnya mengarang styling SCSS tabset tombol Grafik/Tabel alih-alih meng-copy 100% dari referensi baku di `asset-monitoring.component.scss`.
  - **Aturan Wajib**: Seluruh modul monitoring yang menggunakan tombol tabset switcher (`Grafik` & `Tabel`) WAJIB meng-copy 100% styling baku `.button-container` (`gap: 0`) dan `.custom-button` (`background-color: #ffffff; color: #002f87; border: 1px solid #002f87; active: #002f87; border-radius: 4px 0 0 4px / 0 4px 4px 0`) langsung dari `asset-monitoring.component.scss`.
- [2026-08-02] **Placeholder Abu-Abu Dropdown Filter (`selectOptions = { ...: null }` & `[allowClear]="false"`) (/learn TRIGGERED):**
  - **Penyebab Dropdown Kosong & Tampil Ikon Clear (x)**: Menyetel `selectOptions` ke string kosong `''` dianggap oleh `<uii-dropdown-v2>` sebagai string bernilai (bukan null), sehingga komponen menganggap nilai sudah terpilih dan menampilkan tombol clear (`x`) tanpa teks placeholder.
  - **Aturan Wajib**: Inisialisasi `selectOptions` untuk filter pencarian WAJIB menggunakan `null` (`selectOptions = { kd_pemilik: null, tahun: null, ... }`) dan menyertakan `[allowClear]="false"` pada `<uii-dropdown-v2>` agar teks placeholder abu-abu (*Semua Unit*, *Semua Tahun*, dst) tampil bersih tanpa tombol clear (`x`).
- [2026-08-06] **Aturan Baku Slicing UI, Spacing, Tabset, Grid Alignment, & Chart Type (/learn TRIGGERED):**
  1. **Tabset Switcher di Dalam `.content-body`**: Komponen `.button-container` WAJIB ditaruh di DALAM `<div class="content-body">` persis sebelum blok `*ngIf="activeTab === 'grafik'"`, menggunakan `margin-bottom: 20px` agar sejajar rata kiri secara alami bersama seluruh card di bawahnya.
  2. **Root Cause Stacking Margin 40px pada Flex Row**: Pada container flex (`.donut-charts-row`), elemen `.custom-well` di dalam flex-item (`.card-donut-col`) memiliki `margin-bottom: 20px;` yang TIDAK ter-collapse dengan `margin-bottom: 20px;` milik `.donut-charts-row` itu sendiri. Akibatnya, `20px + 20px = 40px margin` tercipta di bawah Kategori Aplikasi.
  3. **Solusi Baku Stacking Margin Flex**: DILARANG BERI `margin-bottom` pada container row (`.donut-charts-row`). Serahkan `margin-bottom: 20px` murni kepada `.custom-well` yang ada di dalamnya agar tidak terjadi akumulasi 40px margin.
  4. **Donut Card Flush Footer Banner**: Card pembungkus Donut Chart (`.custom-well`) WAJIB diset `padding: 0 !important; overflow: hidden;` dengan kontainer chart internal ber-padding (`16px`), sehingga `.card-footer-banner` terbawah (`Total: 60 Aplikasi`, dll) menyatu rata (*flush*) tanpa celah/gap di bagian paling bawah dinding card (`border-radius: 0 0 7px 7px; width: 100%`).
  5. **Alignment Tombol Filter dengan Kolom Grid (`col-md-4` & `btn-block`)**: Tombol Filter pada Card Filter WAJIB menggunakan pembungkus `<div class="col-md-4">` dan `<button class="btn btn-primary btn-block">` agar lebarnya 100% sejajar dengan kolom dropdown paling kanan (DBMS). DILARANG KERAS menggunakan static inline width (seperti `style="width: 120px"`).
  6. **Tipe Grafik Lingkaran Kategori (Pie Chart vs Donut Chart)**: Perhatikan bentuk grafik lingkaran di Figma. Jika di Figma berbentuk lingkaran penuh (*solid Pie Chart*), DILARANG menambahkan properti `innerSize: '60%'` di TypeScript Highcharts. Hanya gunakan `innerSize` apabila Figma secara eksplisit menampilkan grafik Donut (dengan lubang di tengah).
- [2026-08-06] **Elemen di Luar Frame Node Figma (/learn TRIGGERED):** DILARANG KERAS memasukkan elemen yang berada DI LUAR kotak frame node Figma (misalnya copyright footer yang terletak di luar canvas frame node) ke dalam slicing UI komponen.
- [2026-08-06] **Aturan Baku Scrolling Canvas Figma (/learn TRIGGERED):** DILARANG KERAS melakukan scroll bertahap, scrolling tambahan, atau cek bersyarat berulang. Scrolling canvas Figma WAJIB menggunakan 1 format baku tunggal dengan FIXED deltaY = -2700 untuk DOWN (`'down'`) dan +2700 untuk UP (`'up'`).
- [2026-08-07] **Konvensi Penamaan Route Path — WAJIB Bahasa Inggris (/learn TRIGGERED):** Agent salah menulis route path `monitoring-aplikasi` (campuran Inggris-Indonesia). Seluruh route path di project ini menggunakan Bahasa Inggris penuh: `monitoring-asset`, `monitoring-business-process`, `application-catalog`, `business-process-management`. Route path untuk monitoring aplikasi yang benar adalah `monitoring-application`, sesuai konvensi project dan URL yang didaftarkan di Gateway Pengaturan (Gateway Pengaturan). **WAJIB mengikuti konvensi penamaan route yang SUDAH ADA di codebase**, bukan mengarang dari asumsi.
- [2026-08-07] **Tabset Button WAJIB di Dalam `.content-body` + Filter Button Margin-Top + NgModel pada uii-dropdown-v2 (/learn TRIGGERED):**
  1. **Tabset `.button-container` WAJIB di DALAM `.content-body`**: Komponen `.button-container` (tombol Grafik/Tabel) WAJIB ditaruh di DALAM `<div class="content-body">` persis di atas blok `*ngIf="activeTab"`, BUKAN di luar. Hanya `<h4 class="content-header-title">` yang berada di luar `.content-body`.
  2. **Filter Button Row WAJIB ada Margin-Top**: Baris tombol Filter pada card filter WAJIB diberi `margin-top: 15px` (inline style pada row wrapper-nya) agar ada jarak vertikal dari baris dropdowns di atasnya.
- [2026-08-13] **Rancangan Integrasi API Wajib Detail Per File & Per Endpoint (/learn TRIGGERED):** Pada saat mempresentasikan rencana integrasi API (termasuk pada `API Integration Only`), Agent **WAJIB** merinci secara eksplisit: (1) Path folder & nama file fisik Angular secara presisi, (2) Pemetaan 1-per-1 setiap method endpoint API ke method fungsi di Service (`ea.service.ts`), (3) Tempat pemanggilan method & binding state pada Komponen (`.component.ts`), serta (4) Elemen UI/event pemicu pada Template (`.component.html`).
- [2026-08-13] **Import Path Relative Depth & CoreService Growl (/learn TRIGGERED):**
  1. **Import Path `EaService`**: Komponen di `projects/uiigateway/ea/src/lib/modules/ea-management/asset-management/list-search-asset/` memiliki kedalaman 4 folder dari `src/lib/`. Import `EaService` WAJIB menggunakan `../../../../services/ea.service` (4x `../`).
  2. **Notifikasi Growl Core**: Notifikasi growl di `@uiigateway/core` diakses melalui `CoreService` (injected `private coreSvc: CoreService`) dan `NOTIFICATION_TYPE` (`this.coreSvc.growl(NOTIFICATION_TYPE.ERROR, 'Pesan')`), BUKAN `DataService.growl`.
- [2026-08-13] **Target Utama Integrasi API Asset Management (/learn TRIGGERED):** Komponen utama tempat pendaftaran, penyaringan tabel list, infobox, serta aksi CRUD aset terletak pada `ListRegisterAssetComponent` (`projects/uiigateway/ea/src/lib/modules/ea-management/asset-management/list-register-asset/list-register-asset.component.ts`). Seluruh dropdown master, `infobox`, dan `rows` tabel **WAJIB terintegrasi 100% dengan API real** tanpa dummy static!
- [2026-08-13] **Rujukan Dokumentasi API MD & Mandatory BE Git Pull (/learn TRIGGERED):**
  1. **Rujukan Dokumentasi API MD (`docs/asset/docs.asset.md`)**: Dalam pengembangan modul Asset Management, Agent **WAJIB** merujuk pada file dokumentasi fisik `docs/asset/docs.asset.md` yang ada di repository project.
  2. **Mandatory BE Git Pull**: Sebelum melakukan inspeksi file atau endpoint pada repository Backend Lumen (`backend_repo`), Agent **WAJIB** mengeksekusi `git pull` di repo BE terlebih dahulu agar selalu membaca kode dan endpoint yang paling baru.
- [2026-08-13] **Kelengkapan 21 Endpoints Asset Management di `ea.service.ts` (/learn TRIGGERED):**
  Seluruh 21 endpoint di grup `Asset Management Endpoints` backend Lumen (`routes/web.php` line 250-273) **WAJIB** didaftarkan 100% lengkap tanpa ada yang terlewat pada `EaServiceType` dan `getUrl()` di `projects/uiigateway/ea/src/lib/services/ea.service.ts` (mencakup 8 endpoint utama CRUD/List/Infobox/Riwayat & 13 endpoint dropdown master).
- [2026-08-13] **Lokasi Resmi Dokumentasi API Workspace & Pemilihan File MD (/learn TRIGGERED):**
  1. **Workspace Lokasi Dokumentasi API**: Folder resmi penyimpan dokumentasi API di repository FE ini adalah `projects/uiigateway/ea/docs/`.
  2. **Pertanyaan Pemilihan File Dokumentasi**: Pada saat task API Integration dimulai, Agent **WAJIB** mengecek isi folder `projects/uiigateway/ea/docs/` dan menanyakan ke User: *"Dokumentasi mana di `projects/uiigateway/ea/docs/` yang ingin digunakan?"* (menampilkan daftar file `*.md` yang tersedia di folder tersebut).
  3. **SSOT File MD Terpilih**: Setelah User memilih file MD (seperti `projects/uiigateway/ea/docs/ASSET_MANAGEMENT_API.md`), Agent **CUKUP MEMBACA & MEMATUHI 100% ISI FILE MD TERSEBUT** tanpa perlu lagi mengecek folder backend Lumen `backend_repo`.
- [2026-08-13] **Larangan Opsi `ask_question` Spesifik Teknis / Kaku (/learn TRIGGERED):**
  Agent **DILARANG KERAS** membuat opsi pilihan pada tool `ask_question` yang panjang, kaku, atau spesifik teknis (seperti menuliskan nama file `.md` spesifik atau rincian komponen teknis). Opsi pilihan pada `ask_question` **WAJIB SELALU GENERAL & SINGKAT** (contoh: `1. Sesuai standar project & dokumentasi`, `2. Tuliskan catatan khusus`).
- [2026-08-13] **Presisi Kedalaman Import Relative Path EaService (/learn TRIGGERED):**
  Agent **WAJIB** menghitung kedalaman folder fisik secara tepat terhadap `src/lib/`. Komponen dalam sub-folder modal/child seperti `ModalEditRegisterAssetComponent` (`projects/uiigateway/ea/src/lib/modules/ea-management/asset-management/list-register-asset/modal-edit-register-asset/`) memiliki kedalaman 5 folder dari `src/lib/` sehingga import `EaService` WAJIB menggunakan 5x `../` (`../../../../../services/ea.service`). DILARANG KURANG ATAU LEBIH HINGGA MENYEBABKAN MODULE NOT FOUND / UNRESOLVED INJECTION TOKEN.
- [2026-08-13] **Mandatory Prefix `/v1/ea/` pada URL Endpoint `ea.service.ts` (/learn TRIGGERED):**
  Seluruh URL endpoint di `ea.service.ts` **WAJIB** mempelajari dan mematuhi konvensi arsitektur project yang sudah ada yaitu diawali dengan prefix `/v1/ea/` (contoh: `this.BASE_URL_API + "/v1/ea/asset/list"`), BUKAN `/v1/asset/list` atau `/asset/list`. Tanpa prefix `/v1/ea/`, Gateway Proxy (`gateway-local.uii.ac.id`) tidak dapat mengenali rute modul EA sehingga request langsung di-reject sebagai CORS error alih-alih mengembalikan status HTTP yang benar seperti `401 Unauthorized` (apabila menu/API belum terdaftar di Gateway Pengaturan).
- [2026-08-13] **Error Isolation pada Stream `forkJoin` (/learn TRIGGERED):**
  Setiap stream Observable di dalam bundle `forkJoin` (seperti pemanggilan dropdown master) **WAJIB** dibungkus dengan `.pipe(catchError(() => of({ data: [] })))`. Tanpa `catchError` per-stream, kegagalan error HTTP (seperti `401 Unauthorized` karena API belum terdaftar di Gateway Pengaturan) pada satu endpoint akan secara otomatis membatalkan (*canceled*) request paralel lainnya atau menyebabkan request menggantung (*pending*).
- [2026-08-13] **Import Path RxJS Operators `catchError` (/learn TRIGGERED):**
  Operator RxJS seperti `catchError`, `map`, `tap`, `switchMap` **WAJIB** diimpor dari `'rxjs/operators'` (contoh: `import { catchError } from 'rxjs/operators'`), BUKAN dari `'rxjs'`. Mengimpor operator dari `'rxjs'` pada Angular 13 / RxJS 6 akan menyebabkan error kompilasi `TS2305 ("Module 'rxjs' has no exported member 'catchError'")`.
- [2026-08-13] **Format Detail Asset (`nama_asset`/`nama_aset`) & Pemisahan Tanggal/Waktu Riwayat (/learn TRIGGERED):**
  1. **Mapping `nama_asset` / `nama_aset`**: Di komponen detail aset (`AssetDetailCardComponent` & `DetailRegisterAssetComponent`), properti `nama_asset` & `nama_aset` **WAJIB** didukung keduanya (`assetData.nama_aset || assetData.nama_asset`) agar nama aset tidak pernah kosong.
  2. **Format Tanggal/Waktu Riwayat**: String `tanggal_aktivitas` (seperti `"2026-08-12 00:00:00"`) **WAJIB** dipisah menjadi 2 baris (mengganti spasi dengan `<br>`) sehingga tanggal dan jam tampil bertumpuk secara rapi di bawah badge (Baris 1: Badge Jenis, Baris 2: YYYY-MM-DD, Baris 3: HH:mm:ss).
- [2026-08-13] **Auto-Fetch Detail API & Penyesuaian `formControlName` Modal Edit Asset (/learn TRIGGERED):**
  1. **Auto-Fetch `GET /v1/ea/asset/detail`**: Saat modal edit (`ModalEditRegisterAssetComponent`) dibuka, modal **WAJIB** mengeksekusi `GET /v1/ea/asset/detail?uuid_asset=...` untuk mengambil seluruh field detail teknis & operasional dari API backend secara langsung, BUKAN hanya mengandalkan data ringkas baris tabel.
  2. **Sinkronisasi Nama Kontrol FormGroup & HTML**: Seluruh nama kontrol pada `FormGroup` di TypeScript (`kd_jenis`, `nama_aset`, `kd_merk`, `model`, `serial_number`, `kode_inventaris`, `tanggal_pembelian`, `masa_pakai`, `warranty_status`, `warranty_end`, `mac_address`, `hostname`, `firmware_version`, `total_port`, `port_terpakai`, `tanggal_eol`, `tanggal_eos`, dll) **WAJIB 100% SAMA** dengan nama atribut `formControlName` di template HTML agar form tidak pernah tampil dalam kondisi kosong.
  3. **Auto-Match Dropdown Jenis & Merek**: Pilihan dropdown master seperti `Jenis aset` (`kd_jenis`) & `Merek` (`kd_merk`) **WAJIB** dilengkapi fungsi pencocokan 2-arah (matching by UUID & fallback matching by String Name) agar pilihan ter-select secara otomatis tanpa peduli mana di antara detail API dan dropdown master yang selesai dimuat lebih dahulu.
- [2026-08-13] **Sanitasi Payload & Format Tanggal `PUT /v1/ea/asset/edit` (/learn TRIGGERED):**
  1. **Strict Format Tanggal `YYYY-MM-DD`**: Seluruh tanggal (`tanggal_pembelian`, `warranty_end`, `eol`, `eos`) **WAJIB** dipotong menjadi format murni 10 karakter `YYYY-MM-DD`. Pengiriman string timestamp (misal `"2026-08-11 00:00:00"`) akan ditolak oleh validator Lumen `date_format:Y-m-d` dengan status `400 Bad Request ("Data input tidak valid.")`.
  2. **Dropdown UUID Warranty Status**: Field `warranty_status` di HTML modal edit **WAJIB** menggunakan `<ngx-select>` terikat UUID valid dari master `listWarrantyStatus` (`uuid_warranty_status_asset`), BUKAN input teks bebas.
  3. **Clean Payload**: Field numerik & tanggal yang bernilai string kosong `""` **WAJIB** tidak disertakan dalam JSON payload untuk mencegah kegagalan validasi tipe data di backend.
- [2026-08-13] **Clean Code Standards & Memory Management (/learn TRIGGERED):**
  1. **RxJS Unsubscription via `takeUntil`**: Seluruh komponen Angular (`ListRegisterAssetComponent`, `CreateRegisterAssetComponent`, `DetailRegisterAssetComponent`, `ModalEditRegisterAssetComponent`, `ListSearchAssetComponent`) **WAJIB** mengimplementasikan `OnDestroy` dengan `private destroy$ = new Subject<void>()` dan menggunakan `.pipe(takeUntil(this.destroy$))` pada setiap subscription HTTP/Route untuk mencegah memory leak.
  2. **Refactoring Generic Helper Dropdown**: Fungsi pencocokan dropdown diautentikasi lewat generic helper `tryMatchDropdownControl` agar DRY, rapi, dan konsisten.
  3. **Pembersihan Dead Code**: Menghapus metode kosong tak terpakai (seperti `onDateTimeInput`) dan memastikan seluruh variabel/tipe data diberi type annotation profesional.











