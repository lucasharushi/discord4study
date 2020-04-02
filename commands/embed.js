module.exports = {
    name: 'embed',
    description: 'send embed member informations',
    execute(message, args, embed) {
        embed.setTitle('User Information')
        .addField('Dev Name', message.author.username, true)
        .addField('Current Server', message.guild.name, true)
        .setThumbnail(message.author.avatarURL)
        .setFooter('Read my website!')
        .setColor('#0099FF');

        message.channel.send(embed);
    }
}