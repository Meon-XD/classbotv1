const axios = require('axios');
const schedule = require('node-schedule');
const fs = require('fs')

// API Key untuk Clash of Clans
const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk3NDAxNWU5LTQzYzItNDk5Yi05ZmU3LTA1NWI2MzVlNDAwNSIsImlhdCI6MTczNTEwNjA5NSwic3ViIjoiZGV2ZWxvcGVyL2M5M2E3ZWYyLTA0ZDctMjIyYy1jYjgzLTJhOTE1MmVlODczNyIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjEwMy4xODUuMjU0LjQyIl0sInR5cGUiOiJjbGllbnQifV19.RoTHuKTa2PJ_C5vseFYRPuCxRPHW0A3HUeDheWE14daW82-tTCgYwtSzo4ddSzG7SvKt4x0VGKsuSx6W1EBn1g';
const BASE_URL = 'https://api.clashofclans.com/v1';

// ID clan yang ingin Anda monitor
const CLAN_TAG = '#2D9QUQQYU';  // Tag klan (misalnya: #8P2L2J9L)
const GROUP_ID = '120363360187536232@g.us';  // ID grup WhatsApp tempat mengirim update

// Fungsi untuk mengirim pesan ke grup WhatsApp
async function sendMessage(sock, chatId, message) {
    try {
        await sock.sendMessage(chatId, { text: message });
    } catch (error) {
        console.error(`❌ Gagal mengirim pesan ke ${chatId}:`, error);
    }
}

// Fungsi untuk mendapatkan data clan dari API CoC
async function getClanInfo() {
    try {
        const response = await axios.get(`${BASE_URL}/clans/${encodeURIComponent(CLAN_TAG)}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Gagal mendapatkan data klan:', error);
        return null;
    }
}

// Fungsi untuk mendapatkan data war status
async function getWarStatus() {
    try {
        const response = await axios.get(`${BASE_URL}/clans/${encodeURIComponent(CLAN_TAG)}/currentwar`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Gagal mendapatkan data perang:', error);
        return null;
    }
}

// Fungsi untuk mengirim update anggota klan baru dan keluar
async function checkClanMembers(sock, chatId) {
    try {
        const clanData = await getClanInfo();
        if (!clanData) return;

        const memberCount = clanData.members.length;
        const clanName = clanData.name;

        let message = `Update Anggota Klan: ${clanName}\nTotal Anggota: ${memberCount}\n`;

        // Cek anggota yang baru bergabung atau keluar
        const newMembers = clanData.members.filter(member => member.tag.startsWith('#')).map(member => member.name).join(', ');
        if (newMembers) {
            message += `Anggota Baru: ${newMembers}\n`;
        }

        const leftMembers = clanData.members.filter(member => member.left).map(member => member.name).join(', ');
        if (leftMembers) {
            message += `Anggota Keluar: ${leftMembers}\n`;
        }

        await sendMessage(sock, chatId, message);
    } catch (error) {
        console.error('❌ Gagal mengirim info anggota klan:', error);
    }
}

// Fungsi untuk mengirim update perang klan
async function sendWarUpdate(sock, chatId) {
    try {
        const warData = await getWarStatus();
        if (!warData) return;

        const state = warData.state;
        let message = `Update Perang Klan:\nStatus Perang: ${state}\n`;

        if (state === 'inWar') {
            const timeRemaining = warData.endTime - Date.now();
            const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

            message += `Waktu Tersisa: ${hoursRemaining} jam ${minutesRemaining} menit\n`;
        }

        await sendMessage(sock, chatId, message);
    } catch (error) {
        console.error('❌ Gagal mengirim update perang klan:', error);
    }
}

// Fungsi untuk menjalankan fitur update setiap 30 menit
function startCocUpdates(sock) {
    const chatId = GROUP_ID;

    // Jadwalkan pengiriman update anggota klan dan perang klan setiap 30 menit
    schedule.scheduleJob('*/30 * * * *', async () => {
        await checkClanMembers(sock, chatId);
        await sendWarUpdate(sock, chatId);
    });
}

// Ekspor fungsi yang akan digunakan di `bot.js`
module.exports = { startCocUpdates };

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})

