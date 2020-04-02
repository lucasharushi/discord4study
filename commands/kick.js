module.exports = {
    name: 'kick',
    description: 'Kick a member',
    execute(message, args) {
        if(!args[1]) {
            message.channel.send('You need to specify a person!');
        }

        // Member to kick informed on message
        var kicked = message.mentions.members.first();
        // console.log(user);
        if(kicked) {
            var member = message.guild.member(kicked);

            if(member) {
                kicked.kick('You where kick for trolling!').then(() => {
                    message.reply(`Sucessfully kicked ${member.tag}`);
                }).catch(err => {
                    message.reply('I was unable to kick the member');
                    console.log(err);
                });
            } else {
                message.reply(`That user isn't in the this guild`);
            }
        } else {
            message.reply(`That user isn't in the guild`);
        }
    }
}