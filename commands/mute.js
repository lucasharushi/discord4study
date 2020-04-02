module.exports = {
    name: 'mute',
    description: 'mute a member for X time',
    execute(message, args, ms) {
        let person = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));

        // Cannot find a member to mute
        if(!person) {
            return message.reply("Couldn't find that member");
        } else {
            let mainrole = message.guild.roles.find(role => role.name === 'Newbie');
            let muterole = message.guild.roles.find(role => role.name === 'mute');

            if(!muterole) {
                return message.reply("Couldn't find the mute role");
            } else {
                let time = args[2]; // Get time to mute

                if(!time) {
                    return message.reply('You didnt specity a time!');
                }

                person.removeRole(mainrole.id); // Remove to actual role
                person.addRole(muterole.id); // Send to mute role

                message.channel.send(`@${person.user.tag} has now been muted for ${ms(ms(time))}`);

                // After X time, the member go back to mailrole
                setTimeout(function() {
                    person.addRole(mainrole.id);
                    person.removeRole(muterole.id);
                    message.channel.send(`@${person.user.tag} has been unmuted!`);
                }, ms(time));
            }
        }
    }
}