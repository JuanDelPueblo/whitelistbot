const db = require("quick.db");
const fs = require("fs");
const Discord = require("discord.js");
module.exports.help = {name: "accept"};
module.exports.run = async (client, message, args) => {
    const roleId1 = "roleId1"
    const roleId2 = "roleId2"
    const roleId3 = "roleId3"
    const memberRole = "memberRole"
    const consoleChannel = "consoleChannel"
    const welcomeChannel = "welcomeChannel"
    const applicationChannel = "applicationChannel"

    if (!message.member.roles.cache.some(role => [roleId1, roleId2, roleId3, memberRole].includes(role.id))) return;

    message.delete()
    let channel = message.guild.channels.cache.find(r => r.id === consoleChannel) 
    if (!channel) return message.channel.send("No whitelist channel found.")

    const members = message.channel.permissionOverwrites.filter(perm => perm.type === 'member')
    for (const member of [...members.values()]) {
        let user = message.guild.members.cache.get(member.id)
        if (!user.roles.cache.some(role => [roleId1, roleId2, roleId3].includes(role.id))) {
            let get = await db.get(`username_${user.id}.user`)

            var htmlTemplate = fs.readFileSync('template.html', 'utf8');
            htmlTemplate = htmlTemplate.split('%discorduser%').join(user.user.tag);
            htmlTemplate = htmlTemplate.split('%username%').join(await db.get(`username_${user.id}.user`));
            htmlTemplate = htmlTemplate.split('%age%').join(await db.get(`age_${user.id}.user`));
            htmlTemplate = htmlTemplate.split('%live%').join(await db.get(`live_${user.id}.user`));
            htmlTemplate = htmlTemplate.split('%self%').join(await db.get(`self_${user.id}.user`));
            htmlTemplate = htmlTemplate.split('%act%').join(await db.get(`act_${user.id}.user`));
            htmlTemplate = htmlTemplate.split('%server%').join(await db.get(`server_${user.id}.user`));
            htmlTemplate = htmlTemplate.split('%where%').join(await db.get(`where_${user.id}.user`));

            if (!fs.existsSync('data')) {
                fs.mkdirSync('data');
            }
            fs.writeFileSync(`data/${get}.html`, htmlTemplate);
            if (get) {
                user.setNickname(get)
                channel.send(`whitelist add ${get}`)

                /*let role = message.guild.roles.cache.find(n => n.name === "Member")*/
                await user.roles.add(memberRole)

                let channel2 = message.guild.channels.cache.find(r => r.id === welcomeChannel) 
                if (channel2) {
                    const acceptedEmbed = new Discord.MessageEmbed()
                        .setColor(client.config.color)
                        .setAuthor(channel.guild.name, channel.guild.iconURL())
                        .setTitle("Congratulations on becoming a member!")
                        .setDescription("<@"+user.id+"> You have been accepted to MCPueblo! To join our server, please use the IP `play.mcpueblo.net` on version 1.16.2");
                    channel2.send(acceptedEmbed)
                }

                let channel3 = message.guild.channels.cache.find(r => r.id === applicationChannel) 
                if (channel3) {
                    var date = new Date();
                    var embed = {
                        "color": 15887373,
                        "description": `**${get}**'s whitelist application form`,
                        "timestamp": date.toISOString(),
                        "footer": {
                        "icon_url": "https://cdn.discordapp.com/attachments/551904054507339786/689998932885241978/logo.png",
                        "text": "MCPueblo Applications"
                        },
                        "author": {
                        "name": "Whitelist Application Form"
                        },
                        "thumbnail": {
                        "url": "https://cdn.discordapp.com/attachments/551904054507339786/689998932885241978/logo.png"
                        }
                    };
                    channel3.send({ embed: embed, files: [{ attachment: `data/${get}.html`, name: `${get}.html` }]});
                }
                return message.channel.delete()
            } else {
                return message.channel.send("No data fetched for this application to whitelist.") 
            }
        } 
    }  
}
