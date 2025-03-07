const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (msg) => {
        console.log('Neue Nachricht:', msg.messages[0]);
    });

    sock.ev.on('connection.update', (update) => {
        const { qr } = update;
        if (qr) {
            qrcode.generate(qr, { small: true });
        }
    });
}

// Starte den Bot
startBot();

// Erstelle einen einfachen Webserver für Render
app.get('/', (req, res) => {
    res.send('Baileys WhatsApp Bot läuft! 🚀');
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
