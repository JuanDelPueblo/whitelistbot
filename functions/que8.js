const { MessageEmbed } = require("discord.js");
const { que9 } = require("../functions/que9.js");

module.exports = {
    que8: async (client, channel, user1) => {
        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle("Mini-quiz #1/2 - Choose carefully!")
            .setDescription("What is the first word of the second clause in the rule can be found in the exact middle between rule #2 and #6?\n\n🇦 Pranks\n🇧 Basic\n🇨 Follow\n🇩 Maturity")
            .setAuthor(channel.guild.name, channel.guild.iconURL());

        return channel.send(embed)
        .then(async function (msg) {
            await msg.react("🇦")
            await msg.react("🇧")
            await msg.react("🇨")
            await msg.react("🇩")   
            
            const filter = (reaction, user) => { 
                user.id !== client.id;
                return user.id === user1.id 
            };     
            const collector = await msg.createReactionCollector(filter, {max: 1, time: 3.6e+6});   
            
            collector.on('collect', async (reaction, reactionCollector) => {
                if (reaction.emoji.name !== "🇦") { 
                    msg.channel.delete()
                    return channel.guild.member(user1).kick()  
                } else {
                    return que9(client, msg.channel, user1)
                }
            })//end
            
            collector.on('end', collected => {
                if (collected.size === 0) {
                    msg.channel.delete() 
                };
            });//end of collector (Deletes Channel) 
            
        })//msg
    }  
}