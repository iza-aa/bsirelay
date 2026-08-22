---
name: update
description: Memory Distiller — membaca riwayat teammemory.md dan memory/local.md, merangkum & mengkategorisasi per tema/domain, lalu memetakan pembaruan ke file MD yang relevan (teammemory.md, memory/local.md, newtask/SKILL.md, harness.md). Berjalan dalam mode review-first sebelum menulis ke file.
---

# 🔄 Skill Document: `update` (Memory Distiller)

## 📖 Deskripsi Skill

Skill `update` berfungsi sebagai **knowledge distiller** — tugasnya memastikan aturan-aturan yang tersebar di riwayat koreksi (`/learn`) di `teammemory.md` (tim) dan `memory/local.md` (pribadi) **terdistilasi & tersinkronisasi** ke dalam dokumen-dokumen operasional yang digunakan Agent sehari-hari.

Tanpa `/update`, riwayat interrupt terus menumpuk namun aturan di `SKILL.md` dan `harness.md` tidak pernah diperbarui → Agent berisiko _drift_ dari aturan terbaru.

---

## 📌 INSTRUKSI WAJIB UNTUK AGENT

Saat `update` atau `/update` dipanggil, Agent **WAJIB** menjalankan **4 fase berurutan** berikut:

---

## 🔄 FASE 1 — HARVEST (Panen Data)

**Baca semua file sumber berikut secara menyeluruh:**

1. **`.agents/teammemory.md`** (memori tim)
   - Section: `ATURAN UTAMA WORKSPACE (PENGALAMAN & PREFERENSI USER)`
   - Section: `RIWAYAT INTERRUPT & KOREKSI USER (/learn)`

2. **`.agents/memory/local.md`** (memori pribadi developer — jika ada)
   - Section aturan preferensi pribadi dan riwayat `/learn` pribadi.

3. **`.agents/skills/newtask/SKILL.md`**
   - Baca seluruh fase eksekusi yang ada saat ini.

4. **`.agents/harness.md`**
   - Baca aturan arsitektur teknis yang sudah terdokumentasi.

---

## 🔄 FASE 2 — DISTIL (Kategorisasi, Pemetaan File & Deduplication)

### 2a. Pemetaan Jenis Aturan → File Target

Setiap entri `/learn` WAJIB dikategorisasi berdasarkan **jenis aturan**, lalu dipetakan ke **satu file target yang tepat** (bukan keduanya — hindari duplikasi):

| Jenis Aturan | File Target | Section |
|---|---|---|
| **Behavioral / Workflow** (cara Agent berperilaku, alur interview, kata kunci, larangan prosedural) | `teammemory.md` | `ATURAN UTAMA WORKSPACE` |
| **Preferensi Pribadi Developer** (gaya komunikasi, urutan interview pribadi, preferensi perangkat) | `memory/local.md` | Section preferensi pribadi |
| **Workflow Step / Execution Phase** (langkah spesifik dalam alur `/newtask`: interview, inspeksi Figma, konfirmasi, eksekusi) | `newtask/SKILL.md` | Fase Eksekusi / Alur Interview |
| **Teknis Arsitektur & Kode** (CSS class, HTML structure, TS pattern, routing, Highcharts config, komponen wrapper) | `harness.md` | Section teknis terkait |

> ⚠️ **ATURAN ANTI-DUPLIKASI:**
> - Jika sebuah aturan bersifat **behavioral/prinsip umum tim** → `teammemory.md` saja.
> - Jika sebuah aturan adalah **preferensi pribadi developer** → `memory/local.md` saja.
> - Jika sebuah aturan adalah **detail teknis implementasi** (CSS property, HTML template, TS syntax) → `harness.md` saja, BUKAN `teammemory.md`.
> - Jika sebuah aturan adalah **langkah workflow step** yang spesifik ke proses `/newtask` → `newtask/SKILL.md` saja.
> - DILARANG menaruh aturan yang sama di lebih dari satu file target.

---

### 2b. Deduplication Check + Literal Verification (Wajib Dilakukan Sebelum Marking)

Sebelum menandai sebuah entri sebagai `[TAMBAH]`, Agent **WAJIB** membaca ulang isi file target secara literal dan memverifikasi:

1. **Apakah isi/makna aturan tersebut sudah ada** (meskipun kata-katanya sedikit berbeda)?
   - Jika ya → tandai `[SINKRON]` ✅, BUKAN `[TAMBAH]`.
2. **Apakah aturan tersebut adalah pendetailan dari aturan yang sudah ada?**
   - Jika ya → tandai `[PERBARUI]` dan cantumkan teks lama → teks baru yang lebih lengkap.
3. Hanya jika aturan benar-benar **tidak ada dalam bentuk apapun** di file target → tandai `[TAMBAH]`.

> 🔒 **SAFEGUARD — WAJIB LITERAL VERIFICATION SEBELUM `[TAMBAH]`:**
> Sebelum menandai `[TAMBAH]`, Agent **WAJIB** secara eksplisit menyebut:
> - Kalimat/frasa kunci yang dicari di file target (contoh: *"searched for: 'kata kunci kerja'"*)
> - Konfirmasi bahwa kalimat tersebut **tidak ditemukan** di file target dalam bentuk apapun.
> 
> Jika Agent tidak dapat mengutip teks yang dicari + hasil pencarian → Agent **WAJIB** membaca ulang file target sebelum melanjutkan.
> DILARANG menandai `[TAMBAH]` hanya berdasarkan asumsi atau ingatan.

---

### 2c. Granularity Filter

Sebelum memasukkan entri ke diff, terapkan filter berikut:

- ❌ **SKIP** entri yang mengandung nilai pixel/angka yang sangat konteks-spesifik untuk satu task tertentu.
  - Contoh nilai yang harus di-SKIP: `spacingBottom: 0`, `marginTop: 10`, `height: 210px`, nilai warna hex spesifik satu task, dsb. Standar scroll Figma adaptive (base `deltaY = 3000` untuk DOWN/UP, increment `+500`) bukan contoh nilai task-spesifik.
  - Pengecualian: Jika angka tersebut disebut sebagai **standar baku project** (bukan sekadar nilai satu task), boleh dimasukkan dengan catatan.
- ✅ **INCLUDE** prinsip/pola yang dapat diterapkan secara universal ke semua task sejenis.

> 🔒 **SAFEGUARD — PRINSIP TANPA ANGKA:**
> Jika sebuah entri memiliki **prinsip yang valid** namun angkanya terlalu konteks-spesifik, Agent **BOLEH** mengekstrak prinsipnya saja dan membuang angkanya:
> - ❌ Versi granular: *"Gunakan nilai deltaY yang berbeda-beda berdasarkan kebutuhan task"*
> - ✅ Versi prinsip: *"Saat auto-scroll dipilih, mulai dari base deltaY 3000 untuk DOWN (-3000) atau UP (+3000); jika tampilan masih sama/overlapping, naikkan magnitude +500 per scroll berikutnya dan berhenti begitu bottom border node terfoto utuh."*
> 
> Tandai item ini sebagai `[TAMBAH - PRINSIP]` (tanpa angka spesifik) dalam diff.

---

### 2d. Completeness Audit (Wajib — Tidak Ada Entri yang Luput)

> 🔒 **SAFEGUARD — SETIAP ENTRI KOREKSI HARUS MEMILIKI STATUS:**

Sebelum melanjutkan ke Fase 3, Agent **WAJIB** membuat tabel akuntansi internal yang memetakan **SETIAP entri `/learn` satu per satu** ke salah satu status berikut:

| Entri Koreksi (tanggal + judul singkat) | File Target | Status |
|---|---|---|
| [YYYY-MM-DD] Judul entri... | `teammemory.md` / `memory/local.md` / `newtask/SKILL.md` / `harness.md` | `[TAMBAH]` / `[SINKRON]` / `[SKIP]` / `[PERBARUI]` |

- **DILARANG** melewati satu pun entri koreksi tanpa status yang terdaftar.
- Jika sebuah entri memiliki **beberapa poin**, setiap poin wajib diberi status terpisah.
- Cek jumlah entri koreksi di sumber vs jumlah baris di tabel audit — harus sama.

---

### 2e. Multi-Entry Deduplication (Wajib — Satu Topik = Satu Aturan)

> 🔒 **SAFEGUARD — CEGAH DUPLIKASI ANTAR ENTRI KOREKSI:**

Jika **2 atau lebih entri koreksi** membahas **topik yang sama** (misal: dua entri tentang `selectOptions` dropdown, dua entri tentang card wrapper Highcharts, dsb):

1. **Identifikasi** semua entri yang overlapping.
2. **Gabungkan** menjadi satu aturan tunggal menggunakan versi yang **paling lengkap dan terbaru**.
3. Tandai entri lama sebagai `[SKIP - DUPLIKAT, tercakup oleh entri YYYY-MM-DD]`.
4. **DILARANG** membuat 2 section/poin berbeda di file target untuk topik yang sama.

---

## 🔄 FASE 3 — REVIEW (Tampilkan Diff ke User)

**Sebelum menampilkan laporan, Agent WAJIB menjalankan Pre-Report Self-Verification Checklist:**

> 🔒 **PRE-REPORT SELF-VERIFICATION CHECKLIST (Internal — tidak perlu ditampilkan ke user):**
> 1. ☐ Apakah setiap entri koreksi (satu per satu) sudah memiliki status di tabel audit 2d?
> 2. ☐ Apakah setiap `[TAMBAH]` sudah didahului literal verification (teks dicari + tidak ditemukan)?
> 3. ☐ Apakah semua angka/pixel spesifik sudah di-SKIP atau diubah menjadi prinsip `[TAMBAH - PRINSIP]`?
> 4. ☐ Apakah ada 2+ entri koreksi tentang topik yang sama yang perlu digabung (2e)?
> 5. ☐ Apakah setiap aturan hanya muncul di SATU file target (tidak duplikasi antar file)?
>
> Jika ada checklist yang belum terpenuhi → perbaiki sebelum menampilkan laporan ke user.

**Tampilkan laporan ke user dengan format berikut:**

```
## 🔄 /update — Memory Distillation Report

### 📊 Ringkasan Kategori
| Tema | Jumlah Entri Baru/Update | Status |
|------|--------------------------|--------|
| 🎨 UI/Styling | N | ✅ Sinkron / ⚠️ Perlu Update |
| 🔄 Workflow    | N | ✅ Sinkron / ⚠️ Perlu Update |
| ...           | ...| ...                          |

---

### 📄 Diff per File Target

> Setiap item hanya muncul di SATU file target. Tidak ada duplikasi antar file.

#### `teammemory.md` → Section: ATURAN UTAMA WORKSPACE
> Hanya berisi aturan behavioral/prinsip umum (BUKAN detail CSS/HTML/TS).
- [TAMBAH] Aturan baru (behavioral): ... [dicari: "frasa kunci", tidak ditemukan]
- [TAMBAH - PRINSIP] Prinsip dari entri granular: ... (angka spesifik dihapus)
- [PERBARUI] Aturan lama: "..." → "..."
- [SINKRON] Aturan X sudah terdaftar di baris N ✅
- [SKIP] "..." → terlalu granular / teknis, dipetakan ke harness.md
- [SKIP - DUPLIKAT] "..." → tercakup oleh entri [YYYY-MM-DD]

#### `memory/local.md` → Section: Preferensi Pribadi Developer
> Hanya berisi preferensi pribadi developer (tidak di-commit).
- [TAMBAH] Preferensi pribadi baru: ...
- [SINKRON] Preferensi X sudah terdaftar ✅

#### `newtask/SKILL.md` → Fase Eksekusi / Alur Interview
> Hanya berisi workflow step spesifik /newtask yang belum ada.
- [TAMBAH] Langkah N: ... [dicari: "frasa kunci", tidak ditemukan]
- [SINKRON] "..." sudah ada di baris N ✅
- [SKIP] "..." → sudah tercakup dalam makna aturan yang ada

#### `harness.md` → Aturan Arsitektur & Teknis
> Menerima semua detail teknis: CSS class, HTML structure, TS pattern, routing, Highcharts.
- [TAMBAH] Section baru: ... [dicari: "frasa kunci", tidak ditemukan]
- [PERBARUI] Section X: tambahkan poin ...
- [SINKRON] Aturan Y sudah ada ✅

---

⚠️ Ketik "apply" atau "terapkan" untuk menulis perubahan ke file target.
   Ketik "batal" untuk membatalkan tanpa menulis apapun.
```

**AGENT WAJIB BERHENTI di sini dan menunggu input user.**
- ✅ Jika user ketik **`"apply"`** atau **`"terapkan"`** → lanjut ke Fase 4.
- ❌ Jika user ketik **`"batal"`** → batalkan tanpa menulis file apapun.
- ✏️ Jika user memberikan **koreksi/instruksi tambahan** → sesuaikan diff terlebih dahulu, tampilkan ulang review, dan tunggu konfirmasi kembali.

---

## 🔄 FASE 4 — APPLY (Tulis ke File Target)

**Setelah user konfirmasi, tulis pembaruan ke file target dengan aturan berikut:**

### ⚠️ Aturan Penulisan (WAJIB DIPATUHI):

1. **UPSERT, BUKAN REPLACE TOTAL:**
   - Jika aturan belum ada → **TAMBAHKAN** di section yang sesuai.
   - Jika aturan sudah ada tapi berbeda → **PERBARUI** teks yang relevan saja.
   - JANGAN menghapus aturan/baris lain yang tidak terkait perubahan ini.

2. **RIWAYAT `/learn` TIDAK BOLEH DIHAPUS:**
   - Section `RIWAYAT INTERRUPT & KOREKSI USER (/learn)` di `teammemory.md` dan `memory/local.md` bersifat **append-only / audit trail**.
   - Entri lama TIDAK BOLEH dihapus atau diarsipkan, meskipun sudah terdistilasi ke aturan utama.

3. **TARGET FILE:**

   | File | Section yang Boleh Dimodifikasi |
   |------|---------------------------------|
   | `teammemory.md` | `ATURAN UTAMA WORKSPACE (PENGALAMAN & PREFERENSI USER)` saja |
   | `memory/local.md` | Section preferensi pribadi saja |
   | `newtask/SKILL.md` | Semua fase eksekusi & aturan teknis dalam file ini |
   | `harness.md` | Section aturan arsitektur (CSS class, template teknis) |

4. **FILE YANG TIDAK BOLEH DIUBAH OLEH `/update`:**
   - `learn/SKILL.md` — alur log tidak berubah.
   - `config/SKILL.md` — config path tidak relevan dengan distilasi aturan.
   - `brain/SKILL.md` — instruksi pembacaan memori tidak berubah.
   - File apapun di luar `.agents/` — mutlak dilarang.

5. **KONFIRMASI AKHIR:**
   Setelah semua file ditulis, tampilkan ringkasan:
   ```
   ✅ /update selesai!
   - teammemory.md → N aturan ditambah/diperbarui
   - memory/local.md → N preferensi pribadi ditambah/diperbarui
   - newtask/SKILL.md → N aturan ditambah/diperbarui
   - harness.md → N aturan ditambah/diperbarui
   Riwayat /learn tetap utuh sebagai audit trail.
   ```

---

## 🚫 ATURAN KESELAMATAN SKILL INI

- **DILARANG** menulis ke file di luar `.agents/` tanpa persetujuan eksplisit user.
- **DILARANG** menghapus entri riwayat `/learn`.
- **DILARANG** auto-proceed ke Fase 4 tanpa kata kunci `"apply"` / `"terapkan"` dari user.
- **DILARANG** mengarang aturan baru yang tidak bersumber dari `teammemory.md`/`memory/local.md` atau instruksi eksplisit user.
- Semua aturan yang ditulis ke file target HARUS dapat ditelusuri sumbernya ke entri `/learn` atau `ATURAN UTAMA` di `teammemory.md`/`memory/local.md`.
