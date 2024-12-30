const fs = require('fs');

// Fungsi untuk mengirim GIF
async function sendGif(sock, chatId, gifPath, caption = '') {
    try {
        const message = {
            video: fs.readFileSync(gifPath), // Membaca file GIF
            caption,
            gifPlayback: true,
        };
        await sock.sendMessage(chatId, message);
        console.log(`✅ GIF terkirim ke ${chatId} dengan caption: ${caption}`);
    } catch (error) {
        console.error(`❌ Gagal mengirim GIF ke ${chatId}:`, error);
    }
}

// Fungsi untuk mengirim audio
async function sendAudio(sock, chatId, audioPath) {
    try {
        const message = {
            audio: { url: audioPath }, // URL atau path audio
            mimetype: 'audio/mp4',
        };
        await sock.sendMessage(chatId, message);
        console.log(`✅ Audio terkirim ke ${chatId} dari file: ${audioPath}`);
    } catch (error) {
        console.error(`❌ Gagal mengirim audio ke ${chatId}:`, error);
    }
}

module.exports = { sendGif, sendAudio };
