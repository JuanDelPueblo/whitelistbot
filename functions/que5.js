const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { que6 } = require("../functions/que6.js");

module.exports = {
    que5: async (client, channel, user) => {
        return que5()

        async function que5(check) {
            const embed = new MessageEmbed()
                .setColor(check ? "#ff4444" : client.config.color)
                .setTitle("Question #5 - What is your favorite activity on Minecraft?")
                .setDescription(check ? "Please put more effort into your answers!" : "At least one full sentence if you are serious about joining MCPueblo")
                .setAuthor(channel.guild.name, channel.guild.iconURL());

            return channel.send(embed)
            .then(msg => {
                const filter = m => m.author.id === user.id && m.author.id !== m.author.bot;
                const collector = msg.channel.createMessageCollector(filter, {max: 1, time: 3.6e+6});

                collector.on('collect', async function (m) {
                    if (m.content.length < client.config.limit) return que5(true)
                    await db.set(`act_${m.author.id}`, {user: m.content})
                    return que6(client, msg.channel, user)
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