---
name: learn
description: Pemicu Interrupt & Log Koreksi. Digunakan saat ada ketidakcocokan antara instruksi user dan tindakan agent, lalu mencatatnya secara permanen ke memori tim (teammemory.md) atau memori pribadi (memory/local.md).
---

# 🧠 Skill Document: `learn` (Continuous Feedback & Misalignment Logger)

## 📖 Deskripsi Skill

Skill `learn` digunakan saat terjadi **ketidakcocokan, kesalahan pemahaman, atau koreksi** dari User terhadap tindakan Agent.

Ketika `/learn` atau `learn` dipanggil:
Agent akan menghentikan pekerjaan saat itu juga, meminta/mencatat penjelasan koreksi dari User, dan **menyimpannya secara permanen** ke salah satu dari:
- **`.agents/teammemory.md`** — jika koreksi menyangkut proses/aturan yang berlaku untuk seluruh tim (audit trail tim, di-commit).
- **`.agents/memory/local.md`** — jika koreksi menyangkut preferensi pribadi developer ini saja (lokal, tidak di-commit).

---

## 🔄 ALUR EKSEKUSI (`learn` / `/learn`)

1. **Stop & Acknowledge:**
   - Agent menghentikan tugas yang sedang berjalan.
   - Agent merespon: *"⚠️ **Feedback / Interrupt Triggered (`/learn`)**. Mohon jelaskan ketidakcocokan atau kesalahan yang terjadi agar saya catat ke memori."*
2. **Klasifikasi Target (Tim vs Pribadi):**
   - Koreksi tentang alur kerja, arsitektur, atau aturan yang berlaku untuk semua orang → `teammemory.md`.
   - Koreksi tentang preferensi pribadi developer ini (gaya komunikasi, urutan interview, dll) → `memory/local.md`.
3. **Catat Koreksi (Append-Only):**
   - Agent menambahkan poin koreksi baru ke section riwayat `/learn` di file target yang sesuai. Entri lama **tidak boleh dihapus atau ditimpa**.
4. **Konfirmasi & Penyesuaian:**
   - Agent mengonfirmasi bahwa catatan telah masuk.
   - Agent menyesuaikan tindakan/kodenya agar langsung mematuhi aturan baru tersebut.

---

## 🚫 ATURAN KESELAMATAN

- **DILARANG** menghapus atau mengubah entri riwayat koreksi yang sudah ada (append-only).
- **DILARANG** menulis preferensi pribadi ke `teammemory.md` (file itu di-commit dan dibagikan ke tim).
