const fs = require('fs')
const chalk = require('chalk')

// fitur/menu.js

module.exports.getMenu = (prefix) => {
    return `
❏═┅═━━━┅Daftar menu Bot
┊☃${prefix}menu 
┊☃${prefix}info 
┊☃${prefix}ping 
┊☃${prefix}help 
┊☃${prefix}about 
┊☃${prefix}jadwal 
┊☃${prefix}alljadwal 
┊☃${prefix}stiker  
┊☃${prefix}sendgif
┊☃${prefix}stendaudio
┗━═┅═━––
    `;
};

//   AUTO RELOAD PERUBAHAN FILE
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update'${__filename}'`))
    delete require.cache[file]
    require(file)
})
