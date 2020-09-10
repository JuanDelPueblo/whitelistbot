module.exports.help = {name: "unlock"};
module.exports.run = async (client, message, args) => {
    const roleId1 = "roleId1"
    const roleId2 = "roleId2"
    const roleId3 = "roleId3"

    if (!message.member.roles.cache.some(role => [roleId1, roleId2, roleId3].includes(role.id))) return;

    message.delete()
    const members = message.channel.permissionOverwrites.filter(perm => perm.type === 'member')
    for (const member of [...members.values()]) {
        let user = message.guild.members.cache.get(member.id)
        
        if (!user.roles.cache.some(role => [roleId1, roleId2, roleId3].includes(role.id))) {
            const member = message.guild.member(user)
            message.channel.createOverwrite(member.id, {SEND_MESSAGES: true, VIEW_CHANNEL: true})
            return message.channel.send(`Channel unlocked!`)
        }  
    } 
}