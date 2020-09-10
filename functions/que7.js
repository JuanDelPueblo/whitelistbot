const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { que8 } = require("../functions/que8.js");
module.exports = {
    que7: async (client, channel, user) => {
        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle("Question #7 - Where did you find this server?")
            .setDescription(`If you were invited by someone, please mention their username, do not just put "a friend"`)
            .setAuthor(channel.guild.name, channel.guild.iconURL());
        
        return channel.send(embed)
        .then(msg => {
            const filter = m => m.author.id === user.id && m.author.id !== m.author.bot;
            const collector = msg.channel.createMessageCollector(filter, {max: 1, time: 3.6e+6});

            collector.on('collect', async function (m) {
                await db.set(`where_${m.author.id}`, {user: m.content})
                return que8(client, msg.channel, user)
            })//start

            collector.on('end', collected => {
                if (collected.size === 0) {
                    msg.channel.delete()
                }
            })//end     
        })//msg
    }  
}