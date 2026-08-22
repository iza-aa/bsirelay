---
name: brain
description: Membaca memori kolektif tim (teammemory.md) dan memori pribadi developer (memory/local.md) dari workspace aktif. Gunakan untuk meninjau aturan tim, preferensi pribadi, dan riwayat koreksi interrupt (/learn) sebelum mengerjakan task apa pun.
---

# 🧠 Skill Document: `brain` (Team & Personal Memory)

## 📖 Deskripsi Skill

Skill `brain` adalah pusat memori framework. Skill ini membaca **memori tim** (dibagikan lewat git) dan **memori pribadi developer** (lokal, tidak di-commit) dari workspace yang sedang aktif, lalu memastikan agent menyesuaikan diri dengannya.

## 📌 INSTRUKSI WAJIB UNTUK AGENT

Saat `brain` atau `/brain` dipanggil (atau saat `/newtask` dimulai):

1. **Baca file memori tim:** `.agents/teammemory.md` (aturan yang dibagikan ke seluruh tim).
2. **Baca file memori pribadi:** `.agents/memory/local.md` (preferensi pribadi + riwayat koreksi `/learn` milik developer ini). Jika belum ada, lewati.
3. **Baca profil tim:** `.agents/team.json` (identitas tim, path, dan konvensi).
4. **Tampilkan Ringkasan Memori:**
   - Aturan Utama Tim (dari `teammemory.md`).
   - Preferensi & Kebiasaan Developer ini (dari `memory/local.md`).
   - Daftar Riwayat Koreksi Interrupt (`/learn`) terbaru milik developer ini.
5. **Pastikan Agent Menyesuaikan Diri:**
   - Agent harus memastikan seluruh keputusan penulisan kode dan alur komunikasi mengikuti seluruh catatan tim dan catatan pribadi di atas.

> Lokasi di atas selalu relatif terhadap **akar repo workspace yang sedang aktif**. Skill ini tidak bergantung pada nama tim atau project tertentu.
