module.exports = {
    name: 'ban',
    description: 'ban a member',
    execute(message, args) {
        if(!args[1]) {
            message.channel.send('You need to specify a person!');
        }

        // Member to kick informed on message
        var banned = message.mentions.members.first();
        // console.log(kicked);
        if(banned) {
            var member = message.guild.member(banned);

            if(member) {
                member.ban({ression: 'you are bad!'}).then(() => {
                    message.reply(`WE BANNED THE PLAYER! ${member.tag}`);
                });
            } else {
                message.reply(`you need to specify a person!`);
            }
        } else {
            message.reply(`you need to specify a person!`);
        }
    }
}