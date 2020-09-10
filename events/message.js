const Discord = require("discord.js");
module.exports = async (client, message) => {
 if (message.author.bot || message.channel.type === "dm" || !message.content.startsWith(client.config.prefix)) return;

 const messageArray = message.content.split(/\s+/g), command = messageArray[0], args = messageArray.slice(1);
 const cmd = client.commands.get(command.slice(client.config.prefix.length).toLowerCase());
  
 if (cmd) cmd.run(client, message, args);
}