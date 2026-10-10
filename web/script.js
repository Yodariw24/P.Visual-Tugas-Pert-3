/*
  Aplikasi Penilaian Mahasiswa (versi web)
  HTML + CSS + JavaScript, tanpa library tambahan.
*/

const TOTAL_PERTEMUAN = 14; // konstanta bertipe number (integer)

// ----- Ambil elemen (komponen visual) -----
const form = document.getElementById("formNilai");
const inNama = document.getElementById("nama");
const inMatkul = document.getElementById("matkul");
const inTugas = document.getElementById("tugas");
const inUts = document.getElementById("uts");
const inUas = document.getElementById("uas");
const inHadir = document.getElementById("hadir");
const inIzin = document.getElementById("izin");
const pesanError = document.getElementById("pesanError");
const outStatus = document.getElementById("outStatus");
const riwayat = document.getElementById("riwayat");

// ----- Fungsi bantu -----
function tampilError(pesan, elemen) {
  pesanError.textContent = pesan;
  pesanError.hidden = false;
  if (elemen) {
    elemen.classList.add("salah");
    elemen.focus();
  }
}

function bersihkanError() {
  pesanError.hidden = true;
  document.querySelectorAll(".salah").forEach(function (el) {
    el.classList.remove("salah");
  });
}

// Mengubah teks menjadi angka; hasil NaN jika bukan angka valid
function keAngka(teks) {
  const t = teks.trim().replace(",", ".");
  return t === "" ? NaN : Number(t);
}

// ----------------------------------------------------------------------
// EVENT 1: form di-submit (tombol "Hitung" diklik / tekan Enter)
// ----------------------------------------------------------------------
form.addEventListener("submit", function (e) {
  e.preventDefault();
  bersihkanError();

  // ---------- Ambil input ----------
  const nama = inNama.value.trim();          // variabel 1: string
  const matkul = inMatkul.value;             // variabel 2: string
  const tugas = keAngka(inTugas.value);      // variabel 3: number (desimal)
  const uts = keAngka(inUts.value);          // variabel 4: number (desimal)
  const uas = keAngka(inUas.value);          // variabel 5: number (desimal)
  const hadir = keAngka(inHadir.value);      // variabel 6: number (bulat)
  const punyaToleransi = inIzin.checked;     // variabel 7: boolean

  // ---------- VALIDASI INPUT ----------
  if (nama === "") {
    return tampilError("Nama tidak boleh kosong!", inNama);
  }
  if (!/^[A-Za-z\s]+$/.test(nama)) {
    return tampilError("Nama hanya boleh berisi huruf!", inNama);
  }
  if (matkul === "") {
    return tampilError("Pilih mata kuliah terlebih dahulu!", inMatkul);
  }

  const daftarNilai = [
    [tugas, inTugas, "Nilai Tugas"],
    [uts, inUts, "Nilai UTS"],
    [uas, inUas, "Nilai UAS"],
  ];
  for (const [nilai, elemen, label] of daftarNilai) {
    if (isNaN(nilai)) {
      return tampilError(label + " harus berupa angka!", elemen);
    }
    // perbandingan + OR
    if (nilai < 0 || nilai > 100) {
      return tampilError(label + " harus antara 0 sampai 100!", elemen);
    }
  }

  if (isNaN(hadir) || !Number.isInteger(hadir)) {
    return tampilError("Kehadiran harus berupa bilangan bulat!", inHadir);
  }
  // NOT + perbandingan + AND
  if (!(hadir >= 0 && hadir <= TOTAL_PERTEMUAN)) {
    return tampilError("Kehadiran harus antara 0 sampai " + TOTAL_PERTEMUAN + "!", inHadir);
  }

  // ---------- PERHITUNGAN (operator ARITMATIKA) ----------
  const nilaiAkhir = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);
  const persenHadir = (hadir / TOTAL_PERTEMUAN) * 100;

  // ---------- LOGIKA (PERBANDINGAN, AND, OR, NOT) ----------
  // Lulus jika nilai >= 70 DAN (kehadiran >= 75% ATAU punya surat izin)
  const lulus = (nilaiAkhir >= 70) && (persenHadir >= 75 || punyaToleransi);

  // Predikat huruf
  let huruf;
  if (nilaiAkhir >= 85) huruf = "A";
  else if (nilaiAkhir >= 75) huruf = "B";
  else if (nilaiAkhir >= 65) huruf = "C";
  else if (nilaiAkhir >= 50) huruf = "D";
  else huruf = "E";

  // Status akhir
  let status, kelas;
  if (lulus) {
    status = "LULUS";
    kelas = "lulus";
  } else if (!lulus && nilaiAkhir >= 60) {
    status = "REMEDIAL (nilai/kehadiran belum memenuhi)";
    kelas = "remedial";
  } else {
    status = "TIDAK LULUS";
    kelas = "gagal";
  }

  // ---------- OUTPUT pada form ----------
  document.getElementById("outNama").textContent = nama;
  document.getElementById("outMatkul").textContent = matkul;
  document.getElementById("outNilai").textContent =
    nilaiAkhir.toFixed(2) + "  (Huruf: " + huruf + ")";
  document.getElementById("outHadir").textContent =
    hadir + "/" + TOTAL_PERTEMUAN + " pertemuan (" + persenHadir.toFixed(1) + "%)";
  outStatus.textContent = "STATUS : " + status;
  outStatus.className = "status " + kelas;

  // Tambah ke daftar riwayat
  const li = document.createElement("li");
  li.textContent = nama + " | " + matkul + " | " + nilaiAkhir.toFixed(1) +
    " | " + huruf + " | " + status.split(" ")[0];
  riwayat.appendChild(li);
});

// ----------------------------------------------------------------------
// EVENT 2: tombol "Reset" diklik
// ----------------------------------------------------------------------
document.getElementById("btnReset").addEventListener("click", function () {
  form.reset();
  bersihkanError();
  document.getElementById("outNama").textContent = "-";
  document.getElementById("outMatkul").textContent = "-";
  document.getElementById("outNilai").textContent = "-";
  document.getElementById("outHadir").textContent = "-";
  outStatus.textContent = "STATUS : -";
  outStatus.className = "status";
  inNama.focus();
});

// ----------------------------------------------------------------------
// EVENT 3: hapus tanda error saat pengguna mulai mengetik / memilih lagi
// ----------------------------------------------------------------------
[inNama, inMatkul, inTugas, inUts, inUas, inHadir].forEach(function (el) {
  el.addEventListener("input", function () {
    el.classList.remove("salah");
  });
});

inNama.focus();
