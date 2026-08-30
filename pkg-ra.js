// pkg-ra.js — Dataset Instrumen PKG khusus RA (Raudhatul Athfal)
// Terpisah dari instrumen.js (jenjang lain) agar RA dapat diperbarui tanpa
// menyentuh engine/logika/tampilan. Dipakai otomatis oleh db.js saat guru
// berjenjang RA dan role = GMP (lihat getInstrumen()).
// Sumber: pkg-ra-instrument-2026.json (Kep. Dirjen Pendis No. 1843 Tahun 2021)
// Struktur: 15 komponen / 79 indikator. Skala skor 0-2 per indikator.
(function () {
  'use strict';

  var SPEC = {
    "schemaVersion": "1.0",
    "instrumentType": "PKG_RA",
    "instrumentVersion": "2026.1",
    "jenjang": "RA",
    "nama": "Instrumen Penilaian Kinerja Guru Raudhatul Athfal",
    "dasarUtama": "Keputusan Direktur Jenderal Pendidikan Islam Nomor 1843 Tahun 2021 tentang Petunjuk Teknis Penilaian Kinerja Guru Madrasah",
    "catatanPenyelarasan": "Struktur 15 komponen dan 79 indikator dipertahankan sebagai fondasi PKG RA; redaksi operasional diselaraskan dengan konteks pembelajaran RA dan terminologi kurikulum yang berlaku.",
    "skala": {
      "min": 0,
      "max": 2,
      "label": {
        "0": "Belum terpenuhi",
        "1": "Terpenuhi sebagian",
        "2": "Terpenuhi seluruhnya"
      }
    },
    "konversiKomponen": [
      {
        "minExclusive": 0,
        "maxInclusive": 25,
        "nilai": 1
      },
      {
        "minExclusive": 25,
        "maxInclusive": 50,
        "nilai": 2
      },
      {
        "minExclusive": 50,
        "maxInclusive": 75,
        "nilai": 3
      },
      {
        "minExclusive": 75,
        "maxInclusive": 100,
        "nilai": 4
      }
    ],
    "components": [
      {
        "id": "RA-PED-01",
        "kompetensi": "Pedagogik",
        "noKomponen": 1,
        "komponen": "Mengorganisasikan aspek perkembangan sesuai dengan karakteristik perkembangan anak usia dini",
        "buktiUmum": [
          "Data anak",
          "asesmen awal",
          "catatan anekdot",
          "dokumentasi lingkungan belajar",
          "hasil karya anak",
          "catatan perkembangan",
          "hasil observasi/supervisi"
        ],
        "indikator": [
          {
            "id": "RA-PED-01-I01",
            "no": 1,
            "teks": "Guru mengidentifikasi karakteristik setiap anak berdasarkan tahap usia, kebutuhan, latar belakang, dan perkembangan individual.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-01-I02",
            "no": 2,
            "teks": "Guru mengidentifikasi kemampuan awal anak pada berbagai aspek perkembangan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-01-I03",
            "no": 3,
            "teks": "Guru menata lingkungan bermain yang aman, nyaman, inklusif, menarik, dan mendukung perkembangan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-01-I04",
            "no": 4,
            "teks": "Guru memberikan kesempatan yang setara kepada seluruh anak untuk aktif dalam kegiatan bermain dan belajar.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-01-I05",
            "no": 5,
            "teks": "Guru memiliki catatan perkembangan setiap anak yang diperoleh melalui pengamatan secara berkelanjutan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-01-I06",
            "no": 6,
            "teks": "Guru mengidentifikasi hambatan atau kesulitan perkembangan anak dan memberikan stimulasi atau tindak lanjut yang sesuai.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 6,
        "skorMaksimal": 12
      },
      {
        "id": "RA-PED-02",
        "kompetensi": "Pedagogik",
        "noKomponen": 2,
        "komponen": "Menganalisis teori bermain sesuai aspek dan tahapan perkembangan, potensi, bakat, dan minat anak usia dini",
        "buktiUmum": [
          "Perencanaan pembelajaran",
          "modul/perangkat ajar",
          "dokumentasi kegiatan",
          "hasil observasi pembelajaran",
          "catatan perkembangan"
        ],
        "indikator": [
          {
            "id": "RA-PED-02-I01",
            "no": 1,
            "teks": "Guru memilih pendekatan dan metode bermain sesuai tahap perkembangan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-02-I02",
            "no": 2,
            "teks": "Guru menerapkan kegiatan belajar melalui bermain sesuai kebutuhan dan karakteristik anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-02-I03",
            "no": 3,
            "teks": "Guru merancang kegiatan bermain yang kreatif dan memberikan pengalaman langsung kepada anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-02-I04",
            "no": 4,
            "teks": "Guru mengembangkan kegiatan bermain yang kontekstual, bermakna, dan berhubungan dengan kehidupan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-02-I05",
            "no": 5,
            "teks": "Guru menggunakan berbagai strategi bermain untuk mengembangkan potensi, bakat, minat, kreativitas, dan rasa ingin tahu anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 5,
        "skorMaksimal": 10
      },
      {
        "id": "RA-PED-03",
        "kompetensi": "Pedagogik",
        "noKomponen": 3,
        "komponen": "Merancang kegiatan pengembangan anak usia dini berdasarkan kurikulum",
        "buktiUmum": [
          "Dokumen kurikulum operasional RA",
          "program semester",
          "perencanaan pembelajaran",
          "tujuan pembelajaran",
          "modul/perangkat ajar"
        ],
        "indikator": [
          {
            "id": "RA-PED-03-I01",
            "no": 1,
            "teks": "Guru menyusun perencanaan pembelajaran berdasarkan kurikulum RA yang berlaku.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-03-I02",
            "no": 2,
            "teks": "Guru menentukan tujuan pembelajaran sesuai capaian perkembangan dan kebutuhan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-03-I03",
            "no": 3,
            "teks": "Guru merancang pengalaman belajar yang mengintegrasikan berbagai aspek perkembangan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-03-I04",
            "no": 4,
            "teks": "Guru memilih kegiatan, materi, media, sumber belajar, dan lingkungan belajar yang sesuai usia anak, kontekstual, menyenangkan, bermakna, dan bernilai Islami.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 4,
        "skorMaksimal": 8
      },
      {
        "id": "RA-PED-04",
        "kompetensi": "Pedagogik",
        "noKomponen": 4,
        "komponen": "Menyelenggarakan kegiatan bermain yang menyenangkan",
        "buktiUmum": [
          "Observasi pembelajaran",
          "perangkat ajar",
          "dokumentasi kegiatan",
          "media/APE",
          "hasil karya anak",
          "hasil supervisi"
        ],
        "indikator": [
          {
            "id": "RA-PED-04-I01",
            "no": 1,
            "teks": "Guru melaksanakan pembelajaran melalui bermain sesuai tujuan perkembangan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-04-I02",
            "no": 2,
            "teks": "Guru menciptakan suasana belajar yang aman, nyaman, menyenangkan, dan bebas tekanan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-04-I03",
            "no": 3,
            "teks": "Guru melaksanakan kegiatan yang kreatif dan bervariasi di dalam maupun di luar kelas.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-04-I04",
            "no": 4,
            "teks": "Guru menghubungkan pengalaman belajar dengan kehidupan nyata anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-04-I05",
            "no": 5,
            "teks": "Guru menanamkan kebiasaan baik, nilai keagamaan, akhlak, karakter, dan nilai-nilai cinta melalui kegiatan sehari-hari.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-04-I06",
            "no": 6,
            "teks": "Guru memberikan kesempatan kepada anak untuk bertanya, mencoba, mengeksplorasi, berinteraksi, memilih, dan mengemukakan gagasan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-04-I07",
            "no": 7,
            "teks": "Guru menggunakan media, APE, lingkungan, bahan alam, dan sumber belajar yang mendukung pembelajaran aktif.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 7,
        "skorMaksimal": 14
      },
      {
        "id": "RA-PED-05",
        "kompetensi": "Pedagogik",
        "noKomponen": 5,
        "komponen": "Memanfaatkan teknologi informasi dan komunikasi untuk kepentingan kegiatan pengembangan yang mendidik",
        "buktiUmum": [
          "Media digital",
          "perangkat ajar",
          "dokumentasi penggunaan TIK",
          "administrasi digital",
          "portofolio"
        ],
        "indikator": [
          {
            "id": "RA-PED-05-I01",
            "no": 1,
            "teks": "Guru memanfaatkan teknologi untuk mendukung perencanaan dan pengembangan pembelajaran.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-05-I02",
            "no": 2,
            "teks": "Guru memanfaatkan teknologi untuk membuat atau memilih media pembelajaran yang sesuai anak usia dini.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-05-I03",
            "no": 3,
            "teks": "Guru menggunakan teknologi secara proporsional, aman, sehat, dan sesuai tahap perkembangan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-05-I04",
            "no": 4,
            "teks": "Guru memanfaatkan teknologi untuk administrasi pembelajaran, dokumentasi perkembangan, komunikasi, dan peningkatan profesionalitas.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 4,
        "skorMaksimal": 8
      },
      {
        "id": "RA-PED-06",
        "kompetensi": "Pedagogik",
        "noKomponen": 6,
        "komponen": "Mengembangkan potensi anak usia dini",
        "buktiUmum": [
          "APE/media",
          "catatan anekdot",
          "portofolio anak",
          "hasil karya",
          "dokumentasi kegiatan",
          "asesmen perkembangan"
        ],
        "indikator": [
          {
            "id": "RA-PED-06-I01",
            "no": 1,
            "teks": "Guru memanfaatkan lingkungan dan sumber belajar yang beragam untuk mengembangkan potensi anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-06-I02",
            "no": 2,
            "teks": "Guru memilih APE dan media sesuai kebutuhan dan tahapan perkembangan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-06-I03",
            "no": 3,
            "teks": "Guru mengembangkan atau membuat media/APE yang kreatif, aman, dan sesuai kebutuhan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-06-I04",
            "no": 4,
            "teks": "Guru memberikan kesempatan kepada setiap anak untuk mengekspresikan dan mengaktualisasikan dirinya.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-06-I05",
            "no": 5,
            "teks": "Guru mengidentifikasi minat, bakat, potensi, keunikan, serta hambatan perkembangan setiap anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-06-I06",
            "no": 6,
            "teks": "Guru memberikan dukungan dan stimulasi untuk mengembangkan kreativitas, kemandirian, kemampuan berpikir, komunikasi, motorik, sosial-emosional, seni, serta nilai agama dan moral.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 6,
        "skorMaksimal": 12
      },
      {
        "id": "RA-PED-07",
        "kompetensi": "Pedagogik",
        "noKomponen": 7,
        "komponen": "Berkomunikasi secara efektif, empatik, dan santun dengan anak",
        "buktiUmum": [
          "Observasi pembelajaran",
          "hasil supervisi",
          "dokumentasi",
          "rekaman kegiatan bila tersedia"
        ],
        "indikator": [
          {
            "id": "RA-PED-07-I01",
            "no": 1,
            "teks": "Guru berkomunikasi dengan suasana ceria, hangat, ekspresif, dan menyenangkan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-07-I02",
            "no": 2,
            "teks": "Guru menggunakan berbagai cara berkomunikasi seperti cerita, percakapan, lagu, permainan, syair, dan aktivitas interaktif.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-07-I03",
            "no": 3,
            "teks": "Guru menggunakan bahasa yang santun, positif, penuh kasih sayang, dan mudah dipahami anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-07-I04",
            "no": 4,
            "teks": "Guru memberikan kesempatan kepada anak untuk bertanya dan mengemukakan pendapat.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-07-I05",
            "no": 5,
            "teks": "Guru mendengarkan cerita, jawaban, gagasan, dan perasaan anak dengan penuh perhatian.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-07-I06",
            "no": 6,
            "teks": "Guru membangun kegiatan yang menumbuhkan kerja sama dan komunikasi positif antaranak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 6,
        "skorMaksimal": 12
      },
      {
        "id": "RA-PED-08",
        "kompetensi": "Pedagogik",
        "noKomponen": 8,
        "komponen": "Menyelenggarakan dan membuat laporan hasil asesmen perkembangan anak",
        "buktiUmum": [
          "Catatan anekdot",
          "ceklis",
          "hasil karya",
          "portofolio",
          "dokumentasi",
          "catatan unjuk kerja",
          "laporan perkembangan/rapor",
          "tindak lanjut asesmen"
        ],
        "indikator": [
          {
            "id": "RA-PED-08-I01",
            "no": 1,
            "teks": "Guru melaksanakan asesmen perkembangan secara terencana dan berkelanjutan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-08-I02",
            "no": 2,
            "teks": "Guru melakukan asesmen secara alami dalam aktivitas bermain tanpa memberikan tekanan kepada anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-08-I03",
            "no": 3,
            "teks": "Guru menggunakan berbagai teknik asesmen yang sesuai dengan karakteristik anak usia dini.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-08-I04",
            "no": 4,
            "teks": "Guru menyusun indikator atau kriteria ketercapaian perkembangan berdasarkan tujuan pembelajaran dan tahap perkembangan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-08-I05",
            "no": 5,
            "teks": "Guru melakukan asesmen autentik berdasarkan perilaku, proses, pengalaman, dan hasil karya anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-08-I06",
            "no": 6,
            "teks": "Guru menganalisis hasil asesmen untuk mengetahui kekuatan, kebutuhan, dan perkembangan setiap anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-08-I07",
            "no": 7,
            "teks": "Guru memberikan tindak lanjut berupa stimulasi yang sesuai dengan kebutuhan perkembangan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-08-I08",
            "no": 8,
            "teks": "Guru menggunakan hasil asesmen untuk memperbaiki perencanaan dan proses pembelajaran berikutnya.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PED-08-I09",
            "no": 9,
            "teks": "Guru mengomunikasikan perkembangan anak kepada orang tua atau wali secara objektif, santun, dan mudah dipahami.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 9,
        "skorMaksimal": 18
      },
      {
        "id": "RA-KEP-09",
        "kompetensi": "Kepribadian",
        "noKomponen": 9,
        "komponen": "Bertindak sesuai norma agama, hukum, sosial, dan kebudayaan nasional Indonesia",
        "buktiUmum": [
          "Observasi",
          "wawancara",
          "dokumentasi kegiatan keagamaan/nasional",
          "catatan perilaku"
        ],
        "indikator": [
          {
            "id": "RA-KEP-09-I01",
            "no": 1,
            "teks": "Guru memperlakukan seluruh anak secara adil tanpa membedakan latar belakang.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-09-I02",
            "no": 2,
            "teks": "Guru tidak melakukan tindakan diskriminatif terhadap anak, orang tua, rekan kerja, atau masyarakat.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-09-I03",
            "no": 3,
            "teks": "Guru membiasakan anak menghargai perbedaan dan keberagaman.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-09-I04",
            "no": 4,
            "teks": "Guru menaati norma agama, aturan lembaga, hukum, dan nilai sosial yang berlaku.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-09-I05",
            "no": 5,
            "teks": "Guru menumbuhkan cinta tanah air, persatuan, toleransi, dan penghargaan terhadap kebinekaan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 5,
        "skorMaksimal": 10
      },
      {
        "id": "RA-KEP-10",
        "kompetensi": "Kepribadian",
        "noKomponen": 10,
        "komponen": "Menampilkan diri sebagai pribadi yang jujur, berakhlakul karimah, dan menjadi teladan",
        "buktiUmum": [
          "Observasi",
          "wawancara kepala RA/rekan/orang tua",
          "dokumentasi kegiatan",
          "catatan pembinaan"
        ],
        "indikator": [
          {
            "id": "RA-KEP-10-I01",
            "no": 1,
            "teks": "Guru menunjukkan ketaatan beragama dalam kehidupan dan pelaksanaan tugas.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-10-I02",
            "no": 2,
            "teks": "Guru menunjukkan kejujuran dan konsistensi antara perkataan dengan perbuatan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-10-I03",
            "no": 3,
            "teks": "Guru bertutur kata, berpenampilan, dan berperilaku santun.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-10-I04",
            "no": 4,
            "teks": "Guru menjadi teladan bagi anak, rekan kerja, orang tua, dan masyarakat.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-10-I05",
            "no": 5,
            "teks": "Guru bersikap dewasa dan terbuka terhadap kritik, saran, evaluasi, dan perbaikan diri.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 5,
        "skorMaksimal": 10
      },
      {
        "id": "RA-KEP-11",
        "kompetensi": "Kepribadian",
        "noKomponen": 11,
        "komponen": "Menunjukkan etos kerja, tanggung jawab tinggi, percaya diri, dan bangga menjadi guru",
        "buktiUmum": [
          "Daftar hadir",
          "SK pembagian tugas",
          "jadwal mengajar",
          "surat tugas",
          "sertifikat pengembangan kompetensi",
          "penghargaan",
          "keterlibatan organisasi profesi"
        ],
        "indikator": [
          {
            "id": "RA-KEP-11-I01",
            "no": 1,
            "teks": "Guru menunjukkan kedisiplinan dan ketepatan waktu.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-11-I02",
            "no": 2,
            "teks": "Guru memastikan proses pembelajaran tetap berjalan apabila berhalangan sesuai mekanisme lembaga.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-11-I03",
            "no": 3,
            "teks": "Guru memenuhi tugas dan kewajiban mengajar sesuai ketentuan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-11-I04",
            "no": 4,
            "teks": "Guru melaksanakan tugas dengan penuh tanggung jawab.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-11-I05",
            "no": 5,
            "teks": "Guru memanfaatkan waktu untuk meningkatkan kompetensi dan kualitas pembelajaran.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-11-I06",
            "no": 6,
            "teks": "Guru memberikan kontribusi nyata bagi pengembangan RA.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-KEP-11-I07",
            "no": 7,
            "teks": "Guru menjaga martabat profesi serta melaksanakan kode etik guru.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 7,
        "skorMaksimal": 14
      },
      {
        "id": "RA-PRO-12",
        "kompetensi": "Profesional",
        "noKomponen": 12,
        "komponen": "Mengembangkan materi, struktur, dan konsep bidang keilmuan sesuai kebutuhan dan tahapan perkembangan anak usia dini",
        "buktiUmum": [
          "Kurikulum operasional RA",
          "perangkat ajar",
          "tujuan pembelajaran",
          "hasil observasi",
          "dokumentasi pembelajaran"
        ],
        "indikator": [
          {
            "id": "RA-PRO-12-I01",
            "no": 1,
            "teks": "Guru memahami capaian perkembangan, tujuan pembelajaran, dan lingkup materi pembelajaran RA.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PRO-12-I02",
            "no": 2,
            "teks": "Guru mengembangkan pengalaman belajar yang mencakup nilai agama dan moral, jati diri, kemampuan dasar/literasi awal, numerasi awal, sains, teknologi, rekayasa, seni, serta berbagai aspek perkembangan anak secara terpadu.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PRO-12-I03",
            "no": 3,
            "teks": "Guru merancang pembelajaran melalui bermain yang sesuai tahap perkembangan, kebutuhan, karakteristik, dan konteks kehidupan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 3,
        "skorMaksimal": 6
      },
      {
        "id": "RA-PRO-13",
        "kompetensi": "Profesional",
        "noKomponen": 13,
        "komponen": "Mengembangkan profesionalitas secara berkelanjutan melalui tindakan reflektif",
        "buktiUmum": [
          "Evaluasi diri",
          "rencana pengembangan kompetensi",
          "sertifikat",
          "surat tugas",
          "praktik baik",
          "karya inovatif",
          "laporan kegiatan/refleksi"
        ],
        "indikator": [
          {
            "id": "RA-PRO-13-I01",
            "no": 1,
            "teks": "Guru melakukan refleksi atau evaluasi diri terhadap kinerjanya.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PRO-13-I02",
            "no": 2,
            "teks": "Guru menggunakan hasil refleksi untuk memperbaiki pembelajaran dan merencanakan pengembangan kompetensi.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PRO-13-I03",
            "no": 3,
            "teks": "Guru aktif mengikuti kegiatan pengembangan profesi seperti komunitas belajar, pelatihan, seminar, workshop, webinar, organisasi profesi, atau kegiatan ilmiah lainnya.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PRO-13-I04",
            "no": 4,
            "teks": "Guru menerapkan hasil pengembangan kompetensi dalam praktik pembelajaran.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-PRO-13-I05",
            "no": 5,
            "teks": "Guru menghasilkan atau mengembangkan praktik baik, inovasi, karya, penelitian/tindakan reflektif, atau bentuk pengembangan profesional lain yang relevan.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 5,
        "skorMaksimal": 10
      },
      {
        "id": "RA-SOS-14",
        "kompetensi": "Sosial",
        "noKomponen": 14,
        "komponen": "Berkomunikasi secara efektif, empatik, dan santun dengan sesama pendidik, tenaga kependidikan, orang tua, dan masyarakat",
        "buktiUmum": [
          "Wawancara",
          "dokumentasi kerja sama",
          "kegiatan komunitas/IGRA",
          "komunikasi orang tua",
          "kegiatan parenting",
          "media komunikasi RA"
        ],
        "indikator": [
          {
            "id": "RA-SOS-14-I01",
            "no": 1,
            "teks": "Guru bekerja sama dan menjaga hubungan positif dengan kepala RA, rekan kerja, tenaga kependidikan, orang tua, dan masyarakat.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-SOS-14-I02",
            "no": 2,
            "teks": "Guru aktif dalam komunitas profesi dan/atau komunitas belajar serta memberikan kontribusi terhadap pengembangan RA.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-SOS-14-I03",
            "no": 3,
            "teks": "Guru bekerja sama dengan orang tua dan pihak terkait dalam mendukung perkembangan serta mengatasi permasalahan anak.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-SOS-14-I04",
            "no": 4,
            "teks": "Guru menggunakan berbagai media komunikasi, termasuk teknologi, secara santun, aman, etis, dan efektif.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 4,
        "skorMaksimal": 8
      },
      {
        "id": "RA-SOS-15",
        "kompetensi": "Sosial",
        "noKomponen": 15,
        "komponen": "Beradaptasi dalam keanekaragaman sosial budaya bangsa Indonesia dengan tetap menjunjung tinggi nilai Islami",
        "buktiUmum": [
          "Observasi",
          "wawancara orang tua/masyarakat",
          "dokumentasi pembelajaran",
          "permainan tradisional",
          "kegiatan seni dan budaya"
        ],
        "indikator": [
          {
            "id": "RA-SOS-15-I01",
            "no": 1,
            "teks": "Guru mampu menyesuaikan diri dengan kondisi sosial, budaya, bahasa, dan karakteristik masyarakat tempat bertugas.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-SOS-15-I02",
            "no": 2,
            "teks": "Guru menghargai budaya lokal dan memanfaatkannya sebagai sumber belajar yang positif.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          },
          {
            "id": "RA-SOS-15-I03",
            "no": 3,
            "teks": "Guru mengenalkan keberagaman sosial dan budaya Indonesia melalui permainan, seni, cerita, tradisi, atau kegiatan pembelajaran dengan tetap berlandaskan nilai-nilai Islam.",
            "skorMin": 0,
            "skorMax": 2,
            "rubrik": {
              "0": "Belum terpenuhi / tidak ditemukan bukti pelaksanaan.",
              "1": "Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.",
              "2": "Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai."
            }
          }
        ],
        "jumlahIndikator": 3,
        "skorMaksimal": 6
      }
    ]
  };

  window.PKG_RA_META = {
    instrumentType: SPEC.instrumentType,
    instrumentVersion: SPEC.instrumentVersion,
    jenjang: SPEC.jenjang,
    nama: SPEC.nama,
    dasarUtama: SPEC.dasarUtama,
    catatanPenyelarasan: SPEC.catatanPenyelarasan,
    skala: SPEC.skala,
    konversiKomponen: SPEC.konversiKomponen
  };

  // Flatten ke format engine yang sama dengan window.INSTRUMEN (db.js).
  // Field rubrik & buktiUmum ditambahkan untuk tampilan sesuai spec.
  window.INSTRUMEN_RA = [];
  for (var c = 0; c < SPEC.components.length; c++) {
    var comp = SPEC.components[c];
    for (var i = 0; i < comp.indikator.length; i++) {
      var ind = comp.indikator[i];
      window.INSTRUMEN_RA.push({
        role_code: 'GMP',
        role_label: 'Guru Madrasah (RA)',
        max_score: ind.skorMax,
        kompetensi_no: comp.noKomponen,
        kompetensi_nama: comp.komponen,
        kompetensi: comp.kompetensi,
        buktiUmum: comp.buktiUmum || null,
        indikator_no: ind.no,
        indikator: ind.teks,
        rubrik: ind.rubrik || null,
        id: ind.id
      });
    }
  }

  // Expose SPEC untuk akses terstruktur (bukti per komponen, rubrik, dll).
  window.PKG_RA_RAW = SPEC.components;
})();