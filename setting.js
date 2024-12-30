const fs = require('fs');
const chalk = require('chalk')

const scheduleMessages = {
    1: `📅 *Jadwal Senin*:
- PKN
- Agama
- Penyajian`, // Senin
    2: `📅 *Jadwal Selasa*:
- Tata Hidang
- PKK`, // Selasa
    3: `📅 *Jadwal Rabu*:
- PCKI
- Pastray`, // Rabu
    4: `📅 *Jadwal Kamis*:
- Bahasa Inggris
- Mulok
- MTK`, // Kamis
    5: `📅 *Jadwal Jumat*:
- Grooming`, // Jumat
    6: `📅 *Jadwal Sabtu*:
- Penjas
- Bahasa Indonesia`, // Sabtu
};

module.exports = { scheduleMessages };

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`♻️ File '${__filename}' diperbarui`);
    delete require.cache[file];
    require(file);
});
