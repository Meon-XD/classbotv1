const schedule = require('node-schedule');
const { startCocUpdates } = require('./fitur/coc');
const { scheduleMessages } = require('./setting');
const { handleSticker } = require('./fitur/stiker');
const { sendGif, sendAudio } = require('./fitur/sendTmp');
const { getMenu } = require('./fitur/menu');
const fs = require('fs');
const chalk = require('chalk');

// Konfigurasi prefix
const prefix = ".";

// Fungsi untuk memulai bot
function startBot(sock) {
    const chatId = '120363162398476085@g.us'; // Ubah ke nomor atau grup tujuan
    console.log('⏰ Bot pengingat jadwal dimulai...');

    // Jadwalkan pengiriman pesan otomatis setiap Senin-Sabtu pukul 06:00 pagi
    schedule.scheduleJob('0 6 * * 1-6', async () => {
        try {
            const today = new Date().getDay(); // 1: Senin, 2: Selasa, dst.
            const message = scheduleMessages[today]; // Ambil pesan sesuai hari

            if (message) {
                await sendMessage(sock, chatId, message);
                console.log(`✅ Pesan terkirim ke ${chatId}: ${message}`);
            } else {
                console.log('⚠️ Tidak ada pesan untuk hari ini.');
            }
        } catch (error) {
            console.error('❌ Error saat mengirim pesan:', error);
        }
    });

    // Tangani pesan masuk
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const message of messages) {
            if (!message.message) continue; // Abaikan jika tidak ada pesan

            const sender = message.key.remoteJid;
            const textMessage = message.message.conversation || message.message.extendedTextMessage?.text;

            // Periksa apakah pesan diawali dengan prefix
            if (textMessage && textMessage.startsWith(prefix)) {
                const command = textMessage.slice(prefix.length).trim().split(' ')[0].toLowerCase();

                try {
                    switch (command) {
                        case 'menu':
                            const gifPath = './media/menu.mp4'; // Path ke file GIF
                            const audMenu = './media/menu.mp3'
                          const caption = getMenu(prefix)
                          await sendGif(sock, sender, gifPath, caption);
                            break;

                        case 'ping':
                            await sendMessage(sock, sender, 'Pong! Bot aktif.');
                            break;

                        case 'info':
                            await sendMessage(sock, sender, 'Bot ini dibuat untuk membantu mengatur jadwal dan fitur lainnya.');
                            break;

                        case 'help':
                            await sendMessage(sock, sender, `Ketik ${prefix}menu untuk melihat daftar fitur bot.`);
                            break;

                        case 'about':
                            await sendMessage(sock, sender, 'Dikembangkan Oleh Radit berfungsi sebagai bot pengingat jadwal.');
                            break;

                        case 'jadwal': {
                            const today = new Date().getDay(); // Ambil hari ini
                            const message = scheduleMessages[today]; // Jadwal hari ini
                            if (message) {
                                await sendMessage(sock, sender, `📅 *Jadwal Hari Ini*: ${message}`);
                            } else {
                                await sendMessage(sock, sender, '⚠️ Tidak ada jadwal untuk hari ini.');
                            }
                            break;
                        }

                        case 'alljadwal': {
                            const allJadwal = Object.entries(scheduleMessages)
                                .map(([index, msg]) => {
                                    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                                    return msg ? `📅 *${days[index]}*: ${msg}` : null;
                                })
                                .filter((msg) => msg !== null)
                                .join('\n');
                            await sendMessage(sock, sender, `=== *Jadwal Mingguan* ===\n${allJadwal}`);
                            break;
                        }

                        case 'forwardaudio': {
                            const audioTitle = textMessage.slice(prefix.length + 12).trim(); // Ambil nama audio setelah '.forwardaudio'
                            
                            if (!audioTitle) {
                                await sendMessage(sock, sender, '⚠️ Harap masukkan nama atau judul audio setelah perintah .forwardaudio.');
                                break;
                            }

                            // Memeriksa apakah pesan yang dibalas adalah pesan audio
                            const quotedMessage = message.message.extendedTextMessage?.contextInfo?.quotedMessage;
                            
                            if (quotedMessage?.audioMessage) {
                                const audioMessageKey = message.message.extendedTextMessage.contextInfo.stanzaId;  // ID pesan audio

                                // Menentukan caption atau nama audio
                                const caption = `🎵 *${audioTitle}* - Audio diteruskan ke saluran.`;

                                // ID saluran tujuan
                                const targetChannelId = '120363330386797391@newsletter';

                                try {
                                    // Pastikan tipe MIME audio valid (audio/mp4, audio/ogg, dsb.)
                                    const audioContent = quotedMessage.audioMessage;
                                    const mimeType = audioContent.mimetype || 'audio/mp4'; // Default ke 'audio/mp4' jika tidak ditemukan

                                    // Mengirimkan pesan suara/audio ke saluran
                                    await sock.sendMessage(targetChannelId, { 
                                        audioMessage: audioContent,  // Mengirim audio
                                        caption: caption, // Menambahkan caption atau judul
                                        mimetype: mimeType  // Pastikan tipe file audio sesuai
                                    });

                                    console.log(`✅ Audio diteruskan ke saluran ${targetChannelId} dengan judul: ${audioTitle}`);
                                    
                                    // Memberikan konfirmasi kepada pengguna
                                    await sendMessage(sock, sender, `✅ Audio dengan judul "${audioTitle}" berhasil diteruskan ke saluran.`);
                                } catch (error) {
                                    console.error(`❌ Gagal meneruskan audio ke saluran: ${error.message}`);
                                    await sendMessage(sock, sender, '❌ Gagal meneruskan audio. Pastikan pesan yang dibalas adalah audio.');
                                }
                            } else {
                                // Jika tidak ada audio dalam pesan yang dibalas, beri tahu pengguna untuk membalas pesan audio
                                await sendMessage(sock, sender, '⚠️ Harap balas pesan audio yang ingin diteruskan.');
                            }
                            break;
                        }

                        default:
                            await sendMessage(sock, sender, `Perintah tidak dikenal. Ketik ${prefix}menu untuk melihat daftar fitur.`);
                            break;
                    }
                } catch (commandError) {
                    console.error(`❌ Error saat mengeksekusi command ${command}:`, commandError);
                    await sendMessage(sock, sender, '❌ Terjadi kesalahan saat menjalankan perintah.');
                }
            }

            // Tangani fitur stiker jika ada gambar dengan caption ".stiker"
            if (message.message.imageMessage && textMessage?.startsWith(`${prefix}stiker`)) {
                try {
                    await handleSticker(sock, message);
                } catch (error) {
                    console.error('❌ Gagal membuat stiker:', error);
                    await sendMessage(sock, sender, '❌ Gagal membuat stiker.');
                }
            }
        }
    });
}

// Fungsi untuk mengirim pesan
async function sendMessage(sock, chatId, text) {
    try {
        await sock.sendMessage(chatId, { text }); // Kirim pesan teks
    } catch (error) {
        console.error(`❌ Gagal mengirim pesan ke ${chatId}:`, error);
    }
}

module.exports = { startBot };

// Hot reload untuk development
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);

    console.log(chalk.redBright(`Update '${__filename}'`));
    delete require.cache[file];
    require(file);
});

// Global Error Handler untuk menjaga agar bot tetap berjalan meski ada error
process.on('uncaughtException', (err) => {
    console.error(chalk.red('❌ Uncaught Exception:', err.message));
    console.error(err.stack);
    console.log('⚠️ Script tetap berjalan.');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('❌ Unhandled Rejection:', reason));
    console.log('⚠️ Script tetap berjalan.');
});
