module.exports = {
    name: 'send',
    description: 'Send attachment image from URL',
    execute(message, args) {
        var attachment = new Discord.Attachment("https://i.ytimg.com/vi/iIycOizkCIw/maxresdefault.jpg");
        message.channel.send(message.author, attachment);
    }
}