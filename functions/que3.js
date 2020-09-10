const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { que4 } = require("../functions/que4.js");

module.exports = {
    que3: async (client, channel, user, age) => {
        const embed = new MessageEmbed()
        .setColor(client.config.color)
        .setTitle("Question #3 - Where do you live? (City, country, or timezone)")
        .setDescription("If your country has multiple timezones (e.g. the USA or Australia), please mention the timezone rather than just the country.")
        .setAuthor(channel.guild.name, channel.guild.iconURL());

        return channel.send(embed).then(msg => {
            const filter = m => m.author.id === user.id && m.author.id !== m.author.bot;
            const collector = msg.channel.createMessageCollector(filter, {max: 1, time: 3.6e+6});
                
            collector.on('collect', async function (m) {
                await db.set(`live_${m.author.id}`, {user: m.content})
                return que4(client, msg.channel, user)
            })//start
                
            collector.on('end', collected => {
                if (collected.size === 0) {
                    msg.channel.delete()
                }
            })//end     
            
        })//msg
    } 
}