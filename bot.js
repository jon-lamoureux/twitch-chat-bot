const tmi = require('tmi.js'); // Twitch TMI API
const https = require('https') 
const authUser = process.env.USERNAME;
const authToken = process.env.TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

// Configuration parameters
const opts = {
  identity: {
    username: authUser,
    password: authToken
  },
  channels: [
    authUser
  ]
};

// Create new client
const client = new tmi.client(opts);
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
// Connect to Twitch
client.connect();

// Testing: Changing HUE light color
var data = new TextEncoder().encode(
	JSON.stringify({
		hue: 10000
	})
)

// Personal application only: Connect to Phillips HUE API to change the color of the lights in the room
const options = {
  hostname: '192.168.1.70',
  port: 443,
  path: '/api/tQ4iroeK-hPyNQIYDBbFxJcnXNHpWQ4mIvs-pR6E/lights/3/state',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

// Runs every time a message is entered
function onMessageHandler (target, context, msg, self) {
  if (self) { return; }
  // Remove whitespace from chat message
  const commandName = msg.trim();
  // Example testing text command
  if (commandName === '!banarctic') {
    client.say(target, `/timeout arcticsb 1`);
    console.log(`* Executed ${commandName} command`);
  }
  // Change the color of the lights in the room to red
  if (commandName === '!red') { 
	req.write(data)
	req.end()
  }
  // Point redemptions 
  if (context["custom-reward-id"] === "0d02c783-2491-4020-acf2-3a811d151ee6") {
    client.say(target, `/timeout ${context.username} 69`);
  }
  if (context["custom-reward-id"] === "f9475a0e-2796-4b82-91db-1432bdd75f80") {
    client.say(target, `/timeout arcticsb 69`);
  }
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}