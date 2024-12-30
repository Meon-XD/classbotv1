const { makeWASocket, DisconnectReason, useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { unlinkSync } = require('fs');
const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');
const { startBot } = require('./bot'); // Impor fungsi dari bot.js

const usePairingCode = true; // Jika true, gunakan kode pairing

// Fungsi untuk membaca input dari terminal
const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(text, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./ses');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: 'fatal' }),
        browser: Browsers.ubuntu("Chrome"),
        syncFullHistory: false,
        markOnlineOnConnect: true,
    });

    // Jika menggunakan pairing code
    if (usePairingCode && !state.creds.registered) {
        const phoneNumber = await question(
            chalk.greenBright('Masukkan nomor WhatsApp Anda (contoh: 628xxx): ')
        );
        const code = await sock.requestPairingCode(phoneNumber.trim());
        console.log(chalk.yellowBright(`Kode pairing Anda adalah: ${code}`));
    }

    // Menyimpan sesi setiap ada perubahan
    sock.ev.on('creds.update', saveCreds);

    // Event untuk update koneksi
    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            console.log('Scan QR ini dengan WhatsApp Anda:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (update.lastDisconnect.error)?.output?.statusCode !== 401;
            console.log('Koneksi terputus. Apakah mencoba untuk reconnect?', shouldReconnect);

            if (!shouldReconnect) {
                unlinkSync('./bots'); // Hapus file sesi jika gagal autentikasi
                console.log('Sesi dihapus. Harap scan ulang QR Code.');
            }

            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Terhubung ke WhatsApp!');
            startBot(sock); // Mulai bot setelah terhubung
        }
    });

    // Event untuk menangani pesan yang diterima
    sock.ev.on('messages.upsert', ({ messages }) => {
        for (const message of messages) {
            const isGroup = message.key.remoteJid.endsWith('@g.us'); // Cek apakah pesan berasal dari grup
            const senderId = message.key.participant || message.key.remoteJid; // ID pengirim
            const chatId = message.key.remoteJid; // ID grup atau ID personal chat
            const text = message.message?.conversation || message.message?.extendedTextMessage?.text || ''; // Pesan teks
            const timestamp = message.messageTimestamp * 1000; // Waktu pesan (dalam milidetik)
            const date = new Date(timestamp);
            const formattedTime = date.toLocaleString(); // Format waktu

            // Mendeteksi jenis pesan
            let messageType = '';
            if (message.message?.imageMessage) messageType = 'Image';
            else if (message.message?.videoMessage) messageType = 'Video';
            else if (message.message?.audioMessage) messageType = 'Audio';
            else if (message.message?.documentMessage) messageType = 'Document';
            else if (message.message?.stickerMessage) messageType = 'Sticker';
            else if (message.message?.extendedTextMessage) messageType = 'Text';
            else if (message.message?.conversation) messageType = 'Text';
            else messageType = 'Unknown';

            // Menampilkan informasi pesan
            if (isGroup) {
                const groupName = message.message?.senderName || '* ❏═┅═━━━┅ Pesan Masuk * ❏═┅═━━━┅\n┊☃Nama Grup Tidak Ditemukan';
                console.log(chalk.blue(`┊☃Pesan dari grup ${groupName} (${chatId})`));
                console.log(chalk.greenBright(`┊☃Pengirim: ${senderId}`));
            } else {
                console.log(chalk.magenta(`┊☃Pesan pribadi`));
                console.log(chalk.greenBright(`┊☃Pengirim: ${senderId}`));
            }
            console.log(chalk.cyan(`┊☃Jenis Pesan: ${messageType}`));
            console.log(chalk.yellow(`┊☃Waktu: ${formattedTime}\n❏═┅═━━━┅`));

            // Menampilkan jenis pesan
            if (text) {
                console.log(chalk.green(`┊☃Teks: ${text}\n* ❏═┅═━━━┅\n`));
            }
        }
    });
}

// Memulai koneksi
connectToWhatsApp();

//   AUTO RELOAD PERUBAHAN FILE
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update'${__filename}'`))
    delete require.cache[file]
    require(file)
})
