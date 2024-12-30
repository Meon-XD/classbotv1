const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * Fungsi untuk membuat stiker dari pesan gambar
 * @param {object} sock - Objek soket Baileys
 * @param {object} message - Pesan yang diterima
 */
async function handleSticker(sock, message) {
    const chatId = message.key.remoteJid;
    const caption = message.message?.imageMessage?.caption || '';
    const isStickerCommand = caption === '.stiker';

    // Abaikan jika bukan perintah ".stiker"
    if (!isStickerCommand) return;

    try {
        // Mengunduh media menggunakan fungsi yang benar
        const media = await sock.downloadMediaMessage(message);
        const inputPath = path.join(__dirname, '../temp', `input-${Date.now()}.jpg`);
        const outputPath = path.join(__dirname, '../temp', `output-${Date.now()}.webp`);

        // Simpan file sementara
        fs.writeFileSync(inputPath, media);

        // Konversi gambar menjadi stiker menggunakan ffmpeg
        exec(`ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -q:v 90 ${outputPath}`, async (err) => {
            if (err) {
                console.error('❌ Gagal membuat stiker:', err);
                await sock.sendMessage(chatId, { text: '❌ Gagal membuat stiker.' }, { quoted: message });
            } else {
                const stickerBuffer = fs.readFileSync(outputPath);
                await sock.sendMessage(chatId, { sticker: stickerBuffer }, { quoted: message });

                // Hapus file sementara
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            }
        });
    } catch (error) {
        console.error('❌ Error saat memproses stiker:', error);
        await sock.sendMessage(chatId, { text: '❌ Terjadi kesalahan saat membuat stiker.' }, { quoted: message });
    }
}

module.exports = { handleSticker };

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
