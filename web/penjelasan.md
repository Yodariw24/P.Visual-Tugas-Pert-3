# Penjelasan Singkat Logika Program — Aplikasi Penilaian Mahasiswa (Web)

**Teknologi:** HTML (struktur), CSS (tampilan), JavaScript (logika)
**Cara menjalankan:** buka `index.html` di browser (klik dua kali). Ketiga berkas harus berada di satu folder.

## 1. Tujuan Program
Menghitung **nilai akhir** mahasiswa dari nilai Tugas, UTS, dan UAS, lalu menentukan **huruf mutu** dan **status kelulusan** berdasarkan nilai dan kehadiran.

## 2. Pemenuhan Syarat Tugas

| Syarat | Pemenuhan dalam program |
|---|---|
| 5 komponen visual | Heading, input teks (nama, nilai, hadir), dropdown `select` (mata kuliah), checkbox (surat izin), tombol Hitung dan Reset, daftar riwayat `ul` |
| 4 variabel | `nama`, `matkul`, `tugas`, `uts`, `uas`, `hadir`, `nilaiAkhir`, `lulus`, dst. |
| 3 tipe data | `string` (nama, matkul), `number` (nilai, hadir, nilaiAkhir), `boolean` (punyaToleransi, lulus) |
| Operator aritmatika | `*`, `+`, `/` pada `nilaiAkhir` dan `persenHadir` |
| Operator perbandingan | `>=`, `<`, `>`, `<=`, `===` |
| AND, OR, NOT | `&&`, `\|\|`, `!` (lihat bagian 4) |
| Minimal 2 event | `submit` (klik Hitung / tekan Enter), `click` (Reset), `input` (hapus tanda error saat mengetik) |
| Validasi input | Cek kosong, cek huruf (regex), cek angka (`isNaN`), cek rentang 0–100, cek kehadiran bulat 0–14 |
| Output pada form | Bagian "Hasil Penilaian" (nama, mata kuliah, nilai akhir, huruf, kehadiran, status) dan "Riwayat Penilaian" |

## 3. Alur Program
1. Pengguna mengisi form, lalu menekan **Hitung** (event `submit`).
2. `e.preventDefault()` mencegah halaman dimuat ulang.
3. **Validasi** — jika ada input salah, pesan merah muncul, kolom yang salah ditandai, dan proses berhenti (`return`).
4. **Perhitungan**
   - `nilaiAkhir = tugas*0.3 + uts*0.3 + uas*0.4`
   - `persenHadir = hadir / 14 * 100`
5. **Penentuan hasil** (bagian 4).
6. **Output** — hasil ditampilkan lewat `textContent`, warna status diganti lewat class CSS (`lulus`, `remedial`, `gagal`), dan satu baris baru ditambahkan ke riwayat.
7. Tombol **Reset** (event `click`) mengosongkan form dan hasil.

## 4. Logika Kelulusan (AND, OR, NOT)
```js
const lulus = (nilaiAkhir >= 70) && (persenHadir >= 75 || punyaToleransi);
```
**LULUS** jika nilai akhir ≥ 70 **DAN** (kehadiran ≥ 75% **ATAU** punya surat izin).

```js
else if (!lulus && nilaiAkhir >= 60)   // REMEDIAL
```
Jika **TIDAK** lulus tetapi nilai ≥ 60, statusnya **REMEDIAL**; selain itu **TIDAK LULUS**.

Operator **NOT** juga dipakai pada validasi: `if (!(hadir >= 0 && hadir <= 14))`.

## 5. Huruf Mutu
| Nilai Akhir | Huruf |
|---|---|
| ≥ 85 | A |
| ≥ 75 | B |
| ≥ 65 | C |
| ≥ 50 | D |
| < 50 | E |

## 6. Contoh Uji (sudah dijalankan di browser)
| Input | Hasil |
|---|---|
| Tugas 80, UTS 75, UAS 90, hadir 13 | 82.50 (B), **LULUS** |
| Sama, hadir 8 tanpa izin | 82.50 (B), **REMEDIAL** |
| Sama, hadir 8 dengan izin | 82.50 (B), **LULUS** |
| Tugas 62, UTS 60, UAS 65, hadir 14 | 62.60 (D), **REMEDIAL** |
| Tugas 40, UTS 30, UAS 35, hadir 14 | 35.00 (E), **TIDAK LULUS** |

## 7. Screenshot
Lihat folder `screenshot/`:
1. `1_tampilan_awal.png` — tampilan awal form
2. `2_hasil_lulus.png` — hasil perhitungan dan riwayat
3. `3_validasi_error.png` — contoh validasi input
