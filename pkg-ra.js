// pkg-ra.js — Instrumen PKG RA (15 komponen / 79 indikator)
// Source: Kep. Dirjen Pendis No. 1843/2021 + Revisi 2026
// ID format: RA-XX-YY (komponen-indikator)
// Versi: 2026.2 — dengan catatanPenggalianData per indikator

(function(){
  'use strict';

  const META = {
    instrumentType: 'PKG_RA',
    instrumentVersion: '2026.2',
    jenjang: 'RA',
    nama: 'Instrumen Penilaian Kinerja Guru Raudhatul Athfal',
    dasarUtama: 'Keputusan Direktur Jenderal Pendidikan Islam Nomor 1843 Tahun 2021 tentang Petunjuk Teknis Penilaian Kinerja Guru Madrasah',
    catatanPenyelarasan: 'Struktur 15 komponen dan 79 indikator dipertahankan sebagai fondasi PKG RA; redaksi operasional diselaraskan dengan konteks pembelajaran RA dan terminologi kurikulum yang berlaku.',
    skala: { min: 0, max: 2, label: { 0: 'Belum terpenuhi', 1: 'Terpenuhi sebagian', 2: 'Terpenuhi seluruhnya' } },
    konversiKomponen: [
      { minExclusive: 0, maxInclusive: 25, nilai: 1 },
      { minExclusive: 25, maxInclusive: 50, nilai: 2 },
      { minExclusive: 50, maxInclusive: 75, nilai: 3 },
      { minExclusive: 75, maxInclusive: 100, nilai: 4 }
    ]
  };

  const RUBRIK = {
    0: 'Belum terpenuhi / tidak ditemukan bukti pelaksanaan.',
    1: 'Terpenuhi sebagian / belum konsisten atau bukti masih sebagian.',
    2: 'Terpenuhi seluruhnya secara konsisten dan didukung bukti yang memadai.'
  };

  const RAW = [
    // ===== A. PEDAGOGIK =====
    { no: 1, kompetensi: 'Pedagogik', nama: 'Mengorganisasikan aspek perkembangan sesuai dengan karakteristik perkembangan anak usia dini', indikator: [
      { id: 'RA-01-01', no: 1, teks: 'Guru mengidentifikasi karakteristik setiap anak berdasarkan tahap perkembangan, kebutuhan, minat, latar belakang sosial-budaya, serta kondisi individualnya.', catatanPenggalianData: 'Cek data profil/identitas anak, hasil asesmen awal, catatan anekdot, dan hasil observasi. Tanyakan kepada guru karakteristik apa yang membedakan tiap anak dan bagaimana informasi tersebut memengaruhi stimulasi atau kegiatan bermain yang diberikan.' },
      { id: 'RA-01-02', no: 2, teks: 'Guru mengidentifikasi kemampuan awal dan kebutuhan belajar/perkembangan anak sebagai dasar merancang stimulasi dan pengalaman bermain.', catatanPenggalianData: 'Cek hasil asesmen awal, catatan perkembangan, informasi dari orang tua, atau dokumentasi awal. Gali bagaimana guru menggunakan informasi tersebut untuk menentukan titik awal pembelajaran.' },
      { id: 'RA-01-03', no: 3, teks: 'Guru menata lingkungan belajar dan bermain yang aman, nyaman, inklusif, menarik, dan mendukung perkembangan anak secara holistik.', catatanPenggalianData: 'Amati area bermain di dalam dan luar ruang, akses APE, keamanan, keterjangkauan bahan, dan ruang gerak anak. Tanyakan alasan guru menata lingkungan tersebut dan kemampuan apa yang ingin distimulasi.' },
      { id: 'RA-01-04', no: 4, teks: 'Guru memastikan setiap anak memperoleh kesempatan yang setara untuk berpartisipasi aktif dalam kegiatan bermain dan pembelajaran.', catatanPenggalianData: 'Amati keterlibatan seluruh anak termasuk anak yang pemalu, membutuhkan dukungan, atau memiliki karakteristik berbeda. Gali strategi guru agar tidak ada anak yang terabaikan atau mendominasi.' },
      { id: 'RA-01-05', no: 5, teks: 'Guru memiliki catatan perkembangan dan capaian belajar anak yang diperoleh melalui asesmen autentik secara berkelanjutan.', catatanPenggalianData: 'Cek catatan anekdot, ceklis, hasil karya, dokumentasi, percakapan, atau bentuk asesmen autentik lain. Pastikan catatan menunjukkan perkembangan anak dari waktu ke waktu.' },
      { id: 'RA-01-06', no: 6, teks: 'Guru mengidentifikasi hambatan, kebutuhan dukungan, atau risiko keterlambatan perkembangan anak dan memberikan tindak lanjut yang sesuai dalam batas kewenangannya.', catatanPenggalianData: 'Cek catatan perkembangan, komunikasi dengan orang tua, dan tindak lanjut stimulasi. Tanyakan apa yang dilakukan guru jika menemukan anak yang memerlukan dukungan khusus dan kapan berkoordinasi dengan kepala RA, orang tua, atau pihak profesional.' }
    ]},
    { no: 2, kompetensi: 'Pedagogik', nama: 'Menganalisis teori bermain sesuai aspek dan tahapan perkembangan, potensi, bakat, dan minat anak usia dini', indikator: [
      { id: 'RA-02-01', no: 1, teks: 'Guru memilih pendekatan, metode, dan strategi belajar melalui bermain yang sesuai dengan tahap perkembangan, kebutuhan, minat, dan tujuan pembelajaran anak.', catatanPenggalianData: 'Cek perencanaan dan pelaksanaan pembelajaran. Tanyakan mengapa jenis permainan/strategi tersebut dipilih dan bagaimana kaitannya dengan TP serta karakteristik anak.' },
      { id: 'RA-02-02', no: 2, teks: 'Guru menerapkan kegiatan belajar melalui bermain yang memberi ruang eksplorasi, interaksi, pengalaman langsung, dan keterlibatan aktif anak.', catatanPenggalianData: 'Amati apakah anak benar-benar bermain, mencoba, bergerak, berinteraksi, dan membuat pilihan; bukan hanya mendengarkan guru atau mengerjakan lembar kerja.' },
      { id: 'RA-02-03', no: 3, teks: 'Guru merancang kegiatan bermain yang kreatif dengan memanfaatkan lingkungan, bahan, alat, dan situasi yang beragam.', catatanPenggalianData: 'Cek variasi kegiatan, bahan alam, APE, loose parts, dan lingkungan sekitar. Gali kemampuan guru memodifikasi kegiatan berdasarkan respons/minat anak.' },
      { id: 'RA-02-04', no: 4, teks: 'Guru merancang pengalaman belajar yang kontekstual dan bermakna dengan mengaitkan topik/kegiatan dengan kehidupan sehari-hari anak serta tujuan pembelajaran.', catatanPenggalianData: 'Jangan menggunakan Kompetensi Dasar sebagai acuan utama. Cek keterkaitan kegiatan dengan TP/ATP, pengalaman nyata anak, keluarga, dan lingkungan sekitar.' },
      { id: 'RA-02-05', no: 5, teks: 'Guru menggunakan variasi strategi bermain untuk menumbuhkan rasa ingin tahu, motivasi intrinsik, kreativitas, kemandirian, dan keberanian anak bereksplorasi.', catatanPenggalianData: 'Amati apakah guru memberi kesempatan anak bertanya, mencoba cara baru, memilih, memecahkan masalah sederhana, dan tidak takut salah.' }
    ]},
    { no: 3, kompetensi: 'Pedagogik', nama: 'Merancang kegiatan pengembangan anak usia dini berdasarkan kurikulum', indikator: [
      { id: 'RA-03-01', no: 1, teks: 'Guru merancang pembelajaran dengan mengacu pada Kurikulum Satuan Pendidikan RA, Capaian Pembelajaran RA/Fase Fondasi, regulasi kekhasan RA, kalender pendidikan, serta karakteristik satuan dan anak.', catatanPenggalianData: 'Cek KSP RA, pengorganisasian pembelajaran, CP/ATP, kalender pendidikan, dan perencanaan tingkat kelas. Jangan mensyaratkan format administrasi tertentu apabila substansi perencanaan telah terpenuhi.' },
      { id: 'RA-03-02', no: 2, teks: 'Guru merumuskan atau memilih Tujuan Pembelajaran dan Alur Tujuan Pembelajaran yang sesuai dengan Capaian Pembelajaran, tahapan perkembangan, kebutuhan anak, serta kekhasan RA.', catatanPenggalianData: 'Cek keterkaitan CP, TP, dan ATP. Untuk kekhasan RA, gali integrasi nilai Islam, CP PAI/Bahasa Arab RA, dan Panca Cinta secara wajar.' },
      { id: 'RA-03-03', no: 3, teks: 'Guru menyusun perencanaan pembelajaran yang sekurang-kurangnya memuat tujuan pembelajaran, rencana kegiatan bermain/pembelajaran, dan rencana asesmen.', catatanPenggalianData: 'Terima RPP, Modul Ajar, atau format perencanaan lain yang setara. Fokus pada TP, kegiatan pembelajaran, dan asesmen; bukan banyaknya lembar administrasi.' },
      { id: 'RA-03-04', no: 4, teks: 'Guru memilih topik/muatan, kegiatan, media/APE, sumber belajar, dan lingkungan belajar yang sesuai tujuan, usia, minat, konteks kehidupan anak, aman, inklusif, bermakna, menggembirakan, serta selaras dengan nilai Islam dan KBC.', catatanPenggalianData: 'Cek keselarasan TP, kegiatan, media, dan asesmen. Gali prinsip berkesadaran, bermakna, menggembirakan dan Panca Cinta tanpa memaksakan semuanya muncul secara artifisial dalam satu kegiatan.' }
    ]},
    { no: 4, kompetensi: 'Pedagogik', nama: 'Menyelenggarakan kegiatan bermain yang menyenangkan', indikator: [
      { id: 'RA-04-01', no: 1, teks: 'Guru melaksanakan pembelajaran melalui bermain yang selaras dengan tujuan pembelajaran dan mendukung pertumbuhan serta perkembangan anak secara holistik.', catatanPenggalianData: 'Amati apakah kegiatan benar-benar berorientasi pada pengalaman bermain dan perkembangan anak. Cocokkan dengan TP yang direncanakan.' },
      { id: 'RA-04-02', no: 2, teks: 'Guru menciptakan suasana belajar yang aman, nyaman, menghargai anak, menggembirakan, dan bebas dari tekanan atau praktik yang menakutkan.', catatanPenggalianData: 'Amati relasi guru-anak, nada bicara, respons terhadap kesalahan, serta keamanan emosional. Anak tidak boleh mengalami ancaman, bentakan, atau dipermalukan.' },
      { id: 'RA-04-03', no: 3, teks: 'Guru melaksanakan kegiatan yang kreatif dan bervariasi di dalam maupun di luar ruang sesuai kebutuhan, minat, dan kondisi anak.', catatanPenggalianData: 'Cek permainan peran, eksplorasi, seni, motorik, bahan alam, dan kegiatan luar ruang. Variasi bukan sekadar berganti lembar kerja.' },
      { id: 'RA-04-04', no: 4, teks: 'Guru mengaitkan pengalaman belajar dengan kehidupan sehari-hari anak sehingga pembelajaran menjadi bermakna.', catatanPenggalianData: 'Gali hubungan kegiatan dengan pengalaman anak, keluarga, lingkungan, budaya, atau peristiwa nyata di sekitarnya.' },
      { id: 'RA-04-05', no: 5, teks: 'Guru menumbuhkan kebiasaan baik, nilai agama dan budi pekerti, serta nilai Panca Cinta melalui keteladanan, pembiasaan, interaksi, dan pengalaman bermain sehari-hari.', catatanPenggalianData: 'Gali praktik cinta Allah dan Rasul-Nya, cinta ilmu, cinta lingkungan, cinta diri dan sesama manusia, serta cinta tanah air. Jangan cukup hanya menemukan tulisan Panca Cinta pada dokumen.' },
      { id: 'RA-04-06', no: 6, teks: 'Guru memberi kesempatan kepada anak untuk bertanya, mencoba, memilih, mengeksplorasi, mengemukakan gagasan/perasaan, berinteraksi, dan merefleksikan pengalaman secara sederhana.', catatanPenggalianData: 'Amati suara dan pilihan anak. Tanyakan apakah guru dapat mengubah kegiatan berdasarkan pertanyaan, kebutuhan, atau minat yang muncul dari anak.' },
      { id: 'RA-04-07', no: 7, teks: 'Guru memanfaatkan media, APE, bahan alam, lingkungan, dan sumber belajar yang aman serta sesuai untuk memperkaya pengalaman bermain dan mencapai tujuan pembelajaran.', catatanPenggalianData: 'Amati keamanan, kesesuaian usia, fungsi dan keragaman APE/media serta bagaimana anak menggunakannya.' }
    ]},
    { no: 5, kompetensi: 'Pedagogik', nama: 'Memanfaatkan teknologi, informasi dan komunikasi untuk kepentingan penyelenggaraan kegiatan pengembangan yang mendidik', indikator: [
      { id: 'RA-05-01', no: 1, teks: 'Guru memanfaatkan teknologi secara tepat untuk mendukung perencanaan pembelajaran, pengembangan sumber belajar, dan peningkatan kualitas layanan RA.', catatanPenggalianData: 'Cek penggunaan perangkat/aplikasi untuk perencanaan, pencarian referensi, pembuatan bahan, atau dokumentasi. Nilai manfaatnya, bukan kecanggihan perangkat.' },
      { id: 'RA-05-02', no: 2, teks: 'Guru memanfaatkan teknologi untuk membuat atau memilih media pembelajaran yang sesuai usia, tujuan, kebutuhan, dan karakteristik anak.', catatanPenggalianData: 'Cek media digital/audio-visual yang digunakan. Pastikan aman, sesuai usia, edukatif, dan relevan dengan TP.' },
      { id: 'RA-05-03', no: 3, teks: 'Guru menggunakan media audio-visual/digital secara proporsional, aman, sehat, dan tidak menggantikan pengalaman bermain langsung, interaksi sosial, gerak, serta eksplorasi nyata anak.', catatanPenggalianData: 'Amati durasi dan tujuan penggunaan layar. Pastikan teknologi hanyalah alat bantu dan bukan pusat seluruh kegiatan anak.' },
      { id: 'RA-05-04', no: 4, teks: 'Guru memanfaatkan teknologi untuk administrasi pembelajaran, dokumentasi perkembangan, komunikasi dengan orang tua, dan pengembangan profesional secara etis dan bertanggung jawab.', catatanPenggalianData: 'Cek dokumentasi/komunikasi digital dan perhatikan privasi foto, video, serta data anak dan etika membagikan informasi.' }
    ]},
    { no: 6, kompetensi: 'Pedagogik', nama: 'Mengembangkan potensi anak usia dini', indikator: [
      { id: 'RA-06-01', no: 1, teks: 'Guru memanfaatkan alam, lingkungan sekitar, dan sumber belajar yang beragam untuk mengembangkan potensi anak melalui pengalaman yang bermakna.', catatanPenggalianData: 'Amati penggunaan halaman, kebun, lingkungan sosial, benda sehari-hari, atau sumber lokal.' },
      { id: 'RA-06-02', no: 2, teks: 'Guru memilih media dan Alat Permainan Edukatif (APE) yang aman, sesuai usia, kebutuhan, minat, dan tujuan pembelajaran.', catatanPenggalianData: 'Periksa keamanan, kesesuaian perkembangan, fungsi, dan kesempatan anak menggunakan APE secara aktif.' },
      { id: 'RA-06-03', no: 3, teks: 'Guru membuat, memodifikasi, atau mengembangkan media/APE dari bahan yang aman dan relevan untuk memperkaya pengalaman bermain anak.', catatanPenggalianData: 'Cek media/APE hasil pengembangan. Tidak harus mahal atau berbasis TIK; nilai manfaat, kreativitas, keamanan, dan kesesuaiannya.' },
      { id: 'RA-06-04', no: 4, teks: 'Guru memberi kesempatan kepada anak untuk belajar melalui bermain sesuai minat, membuat pilihan, mengekspresikan diri, dan menunjukkan kemampuan dengan beragam cara.', catatanPenggalianData: 'Amati apakah anak dapat memilih bahan, cara, atau bentuk karya dan tidak selalu harus menghasilkan produk seragam.' },
      { id: 'RA-06-05', no: 5, teks: 'Guru mengidentifikasi minat, kekuatan, potensi, kebutuhan, dan hambatan belajar/perkembangan setiap anak serta memberikan dukungan yang sesuai.', catatanPenggalianData: 'Cek catatan perkembangan dan contoh penyesuaian stimulasi. Gali contoh anak yang memerlukan dukungan lebih atau tantangan lebih.' },
      { id: 'RA-06-06', no: 6, teks: 'Guru memberikan dukungan dan stimulasi yang beragam untuk mengembangkan kreativitas, kemandirian, komunikasi, kemampuan berpikir, fisik-motorik, sosial-emosional, seni, nilai agama dan budi pekerti secara terpadu.', catatanPenggalianData: 'Pastikan perkembangan tidak dipisahkan secara kaku, tetapi dibangun secara terpadu melalui pengalaman bermain.' }
    ]},
    { no: 7, kompetensi: 'Pedagogik', nama: 'Berkomunikasi secara efektif, empatik, dan santun', indikator: [
      { id: 'RA-07-01', no: 1, teks: 'Guru membangun komunikasi dengan suasana hangat, ceria, ekspresif, menghargai, dan membuat anak merasa aman untuk berinteraksi.', catatanPenggalianData: 'Amati kontak mata, ekspresi, posisi tubuh, nada bicara, dan kenyamanan anak berinteraksi dengan guru.' },
      { id: 'RA-07-02', no: 2, teks: 'Guru menggunakan beragam cara berkomunikasi seperti percakapan, cerita, lagu, tepuk, syair, permainan, gerak, visual, dan cara lain yang sesuai kebutuhan anak.', catatanPenggalianData: 'Amati efektivitas variasi komunikasi berdasarkan perhatian, kebutuhan, dan kemampuan bahasa anak.' },
      { id: 'RA-07-03', no: 3, teks: 'Guru menggunakan bahasa yang santun, positif, penuh kasih sayang, jelas, dan sesuai tingkat pemahaman anak.', catatanPenggalianData: 'Perhatikan pilihan kata, khususnya ketika mengoreksi perilaku. Jangan ada label negatif, ejekan, bentakan, atau mempermalukan anak.' },
      { id: 'RA-07-04', no: 4, teks: 'Guru memberi kesempatan anak bertanya dan merespons pertanyaan anak dengan antusias, tepat, serta sesuai tingkat perkembangan dan kemampuan bahasanya.', catatanPenggalianData: 'Amati apakah pertanyaan anak ditanggapi dan dikembangkan, bukan dihentikan.' },
      { id: 'RA-07-05', no: 5, teks: 'Guru mendengarkan cerita, jawaban, gagasan, dan perasaan anak dengan perhatian penuh serta memberi tanggapan yang membantu anak mengekspresikan diri.', catatanPenggalianData: 'Amati apakah anak diberi waktu berbicara dan guru tidak terlalu cepat memotong atau menghakimi.' },
      { id: 'RA-07-06', no: 6, teks: 'Guru memfasilitasi kegiatan bermain yang menumbuhkan kerja sama, kemampuan berkomunikasi, berbagi peran, dan penyelesaian konflik secara positif antaranak.', catatanPenggalianData: 'Amati bagaimana guru membantu anak bernegosiasi, menunggu giliran, berbagi, dan menyelesaikan konflik sederhana.' }
    ]},
    { no: 8, kompetensi: 'Pedagogik', nama: 'Menyelenggarakan dan membuat laporan hasil asesmen perkembangan anak', indikator: [
      { id: 'RA-08-01', no: 1, teks: 'Guru melaksanakan, mencatat, dan mengadministrasikan asesmen secara terencana dan berkelanjutan untuk memperoleh gambaran perkembangan serta capaian belajar anak.', catatanPenggalianData: 'Cek catatan asesmen sepanjang periode. Data harus digunakan untuk memahami perkembangan anak dan bukan sekadar memenuhi administrasi.' },
      { id: 'RA-08-02', no: 2, teks: 'Guru melaksanakan asesmen secara alami dalam konteks bermain dan kegiatan sehari-hari sehingga anak tidak merasa sedang diuji atau tertekan.', catatanPenggalianData: 'Amati asesmen ketika anak bermain. Hindari menjadikan tes akademik formal sebagai cara utama asesmen RA.' },
      { id: 'RA-08-03', no: 3, teks: 'Guru menggunakan beragam teknik asesmen autentik yang sesuai, seperti observasi, catatan anekdot, ceklis, hasil karya, unjuk kerja, percakapan, atau dokumentasi lain yang relevan.', catatanPenggalianData: 'Nilai relevansi dan kualitas bukti, bukan banyaknya format asesmen yang dibuat guru.' },
      { id: 'RA-08-04', no: 4, teks: 'Guru menentukan bukti atau kriteria ketercapaian tujuan pembelajaran yang dapat diamati dan sesuai dengan tahap perkembangan anak.', catatanPenggalianData: 'Cek kaitan antara TP dengan bukti yang diamati. Bukti dapat berupa perilaku, ucapan, proses, interaksi, atau karya dan tidak harus angka.' },
      { id: 'RA-08-05', no: 5, teks: 'Guru melakukan asesmen autentik berdasarkan perilaku, proses, interaksi, pengalaman, dan/atau hasil karya anak dalam situasi nyata.', catatanPenggalianData: 'Pastikan kesimpulan asesmen mempunyai bukti nyata dan tidak didasarkan hanya pada satu produk atau satu kejadian.' },
      { id: 'RA-08-06', no: 6, teks: 'Guru menganalisis hasil asesmen untuk mengenali kemajuan, kekuatan, minat, kebutuhan, dan area yang masih perlu distimulasi pada setiap anak.', catatanPenggalianData: 'Gunakan bahasa perkembangan yang positif. Jangan memberi label negatif kepada anak.' },
      { id: 'RA-08-07', no: 7, teks: 'Guru menindaklanjuti hasil asesmen melalui penyesuaian kegiatan, stimulasi, dukungan, atau tantangan yang sesuai kebutuhan anak; bukan melalui remedial/pengayaan ala jenjang sekolah dasar.', catatanPenggalianData: 'Gali contoh tindak lanjut. Anak yang belum menunjukkan kemampuan diberi pengalaman/stimulasi lain, sedangkan anak yang siap dapat diberi tantangan lebih sesuai perkembangannya.' },
      { id: 'RA-08-08', no: 8, teks: 'Guru menggunakan hasil asesmen untuk memperbaiki perencanaan dan pelaksanaan pembelajaran berikutnya.', catatanPenggalianData: 'Tanyakan satu contoh perubahan kegiatan atau rencana yang dilakukan guru setelah melihat hasil asesmen anak.' },
      { id: 'RA-08-09', no: 9, teks: 'Guru mengomunikasikan perkembangan dan capaian belajar anak kepada orang tua/wali secara objektif, positif, mudah dipahami, berorientasi perkembangan, dan menjaga kerahasiaan data anak.', catatanPenggalianData: 'Cek laporan perkembangan/hasil belajar, portofolio, atau komunikasi dengan orang tua. Pastikan tidak memberi stigma dan melibatkan orang tua dalam tindak lanjut.' }
    ]},
    // ===== B. KEPRIBADIAN =====
    { no: 9, kompetensi: 'Kepribadian', nama: 'Bertindak sesuai norma agama, hukum, sosial, dan kebudayaan nasional Indonesia', indikator: [
      { id: 'RA-09-01', no: 1, teks: 'Guru memberikan perhatian, kesempatan, dan perlakuan yang adil kepada setiap anak tanpa membedakan jenis kelamin, kondisi sosial, asal daerah, kemampuan, kebutuhan, atau latar belakang lainnya.', catatanPenggalianData: 'Amati interaksi guru dan pembagian kesempatan kepada seluruh anak.' },
      { id: 'RA-09-02', no: 2, teks: 'Guru tidak bersikap diskriminatif terhadap anak, rekan sejawat, orang tua/wali, maupun masyarakat karena perbedaan agama, suku, budaya, jenis kelamin, kondisi keluarga, sosial-ekonomi, kemampuan, atau perbedaan lainnya.', catatanPenggalianData: 'Gunakan observasi dan wawancara singkat jika diperlukan. Nilai pola perilaku, bukan satu kejadian tanpa konteks.' },
      { id: 'RA-09-03', no: 3, teks: 'Guru membiasakan anak menghargai perbedaan, hidup rukun, saling menolong, dan memperlakukan orang lain dengan baik.', catatanPenggalianData: 'Amati pembiasaan dan respons guru saat muncul perbedaan atau konflik antaranak.' },
      { id: 'RA-09-04', no: 4, teks: 'Guru menaati ajaran agama, aturan satuan pendidikan, norma sosial, hukum, serta menunjukkan perilaku yang sesuai dengan tanggung jawab profesinya.', catatanPenggalianData: 'Gunakan observasi, catatan pembinaan, dan wawancara bila diperlukan.' },
      { id: 'RA-09-05', no: 5, teks: 'Guru menumbuhkan cinta tanah air, kebersamaan, persatuan, dan penghargaan terhadap kebinekaan melalui kegiatan yang sesuai perkembangan anak.', catatanPenggalianData: 'Gali pengalaman konkret seperti cerita, lagu, permainan, budaya, kegiatan kebangsaan, dan lingkungan sekitar; bukan konsep nasionalisme yang terlalu abstrak.' }
    ]},
    { no: 10, kompetensi: 'Kepribadian', nama: 'Menampilkan diri sebagai pribadi yang jujur, berakhlakul karimah, dan teladan bagi anak usia dini dan masyarakat', indikator: [
      { id: 'RA-10-01', no: 1, teks: 'Guru menunjukkan ketaatan beragama dan akhlak mulia yang tercermin secara konsisten dalam pelaksanaan tugas serta interaksi sehari-hari.', catatanPenggalianData: 'Utamakan konsistensi sikap dan keteladanan sehari-hari; jangan hanya melihat foto kegiatan keagamaan.' },
      { id: 'RA-10-02', no: 2, teks: 'Guru menunjukkan kejujuran, integritas, dan kesesuaian antara perkataan, keputusan, dan perbuatannya.', catatanPenggalianData: 'Gali melalui observasi dan konfirmasi kepada kepala RA/rekan apabila diperlukan.' },
      { id: 'RA-10-03', no: 3, teks: 'Guru berpenampilan, bertutur kata, dan bertindak sopan serta menghormati anak, orang tua/wali, rekan sejawat, dan masyarakat.', catatanPenggalianData: 'Perhatikan terutama cara guru menghadapi keluhan atau perilaku anak yang menantang.' },
      { id: 'RA-10-04', no: 4, teks: 'Guru menjadi teladan yang baik dan turut menjaga kepercayaan masyarakat serta nama baik RA melalui perilaku profesional.', catatanPenggalianData: 'Nilai perilaku yang terkait dengan tugas profesional. Jangan menilai kehidupan pribadi yang tidak berkaitan dengan profesi.' },
      { id: 'RA-10-05', no: 5, teks: 'Guru menunjukkan kedewasaan, kestabilan emosi, dan keterbukaan terhadap masukan untuk memperbaiki diri serta kualitas layanan pembelajaran.', catatanPenggalianData: 'Tanyakan contoh masukan yang pernah diterima dan perubahan yang dilakukan setelah menerima masukan tersebut.' }
    ]},
    { no: 11, kompetensi: 'Kepribadian', nama: 'Menunjukkan etos kerja, tanggung jawab yang tinggi, rasa percaya diri, dan bangga menjadi guru', indikator: [
      { id: 'RA-11-01', no: 1, teks: 'Guru hadir tepat waktu, melaksanakan tugas sesuai jadwal, dan menyelesaikan tanggung jawab secara konsisten.', catatanPenggalianData: 'Cek daftar hadir dan pola kedisiplinan selama periode penilaian.' },
      { id: 'RA-11-02', no: 2, teks: 'Jika berhalangan, guru memastikan keberlanjutan layanan anak melalui koordinasi dengan kepala RA/guru pengganti serta menyampaikan informasi kegiatan yang diperlukan.', catatanPenggalianData: 'Cek prosedur izin dan contoh koordinasi guru ketika berhalangan. Prioritasnya keselamatan dan keberlanjutan layanan anak.' },
      { id: 'RA-11-03', no: 3, teks: 'Guru memenuhi beban kerja dan tugas pembelajaran sesuai penugasan serta melaksanakan kegiatan lain berdasarkan aturan dan persetujuan yang berlaku.', catatanPenggalianData: 'Cek SK pembagian tugas dan jadwal layanan. Jangan memperlakukan beban guru RA persis seperti guru mata pelajaran MI/MTs/MA.' },
      { id: 'RA-11-04', no: 4, teks: 'Guru mengikuti prosedur izin secara tertib dan bertanggung jawab apabila tidak dapat melaksanakan tugas atau kegiatan RA.', catatanPenggalianData: 'Cek bukti izin jika ada dan konsistensi dengan aturan lembaga.' },
      { id: 'RA-11-05', no: 5, teks: 'Guru memanfaatkan kesempatan untuk pengembangan kompetensi dan kegiatan produktif yang berdampak pada peningkatan kualitas layanan anak.', catatanPenggalianData: 'Cek pelatihan, komunitas belajar, kegiatan berbagi, belajar mandiri, atau aktivitas relevan serta penerapannya.' },
      { id: 'RA-11-06', no: 6, teks: 'Guru memberikan kontribusi nyata terhadap pengembangan RA dan/atau memiliki karya, praktik baik, prestasi, atau peran yang berdampak positif bagi satuan.', catatanPenggalianData: 'Prestasi formal bukan syarat tunggal. Program/karya atau kontribusi nyata bagi RA juga merupakan bukti.' },
      { id: 'RA-11-07', no: 7, teks: 'Guru menunjukkan kebanggaan terhadap profesinya dan berperilaku sesuai kode etik guru serta nilai-nilai profesional.', catatanPenggalianData: 'Keaktifan IGRA/organisasi profesi dapat menjadi bukti tambahan tetapi bukan satu-satunya syarat.' }
    ]},
    // ===== C. PROFESIONAL =====
    { no: 12, kompetensi: 'Profesional', nama: 'Mengembangkan materi, struktur, dan konsep bidang keilmuan yang mendukung serta sejalan dengan kebutuhan dan tahapan perkembangan anak usia dini', indikator: [
      { id: 'RA-12-01', no: 1, teks: 'Guru memahami dan mampu memetakan Capaian Pembelajaran RA, termasuk CP Fase Fondasi serta kekhasan CP PAI dan Bahasa Arab RA, ke dalam tujuan dan pengalaman belajar yang sesuai tahap perkembangan anak.', catatanPenggalianData: 'Cek CP, TP/ATP, dan perencanaan. Guru harus memahami bahwa RA membangun kemampuan fondasi melalui bermain bermakna, bukan pembelajaran mata pelajaran formal seperti jenjang lebih tinggi.' },
      { id: 'RA-12-02', no: 2, teks: 'Guru mengembangkan muatan dan pengalaman belajar secara terpadu yang mendukung nilai agama dan budi pekerti, jati diri, dasar-dasar literasi, matematika, sains, teknologi, rekayasa, seni, serta kekhasan keislaman RA sesuai perkembangan anak.', catatanPenggalianData: 'Cek bagaimana berbagai kemampuan dibangun secara terpadu melalui kegiatan bermain, bukan diajarkan secara terfragmentasi seperti mata pelajaran.' },
      { id: 'RA-12-03', no: 3, teks: 'Guru merancang kegiatan belajar melalui bermain yang mengintegrasikan berbagai kemampuan fondasi, kebutuhan perkembangan, minat anak, nilai-nilai Islam, dan konteks kehidupannya.', catatanPenggalianData: 'Amati kegiatan dan telusuri berbagai kemampuan yang berkembang secara terpadu. Hindari dominasi lembar kerja atau pembelajaran akademik formal.' }
    ]},
    { no: 13, kompetensi: 'Profesional', nama: 'Mengembangkan profesionalitas secara berkelanjutan dengan melakukan tindakan reflektif', indikator: [
      { id: 'RA-13-01', no: 1, teks: 'Guru melakukan refleksi/evaluasi diri terhadap kualitas kinerja dan pembelajarannya berdasarkan bukti yang relevan.', catatanPenggalianData: 'Cek refleksi tertulis/digital, hasil supervisi, catatan pembelajaran, atau bentuk refleksi lainnya.' },
      { id: 'RA-13-02', no: 2, teks: 'Guru menggunakan hasil refleksi/evaluasi diri untuk memperbaiki perencanaan dan pelaksanaan pembelajaran serta merencanakan pengembangan kompetensi.', catatanPenggalianData: 'Cek hubungan antara refleksi, RTL, pengembangan kompetensi, dan perubahan praktik.' },
      { id: 'RA-13-03', no: 3, teks: 'Guru aktif mengikuti pengembangan kompetensi melalui komunitas belajar/profesi, pelatihan, seminar, lokakarya, webinar, kajian, penelitian, atau kegiatan relevan lainnya.', catatanPenggalianData: 'Tidak semua PKB harus berupa sertifikat pelatihan formal. Komunitas belajar dan kegiatan pengembangan yang relevan juga dapat menjadi bukti.' },
      { id: 'RA-13-04', no: 4, teks: 'Guru menerapkan hasil pengembangan kompetensi untuk meningkatkan kualitas pembelajaran, layanan perkembangan anak, dan/atau pengelolaan kelas.', catatanPenggalianData: 'Gali contoh konkret perubahan praktik setelah guru mengikuti kegiatan pengembangan kompetensi.' },
      { id: 'RA-13-05', no: 5, teks: 'Guru melakukan refleksi mendalam atau kajian perbaikan praktik untuk memecahkan masalah pembelajaran dan meningkatkan kualitas layanan; dapat berupa praktik reflektif, penelitian tindakan, praktik baik, atau bentuk kajian lain yang relevan.', catatanPenggalianData: 'Jangan mewajibkan laporan PTK. Terima catatan refleksi sistematis, praktik baik, studi kasus sederhana, penelitian tindakan, atau bentuk perbaikan praktik lainnya.' }
    ]},
    // ===== D. SOSIAL =====
    { no: 14, kompetensi: 'Sosial', nama: 'Berkomunikasi secara efektif, empatik, dan santun dengan sesama pendidik, tenaga kependidikan, orang tua, dan masyarakat', indikator: [
      { id: 'RA-14-01', no: 1, teks: 'Guru bekerja sama dan menjaga hubungan profesional yang positif dengan kepala RA, rekan sejawat, tenaga kependidikan, orang tua/wali, dan masyarakat untuk mendukung perkembangan anak serta kemajuan RA.', catatanPenggalianData: 'Gali melalui wawancara dan bukti kolaborasi. Fokus pada kualitas kerja sama dan dampaknya bagi anak/RA.' },
      { id: 'RA-14-02', no: 2, teks: 'Guru aktif dalam komunitas profesi dan/atau komunitas belajar serta berkontribusi dalam berbagi pengalaman dan pengembangan mutu RA.', catatanPenggalianData: 'Keaktifan IGRA dapat digunakan, tetapi komunitas belajar internal atau forum profesi lain juga dapat menjadi bukti.' },
      { id: 'RA-14-03', no: 3, teks: 'Guru membangun kemitraan dengan orang tua/wali dan pihak terkait untuk mendukung pembelajaran, perkembangan, kesejahteraan, dan penanganan kebutuhan anak.', catatanPenggalianData: 'Cek kegiatan parenting, komunikasi individu, kesepakatan tindak lanjut, atau kolaborasi dengan pihak lain.' },
      { id: 'RA-14-04', no: 4, teks: 'Guru memanfaatkan berbagai media komunikasi termasuk teknologi secara efektif, santun, aman, dan etis untuk kepentingan anak dan RA.', catatanPenggalianData: 'Periksa penggunaan grup komunikasi/aplikasi serta keamanan dan privasi foto, video, dan data anak.' }
    ]},
    { no: 15, kompetensi: 'Sosial', nama: 'Beradaptasi dalam keanekaragaman sosial budaya bangsa Indonesia dengan tetap menjunjung tinggi nilai Islami', indikator: [
      { id: 'RA-15-01', no: 1, teks: 'Guru mampu menyesuaikan diri dengan kondisi sosial, budaya, bahasa, dan karakteristik masyarakat tempat bertugas untuk membangun komunikasi dan pembelajaran yang efektif.', catatanPenggalianData: 'Gali pemahaman guru tentang kebiasaan, bahasa, karakter keluarga, dan konteks lokal serta bagaimana hal itu digunakan dalam pembelajaran.' },
      { id: 'RA-15-02', no: 2, teks: 'Guru menghargai budaya lokal dan memanfaatkannya secara tepat sebagai sumber belajar, bahan bermain, cerita, seni, bahasa, atau pengalaman kontekstual di RA.', catatanPenggalianData: 'Cek contoh budaya lokal yang digunakan. Pastikan sesuai usia, bebas stereotip, aman, dan membantu anak menghargai lingkungannya.' },
      { id: 'RA-15-03', no: 3, teks: 'Guru memanfaatkan keberagaman sosial budaya Indonesia melalui permainan, seni, cerita, tradisi, bahasa, dan pengalaman belajar lain untuk menumbuhkan sikap menghargai keberagaman, cinta sesama, dan cinta tanah air sesuai nilai Islami dan Panca Cinta.', catatanPenggalianData: 'Cek kegiatan konkret. Jangan hanya menilai acara seremonial; lihat bagaimana pengalaman sehari-hari menumbuhkan penghargaan terhadap keragaman.' }
    ]}
  ];

  // Flatten
  const INSTRUMEN = [];
  RAW.forEach(komp => {
    komp.indikator.forEach(ind => {
      INSTRUMEN.push({
        id: ind.id,
        role_code: 'GMP',
        role_label: 'Guru Madrasah (RA)',
        kompetensi: komp.kompetensi,
        kompetensi_no: komp.no,
        kompetensi_nama: komp.nama,
        indikator_no: ind.no,
        indikator: ind.teks,
        catatanPenggalianData: ind.catatanPenggalianData,
        max_score: 2,
        skorMax: 2,
        rubrik: RUBRIK
      });
    });
  });

  // Validation
  if (RAW.length !== 15 || INSTRUMEN.length !== 79) {
    console.error('Struktur Instrumen PKG RA tidak lengkap: ' + RAW.length + ' komponen, ' + INSTRUMEN.length + ' indikator');
  }

  window.PKG_RA_META = META;
  window.INSTRUMEN_RA = INSTRUMEN;
  window.PKG_RA_RAW = RAW;
})();
