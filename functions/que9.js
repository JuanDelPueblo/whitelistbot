const { MessageEmbed } = require("discord.js");

module.exports = {
    que9: async (client, channel, user1) => {
        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle("Mini-quiz #2/2 - Choose carefully!")
            .setDescription("What is the third feature found on the website?\n\n🇦 Online Map\n🇧 Discord Integration\n🇨 Underground Structures\n🇩 Armor Stand Editor")
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
                if (reaction.emoji.name !== "🇨") { 
                    msg.channel.delete()
                    return channel.guild.member(user1).kick()  
                } else {
                    const embed2 = new MessageEmbed()
                        .setColor(client.config.color)
                        .setAuthor(channel.guild.name, channel.guild.iconURL())
                        .setTitle("Thank you for taking the time to apply!")
                        .setDescription("A staff member will now soon review the application, and determine whenever you have been accepted to MCPueblo or not. This could take anywhere from a few minutes to some hours depending on the time of day you have submitted it.")

                    await msg.channel.send(embed2); 

                    const members = msg.channel.permissionOverwrites.filter(perm => perm.type === 'member')
                    for (const member of [...members.values()]) {
                        await msg.channel.createOverwrite(member.id, {SEND_MESSAGES: false, VIEW_CHANNEL: true}) 
                    }

                    /*return msg.channel.send("--");*/
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