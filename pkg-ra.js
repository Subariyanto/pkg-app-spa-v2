// pkg-ra.js — Dataset Instrumen PKG khusus RA (Raudhatul Athfal)
// Terpisah dari instrumen.js (jenjang lain) agar RA dapat diperbarui tanpa
// menyentuh engine/logika/tampilan. Dipakai otomatis oleh db.js saat guru
// berjenjang RA dan role = GMP (lihat getInstrumen()).
// Sumber: Keputusan Dirjen Pendis No. 1843 Tahun 2021 (diselaraskan 2026.1).
// Struktur: 15 komponen / 79 indikator. Skala skor 0-2 per indikator.
(function () {
  'use strict';

  var RAW = [
    {
      id: 'RA-PED-01', no: 1, kompetensi: 'Pedagogik',
      nama: 'Mengorganisasikan aspek perkembangan sesuai dengan karakteristik perkembangan anak usia dini',
      buktiUmum: [
        'Catatan pengamatan perkembangan setiap anak',
        'Rencana pembelajaran yang membedakan kebutuhan individual anak',
        'Dokumen identifikasi hambatan perkembangan dan tindak lanjut yang sesuai'
      ],
      items: [
        'Guru mengidentifikasi karakteristik setiap anak berdasarkan tahap usia, kebutuhan, latar belakang, dan perkembangan individual.',
        'Guru mengidentifikasi kemampuan awal anak pada berbagai aspek perkembangan.',
        'Guru menata lingkungan bermain yang aman, nyaman, inklusif, menarik, dan mendukung perkembangan anak.',
        'Guru memberikan kesempatan yang setara kepada seluruh anak untuk aktif dalam kegiatan bermain dan belajar.',
        'Guru memiliki catatan perkembangan setiap anak yang diperoleh melalui pengamatan secara berkelanjutan.',
        'Guru mengidentifikasi hambatan atau kesulitan perkembangan anak dan memberikan stimulasi atau tindak lanjut yang sesuai.'
      ]
    },
    {
      id: 'RA-PED-02', no: 2, kompetensi: 'Pedagogik',
      nama: 'Menganalisis teori bermain sesuai aspek dan tahapan perkembangan, potensi, bakat, dan minat anak usia dini',
      buktiUmum: [
        'Rencana kegiatan bermain sesuai tahap perkembangan anak',
        'Dokumen kegiatan bermain kreatif yang memberikan pengalaman langsung',
        'Catatan penggunaan berbagai strategi bermain untuk mengembangkan potensi anak'
      ],
      items: [
        'Guru memilih pendekatan dan metode bermain sesuai tahap perkembangan anak.',
        'Guru menerapkan kegiatan belajar melalui bermain sesuai kebutuhan dan karakteristik anak.',
        'Guru merancang kegiatan bermain yang kreatif dan memberikan pengalaman langsung kepada anak.',
        'Guru mengembangkan kegiatan bermain yang kontekstual, bermakna, dan berhubungan dengan kehidupan anak.',
        'Guru menggunakan berbagai strategi bermain untuk mengembangkan potensi, bakat, minat, kreativitas, dan rasa ingin tahu anak.'
      ]
    },
    {
      id: 'RA-PED-03', no: 3, kompetensi: 'Pedagogik',
      nama: 'Merancang kegiatan pengembangan anak usia dini berdasarkan kurikulum',
      buktiUmum: [
        'RPP/RPPM/RPPH berdasarkan kurikulum RA yang berlaku',
        'Dokumen tujuan pembelajaran sesuai capaian perkembangan',
        'Pilihan kegiatan, media, dan sumber belajar yang sesuai usia anak'
      ],
      items: [
        'Guru menyusun perencanaan pembelajaran berdasarkan kurikulum RA yang berlaku.',
        'Guru menentukan tujuan pembelajaran sesuai capaian perkembangan dan kebutuhan anak.',
        'Guru merancang pengalaman belajar yang mengintegrasikan berbagai aspek perkembangan.',
        'Guru memilih kegiatan, materi, media, sumber belajar, dan lingkungan belajar yang sesuai usia anak, kontekstual, menyenangkan, bermakna, dan bernilai Islami.'
      ]
    },
    {
      id: 'RA-PED-04', no: 4, kompetensi: 'Pedagogik',
      nama: 'Menyelenggarakan kegiatan bermain yang menyenangkan',
      buktiUmum: [
        'Catatan pelaksanaan pembelajaran melalui bermain sesuai tujuan perkembangan',
        'Dokumentasi kegiatan kreatif di dalam dan luar kelas',
        'Catatan penanaman nilai keagamaan, akhlak, dan karakter melalui kegiatan sehari-hari'
      ],
      items: [
        'Guru melaksanakan pembelajaran melalui bermain sesuai tujuan perkembangan anak.',
        'Guru menciptakan suasana belajar yang aman, nyaman, menyenangkan, dan bebas tekanan.',
        'Guru melaksanakan kegiatan yang kreatif dan bervariasi di dalam maupun di luar kelas.',
        'Guru menghubungkan pengalaman belajar dengan kehidupan nyata anak.',
        'Guru menanamkan kebiasaan baik, nilai keagamaan, akhlak, karakter, dan nilai-nilai cinta melalui kegiatan sehari-hari.',
        'Guru memberikan kesempatan kepada anak untuk bertanya, mencoba, mengeksplorasi, berinteraksi, memilih, dan mengemukakan gagasan.',
        'Guru menggunakan media, APE, lingkungan, bahan alam, dan sumber belajar yang mendukung pembelajaran aktif.'
      ]
    },
    {
      id: 'RA-PED-05', no: 5, kompetensi: 'Pedagogik',
      nama: 'Memanfaatkan teknologi informasi dan komunikasi untuk kepentingan kegiatan pengembangan yang mendidik',
      buktiUmum: [
        'Dokumen penggunaan teknologi untuk perencanaan dan pengembangan pembelajaran',
        'Media pembelajaran digital yang sesuai anak usia dini',
        'Catatan penggunaan teknologi untuk administrasi dan dokumentasi perkembangan'
      ],
      items: [
        'Guru memanfaatkan teknologi untuk mendukung perencanaan dan pengembangan pembelajaran.',
        'Guru memanfaatkan teknologi untuk membuat atau memilih media pembelajaran yang sesuai anak usia dini.',
        'Guru menggunakan teknologi secara proporsional, aman, sehat, dan sesuai tahap perkembangan anak.',
        'Guru memanfaatkan teknologi untuk administrasi pembelajaran, dokumentasi perkembangan, komunikasi, dan peningkatan profesionalitas.'
      ]
    },
    {
      id: 'RA-PED-06', no: 6, kompetensi: 'Pedagogik',
      nama: 'Mengembangkan potensi anak usia dini',
      buktiUmum: [
        'Dokumen APE dan media yang dikembangkan guru',
        'Catatan identifikasi minat, bakat, dan keunikan setiap anak',
        'Portofolio karya anak dan catatan dukungan stimulasi'
      ],
      items: [
        'Guru memanfaatkan lingkungan dan sumber belajar yang beragam untuk mengembangkan potensi anak.',
        'Guru memilih APE dan media sesuai kebutuhan dan tahapan perkembangan anak.',
        'Guru mengembangkan atau membuat media/APE yang kreatif, aman, dan sesuai kebutuhan anak.',
        'Guru memberikan kesempatan kepada setiap anak untuk mengekspresikan dan mengaktualisasikan dirinya.',
        'Guru mengidentifikasi minat, bakat, potensi, keunikan, serta hambatan perkembangan setiap anak.',
        'Guru memberikan dukungan dan stimulasi untuk mengembangkan kreativitas, kemandirian, kemampuan berpikir, komunikasi, motorik, sosial-emosional, seni, serta nilai agama dan moral.'
      ]
    },
    {
      id: 'RA-PED-07', no: 7, kompetensi: 'Pedagogik',
      nama: 'Berkomunikasi secara efektif, empatik, dan santun dengan anak',
      buktiUmum: [
        'Observasi interaksi guru-anak yang ceria, hangat, dan ekspresif',
        'Dokumen berbagai cara berkomunikasi (cerita, percakapan, lagu, permainan)',
        'Catatan kegiatan yang menumbuhkan kerja sama dan komunikasi positif antaranak'
      ],
      items: [
        'Guru berkomunikasi dengan suasana ceria, hangat, ekspresif, dan menyenangkan.',
        'Guru menggunakan berbagai cara berkomunikasi seperti cerita, percakapan, lagu, permainan, syair, dan aktivitas interaktif.',
        'Guru menggunakan bahasa yang santun, positif, penuh kasih sayang, dan mudah dipahami anak.',
        'Guru memberikan kesempatan kepada anak untuk bertanya dan mengemukakan pendapat.',
        'Guru mendengarkan cerita, jawaban, gagasan, dan perasaan anak dengan penuh perhatian.',
        'Guru membangun kegiatan yang menumbuhkan kerja sama dan komunikasi positif antaranak.'
      ]
    },
    {
      id: 'RA-PED-08', no: 8, kompetensi: 'Pedagogik',
      nama: 'Menyelenggarakan dan membuat laporan hasil asesmen perkembangan anak',
      buktiUmum: [
        'Catatan asesmen perkembangan yang terencana dan berkelanjutan',
        'Instrumen asesmen yang sesuai karakteristik anak usia dini',
        'Laporan perkembangan anak yang dikomunikasikan kepada orang tua'
      ],
      items: [
        'Guru melaksanakan asesmen perkembangan secara terencana dan berkelanjutan.',
        'Guru melakukan asesmen secara alami dalam aktivitas bermain tanpa memberikan tekanan kepada anak.',
        'Guru menggunakan berbagai teknik asesmen yang sesuai dengan karakteristik anak usia dini.',
        'Guru menyusun indikator atau kriteria ketercapaian perkembangan berdasarkan tujuan pembelajaran dan tahap perkembangan anak.',
        'Guru melakukan asesmen autentik berdasarkan perilaku, proses, pengalaman, dan hasil karya anak.',
        'Guru menganalisis hasil asesmen untuk mengetahui kekuatan, kebutuhan, dan perkembangan setiap anak.',
        'Guru memberikan tindak lanjut berupa stimulasi yang sesuai dengan kebutuhan perkembangan anak.',
        'Guru menggunakan hasil asesmen untuk memperbaiki perencanaan dan proses pembelajaran berikutnya.',
        'Guru mengomunikasikan perkembangan anak kepada orang tua atau wali secara objektif, santun, dan mudah dipahami.'
      ]
    },
    {
      id: 'RA-KEP-09', no: 9, kompetensi: 'Kepribadian',
      nama: 'Bertindak sesuai norma agama, hukum, sosial, dan kebudayaan nasional Indonesia',
      buktiUmum: [
        'Observasi perlakuan adil terhadap semua anak tanpa perbedaan',
        'Catatan kegiatan membiasakan anak menghargai keberagaman',
        'Dokumen kepatuhan norma agama dan aturan lembaga'
      ],
      items: [
        'Guru memperlakukan seluruh anak secara adil tanpa membedakan latar belakang.',
        'Guru tidak melakukan tindakan diskriminatif terhadap anak, orang tua, rekan kerja, atau masyarakat.',
        'Guru membiasakan anak menghargai perbedaan dan keberagaman.',
        'Guru menaati norma agama, aturan lembaga, hukum, dan nilai sosial yang berlaku.',
        'Guru menumbuhkan cinta tanah air, persatuan, toleransi, dan penghargaan terhadap kebinekaan.'
      ]
    },
    {
      id: 'RA-KEP-10', no: 10, kompetensi: 'Kepribadian',
      nama: 'Menampilkan diri sebagai pribadi yang jujur, berakhlakul karimah, dan menjadi teladan',
      buktiUmum: [
        'Observasi konsistensi antara perkataan dan perbuatan',
        'Catatan penampilan dan tutur kata yang santun',
        'Dokumen keteladan dalam kegiatan sehari-hari'
      ],
      items: [
        'Guru menunjukkan ketaatan beragama dalam kehidupan dan pelaksanaan tugas.',
        'Guru menunjukkan kejujuran dan konsistensi antara perkataan dengan perbuatan.',
        'Guru bertutur kata, berpenampilan, dan berperilaku santun.',
        'Guru menjadi teladan bagi anak, rekan kerja, orang tua, dan masyarakat.',
        'Guru bersikap dewasa dan terbuka terhadap kritik, saran, evaluasi, dan perbaikan diri.'
      ]
    },
    {
      id: 'RA-KEP-11', no: 11, kompetensi: 'Kepribadian',
      nama: 'Menunjukkan etos kerja, tanggung jawab tinggi, percaya diri, dan bangga menjadi guru',
      buktiUmum: [
        'Catatan kehadiran dan ketepatan waktu',
        'Dokumen pelaksanaan tugas mengajar sesuai ketentuan',
        'Catatan kontribusi nyata bagi pengembangan RA'
      ],
      items: [
        'Guru menunjukkan kedisiplinan dan ketepatan waktu.',
        'Guru memastikan proses pembelajaran tetap berjalan apabila berhalangan sesuai mekanisme lembaga.',
        'Guru memenuhi tugas dan kewajiban mengajar sesuai ketentuan.',
        'Guru melaksanakan tugas dengan penuh tanggung jawab.',
        'Guru memanfaatkan waktu untuk meningkatkan kompetensi dan kualitas pembelajaran.',
        'Guru memberikan kontribusi nyata bagi pengembangan RA.',
        'Guru menjaga martabat profesi serta melaksanakan kode etik guru.'
      ]
    },
    {
      id: 'RA-PRO-12', no: 12, kompetensi: 'Profesional',
      nama: 'Mengembangkan materi, struktur, dan konsep bidang keilmuan sesuai kebutuhan dan tahapan perkembangan anak usia dini',
      buktiUmum: [
        'Dokumen perencanaan pembelajaran terpadu sesuai kurikulum RA',
        'Rancangan kegiatan bermain yang sesuai tahap perkembangan',
        'Materi yang mencakup nilai agama, motorik, literasi awal, numerasi, sains, dan seni'
      ],
      items: [
        'Guru memahami capaian perkembangan, tujuan pembelajaran, dan lingkup materi pembelajaran RA.',
        'Guru mengembangkan pengalaman belajar yang mencakup nilai agama dan moral, jati diri, kemampuan dasar/literasi awal, numerasi awal, sains, teknologi, rekayasa, seni, serta berbagai aspek perkembangan anak secara terpadu.',
        'Guru merancang pembelajaran melalui bermain yang sesuai tahap perkembangan, kebutuhan, karakteristik, dan konteks kehidupan anak.'
      ]
    },
    {
      id: 'RA-PRO-13', no: 13, kompetensi: 'Profesional',
      nama: 'Mengembangkan profesionalitas secara berkelanjutan melalui tindakan reflektif',
      buktiUmum: [
        'Catatan refleksi atau evaluasi diri terhadap kinerja',
        'Sertifikat/dokumen kegiatan pengembangan profesi',
        'Karya atau inovasi praktik baik yang dihasilkan guru'
      ],
      items: [
        'Guru melakukan refleksi atau evaluasi diri terhadap kinerjanya.',
        'Guru menggunakan hasil refleksi untuk memperbaiki pembelajaran dan merencanakan pengembangan kompetensi.',
        'Guru aktif mengikuti kegiatan pengembangan profesi seperti komunitas belajar, pelatihan, seminar, workshop, webinar, organisasi profesi, atau kegiatan ilmiah lainnya.',
        'Guru menerapkan hasil pengembangan kompetensi dalam praktik pembelajaran.',
        'Guru menghasilkan atau mengembangkan praktik baik, inovasi, karya, penelitian/tindakan reflektif, atau bentuk pengembangan profesional lain yang relevan.'
      ]
    },
    {
      id: 'RA-SOS-14', no: 14, kompetensi: 'Sosial',
      nama: 'Berkomunikasi secara efektif, empatik, dan santun dengan sesama pendidik, tenaga kependidikan, orang tua, dan masyarakat',
      buktiUmum: [
        'Catatan kerja sama dengan rekan kerja, orang tua, dan masyarakat',
        'Dokumen partisipasi dalam komunitas profesi/belajar',
        'Catatan penyelesaian permasalahan anak bersama orang tua'
      ],
      items: [
        'Guru bekerja sama dan menjaga hubungan positif dengan kepala RA, rekan kerja, tenaga kependidikan, orang tua, dan masyarakat.',
        'Guru aktif dalam komunitas profesi dan/atau komunitas belajar serta memberikan kontribusi terhadap pengembangan RA.',
        'Guru bekerja sama dengan orang tua dan pihak terkait dalam mendukung perkembangan serta mengatasi permasalahan anak.',
        'Guru menggunakan berbagai media komunikasi, termasuk teknologi, secara santun, aman, etis, dan efektif.'
      ]
    },
    {
      id: 'RA-SOS-15', no: 15, kompetensi: 'Sosial',
      nama: 'Beradaptasi dalam keanekaragaman sosial budaya bangsa Indonesia dengan tetap menjunjung tinggi nilai Islami',
      buktiUmum: [
        'Catatan penyesuaian diri dengan kondisi sosial dan budaya lokal',
        'Dokumen pemanfaatan budaya lokal sebagai sumber belajar',
        'Catatan kegiatan mengenalkan keberagaman sosial budaya Indonesia'
      ],
      items: [
        'Guru mampu menyesuaikan diri dengan kondisi sosial, budaya, bahasa, dan karakteristik masyarakat tempat bertugas.',
        'Guru menghargai budaya lokal dan memanfaatkannya sebagai sumber belajar yang positif.',
        'Guru mengenalkan keberagaman sosial dan budaya Indonesia melalui permainan, seni, cerita, tradisi, atau kegiatan pembelajaran dengan tetap berlandaskan nilai-nilai Islam.'
      ]
    }
  ];

  window.PKG_RA_META = {
    instrumentType: 'PKG_RA',
    instrumentVersion: '2026.1',
    jenjang: 'RA',
    nama: 'Instrumen Penilaian Kinerja Guru Raudhatul Athfal',
    dasarUtama: 'Keputusan Direktur Jenderal Pendidikan Islam Nomor 1843 Tahun 2021 tentang Petunjuk Teknis Penilaian Kinerja Guru Madrasah',
    skala: { 0: 'Belum terpenuhi', 1: 'Terpenuhi sebagian', 2: 'Terpenuhi seluruhnya' }
  };

  // Flatten ke format engine yang sama dengan window.INSTRUMEN (db.js).
  // ID memakai namespace asli RA-xxx sehingga tidak mungkin tertukar
  // dengan instrumen_id legacy (format role_komp_ind).
  // Field kompetensi & buktiUmum ditambahkan untuk tampilan "Bukti yang
  // dapat diamati" per komponen sesuai spesifikasi PKG RA.
  window.INSTRUMEN_RA = [];
  for (var c = 0; c < RAW.length; c++) {
    var comp = RAW[c];
    for (var i = 0; i < comp.items.length; i++) {
      window.INSTRUMEN_RA.push({
        role_code: 'GMP',
        role_label: 'Guru Madrasah (RA)',
        max_score: 2,
        kompetensi_no: comp.no,
        kompetensi_nama: comp.nama,
        kompetensi: comp.kompetensi,
        buktiUmum: comp.buktiUmum || null,
        indikator_no: i + 1,
        indikator: comp.items[i],
        id: comp.id + '-I' + String(i + 1).padStart(2, '0')
      });
    }
  }

  // Expose RAW untuk akses terstruktur (bukti per komponen, dll).
  window.PKG_RA_RAW = RAW;
})();
