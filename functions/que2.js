const { MessageEmbed }= require("discord.js");
const db = require("quick.db");
const { que3 } = require(__dirname + "/que3.js");

module.exports = {
    que2: async (client, channel, user) => {
        return que2()
        
        async function que2(check) {
            const embed = new MessageEmbed()
                .setColor(check ? "#ff4444" : client.config.color)
                .setTitle("Question #2 - How old are you?")
                .setDescription(check ? "Please only insert a numeric age, such as 16 or 34" : "We won't specify a minimum age limit, but we will take in consideration the quality of your whitelist form submission overall instead.")
                .setAuthor(channel.guild.name, channel.guild.iconURL())

            return channel.send(embed).then(msg => {
                const filter = m => m.author.id === user.id && m.author.id !== m.author.bot;
                const collector = msg.channel.createMessageCollector(filter, {max: 1, time: 3.6e+6});

                collector.on('collect', async function (m) {
                    let check = parseInt(m.content)

                    if (!check) return que2(true)

                    await db.set(`age_${m.author.id}`, {user: m.content})
                    return que3(client, msg.channel, user, m.content)
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