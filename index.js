const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: false});

const { readdirSync } = require('fs');
client.commands = new Discord.Collection();

const config = require("./config.json");
client.config = config

const files = readdirSync(__dirname + '/events');
for (const file of files) {
 const event = require(__dirname + `/events/${file}`)
 client.on(file.split('.')[0], event.bind(null, client))
 delete require.cache[require.resolve(__dirname + `/events/${file}`)]
}

const commands = readdirSync(__dirname + '/commands');
for (const file of commands) {
 const cmd = require(__dirname + `/commands/${file}`)
 client.commands.set(cmd.help.name, cmd);
 delete require.cache[require.resolve(__dirname + `/commands/${file}`)] 
}

client.login(config.token).catch(console.error);

client.on("error", (e) => console.error(e));
client.on("disconnect", () => console.log("Client is disconnecting.")).on("error", e => console.log(e));
client.on("warn", (e) => console.warn(e));