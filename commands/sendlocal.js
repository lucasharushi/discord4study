module.exports = {
    name: 'sendlocal',
    description: 'Send attachment image from folder',
    execute(message, args) {
        var attachmentLocal = new Attachment('./images.jpg');
        message.channel.send(message.author, attachmentLocal);
    }
}