
```markdown
# WhatsApp Bot by Mr.RDT

Bot WhatsApp ini dikembangkan oleh Mr.RDT untuk membantu dalam pengelolaan jadwal, pengiriman media, serta berbagai fitur interaktif lainnya melalui WhatsApp.

## Deskripsi
Bot ini memungkinkan Anda untuk mengatur pengingat jadwal, mengirim media seperti GIF, audio, dan gambar secara otomatis, serta merespons berbagai perintah yang dimulai dengan prefix tertentu. Bot ini dapat dijalankan di Termux, panel hosting, atau server lainnya.

## Fitur
- Pengingat jadwal otomatis berdasarkan hari dalam seminggu.
- Mengirim pesan teks dan media seperti gambar, GIF, audio, dan stiker.
- Menggunakan perintah dengan prefix tertentu seperti `.menu`, `.ping`, `.jadwal`, dan lainnya.
- Mengirimkan menu dan informasi terkait fitur bot.
- Mendukung fitur pembuatan stiker dari gambar.
- Pengiriman pesan otomatis berdasarkan jadwal yang telah disusun.
- Update terbaru akan kami infokan di saluran whatsapp kami

## Setup Bot di Termux

1. **Install Dependencies**
   Pastikan Anda sudah menginstall **Node.js** dan **npm** di Termux.
   ```bash
   pkg update
   pkg upgrade
   pkg install nodejs
   pkg install git
   ```

2. **Clone Repository**
   Clone repository ini ke Termux.
   ```bash
   git clone https://github.com/Meon-XD/classbotv1
   cd classbotv1
   ```

3. **Install NPM Dependencies**
   Install semua dependensi yang diperlukan untuk menjalankan bot.
   ```bash
   npm install
   ```

4. **Jalankan Bot**
   Setelah selesai menginstall, jalankan bot dengan perintah berikut:
   ```bash
   node index.js
   ```

   Jika Anda menggunakan `termux`, pastikan bot tetap berjalan dengan `screen` atau `tmux`.

## Setup Bot di Panel

1. **Pilih Panel Hosting**
   Pilih panel hosting seperti **Heroku**, **Glitch**, atau **Vercel** yang mendukung Node.js.

2. **Deploy ke Heroku**
   - **Login ke Heroku** menggunakan akun Heroku Anda.
   - Buat aplikasi baru.
   - Deploy bot menggunakan git:
     ```bash
     git remote add heroku https://git.heroku.com/your-app-name.git
     git push heroku master
     ```

3. **Konfigurasi Environment Variables**
   Pada panel hosting, pastikan Anda menambahkan variabel lingkungan yang diperlukan seperti:
   - `WHATSAPP_PHONE_NUMBER` – Nomor WhatsApp yang digunakan oleh bot.
   - `SESSION_FILE_PATH` – Lokasi penyimpanan sesi autentikasi.

## Setup Bot di Hosting Lainnya

Jika Anda ingin menjalankan bot di server pribadi atau VPS, pastikan Anda mengikuti langkah-langkah berikut:

1. **Install Node.js dan NPM** sesuai dengan sistem operasi yang digunakan.
2. **Clone dan install dependencies** seperti pada langkah di Termux.
3. **Jalankan bot di background** menggunakan `pm2` atau alat manajemen proses lainnya agar bot tetap berjalan setelah server reboot.

## Cara Penyambungan ke WhatsApp

1. **Pendaftaran dengan Kode Pairing**
   - Bot akan meminta Anda untuk memasukkan nomor WhatsApp Anda.
   - Setelah itu, bot akan mengirimkan kode pairing yang harus dipindai menggunakan aplikasi WhatsApp di ponsel Anda.
   
2. **Menjalankan Bot**
   - Setelah QR code dipindai, bot akan terhubung dengan akun WhatsApp dan siap untuk digunakan.
   
   Pastikan bot tetap terhubung selama bot berjalan agar dapat merespons pesan yang masuk.

## Kode File

File utama bot terdapat pada `index.js`, dengan berbagai modul terpisah di dalam folder `fitur/` dan `setting/`. Beberapa file lainnya adalah:
- `fitur/coc.js` – Fitur terkait update Clash of Clans.
- `fitur/menu.js` – Menampilkan menu dan informasi bot.
- `fitur/stiker.js` – Menangani pembuatan stiker dari gambar.
- `fitur/sendTmp.js` – Mengirim GIF dan audio.
- `setting.js` – Menyimpan pengaturan dan jadwal pengiriman pesan.

## Penjelasan Fitur

### 1. **Jadwal Pengingat**
Bot dapat mengirimkan pesan otomatis berdasarkan jadwal yang telah Anda tentukan. Pesan akan dikirim setiap hari pada waktu yang telah diatur.

### 2. **Perintah Bot**
- **.menu** – Menampilkan menu fitur bot.
- **.ping** – Mengirimkan pesan balasan "Pong!" sebagai tanda bot aktif.
- **.info** – Memberikan informasi tentang bot.
- **.jadwal** – Menampilkan jadwal pengingat untuk hari ini.
- **.alljadwal** – Menampilkan jadwal mingguan.

### 3. **Media**
Bot dapat mengirim berbagai jenis media:
- **GIF** – Dikirim menggunakan perintah `.sendgif`.
- **Audio** – Dikirim menggunakan perintah `.sendaudio`.
- **Stiker** – Membuat stiker dari gambar dengan perintah `.stiker`.

### 4. **Reaksi**
Bot dapat memberikan reaksi pada pesan menggunakan emotikon.

## Link Script Ini

- [GitHub Repository](https://github.com/Meon-XD/classbotv1)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Copyright

Copyright © 2024 Mr.RDT. All rights reserved.

## Contact Me

---

Terima kasih telah menggunakan bot WhatsApp ini. Kami harap bot ini membantu Anda dalam mengelola jadwal dan berinteraksi dengan WhatsApp secara lebih otomatis dan efisien.
```

---

### Penjelasan Struktur:

- **Nama dan Deskripsi Bot**: Penjelasan singkat tentang tujuan bot dan siapa pembuatnya.
- **Setup Bot di Termux**: Panduan instalasi untuk Termux.
- **Setup Bot di Panel Hosting**: Langkah-langkah untuk meng-host bot di panel seperti Heroku.
- **Setup Bot di Hosting Lainnya**: Panduan untuk meng-host di VPS atau server pribadi.
- **Penyambungan ke WhatsApp**: Cara menghubungkan bot ke WhatsApp melalui QR code.
- **Kode File**: Menjelaskan struktur file dan beberapa file penting di dalam bot.
- **Penjelasan Fitur**: Rincian tentang fitur-fitur utama bot.
- **Link Script Ini**: Link ke repositori GitHub tempat script ini di-host.
- **License dan Copyright**: Informasi lisensi dan hak cipta untuk proyek ini.

Silakan mengganti placeholder seperti `username/repository-name` dengan informasi yang sesuai dengan repositori GitHub Anda.
