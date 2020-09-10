const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { que7 } = require("../functions/que7.js");

module.exports = {
    que6: async (client, channel, user) => {
        return que6()
        
        async function que6(check) {
            const embed = new MessageEmbed()
                .setColor(check ? "#ff4444" : client.config.color)
                .setTitle("Question #6 - What makes MCPueblo attractive to you?")
                .setDescription(check ? "Please put more effort into your answers!" : "At least one full sentence if you are serious about joining MCPueblo")
                .setAuthor(channel.guild.name, channel.guild.iconURL());

            return channel.send(embed)
            .then(msg => {
                const filter = m => m.author.id === user.id && m.author.id !== m.author.bot;
                const collector = msg.channel.createMessageCollector(filter, {max: 1, time: 3.6e+6});

                collector.on('collect', async function (m) {
                if (m.content.length < client.config.limit) return que6(true)
                await db.set(`server_${m.author.id}`, {user: m.content})
                return que7(client, msg.channel, user)
                })//start

                collector.on('end', collected => {
                if (collected.size === 0) {
                    msg.channel.delete()
                }
                })//end     
            })//msg
        }
    } 
}