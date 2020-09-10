module.exports.help = {name: "reject"};
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
            const rejectReason = args.join(" ");
            if (rejectReason) {
                await member.send("I am sorry, but our staff have reviewed your whitelist submission, and have determined you are not fit for MCPueblo. We generally don't reject until we have checked with multiple staff members, so please don't come back and beg for another chance as it is unlikely that we will accept you again. We hope that you find a place with another server instead.\nReject reason: `" + rejectReason + "`").catch(() =>
                console.log('\x1b[31mRejected member has disabled DMs!\x1b[0m'));
            } else {
                await member.send(`I am sorry, but our staff have reviewed your whitelist submission, and have determined you are not fit for MCPueblo. There is a very good reason as to why we rejected you, so please don't come back and beg for another chance as it is unlikely that we will accept you again. We hope that you find a place with another server instead.`).catch(() =>
                console.log('\x1b[31mRejected member has disabled DMs!\x1b[0m'));
            }
            await member.kick()
            return message.channel.delete()
        }  
    } 
}