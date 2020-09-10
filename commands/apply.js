const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const mojang = require("mojangjs");
const { que2 } = require("../functions/que2.js");

module.exports.help = {
    name: "apply"
};

module.exports.run = async (client, message, args) => {
    const whitelistedRole = "whitelistedRole"
    if (message.member.roles.cache.some(role => [whitelistedRole].includes(role.id))) return;

    message.guild.channels.create(`w-${message.author.username}`, {type: "text"}).then((channel) => { 
        channel.createOverwrite(message.guild.roles.cache.find(n => n.name === '@everyone'), { VIEW_CHANNEL: false, SEND_MESSAGES: false, ADD_REACTIONS: false }).then(async function (chan) {
            const categoryId = "categoryId";
            const roleId1 = "roleId1"
            const roleId2 = "roleId2"
            const roleId3 = "roleId3"
            const readyEmbed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle("Ready to become a MCPueblo member?")
                .setDescription(`Then please go to ${chan} to begin the application process.`)
            const startEmbed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle("Thank you for choosing to join MCPueblo!")
                .setDescription("Below I will be asking a few questions for which the staff will then review and determine whenever you are accepted or rejected into the server. Before we begin, please only reply with a single answer per question and make sure you have read the rules and server information.");

            await chan.setParent(categoryId); 
            await chan.createOverwrite(message.author, {VIEW_CHANNEL: true, SEND_MESSAGES: true});   
            await chan.createOverwrite(message.guild.roles.cache.find(r => r.id === roleId1), {VIEW_CHANNEL: true, SEND_MESSAGES: true})  
            await chan.createOverwrite(message.guild.roles.cache.find(r => r.id === roleId2), {VIEW_CHANNEL: true, SEND_MESSAGES: true})   
            await chan.createOverwrite(message.guild.roles.cache.find(r => r.id === roleId3), {VIEW_CHANNEL: true, SEND_MESSAGES: true})
            await chan.setTopic("Follow the bot's instructions in order to become accepted into MCPueblo!")
            await chan.send(startEmbed)
            await message.channel.send(readyEmbed)
            return first()

            async function first(check) {
                const usernameEmbed = new MessageEmbed()
                    .setColor(check ? "#ff4444" : client.config.color)
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setTitle("Question #1 - What is your Minecraft username?")
                    .setDescription(check ? "Username is invalid, please make sure you haven't made a typo or that it is not a cracked account. (if cracked, <:sadpepe:634534882697281538>)" : "Keep in mind that we don't accept offline/cracked usernames.")
                
                return chan.send(usernameEmbed)
                .then(msg => {
                    const filter = m => m.author.id === message.author.id && m.author.id !== m.author.bot;
                    const collector = msg.channel.createMessageCollector(filter, {max: 1, time: 3.6e+6});
                        
                    collector.on('collect', async function (m) {
                        mojang.getUUID(m.content)
                        .then(async function (uuid) {
                            await db.set(`username_${message.author.id}`, {user: m.content})
                            return que2(client, msg.channel, message.author)
                        })
                        .catch(err => first(true));
                    })//start
                    
                    collector.on('end', collected => {
                        if (collected.size === 0) {
                            msg.channel.delete()
                        }
                    })//end     
                        
                })//msg
            }
        })
    })
}