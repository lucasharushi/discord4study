module.exports = {
    name: 'clear',
    description: 'Delete messages',
    execute(message, args) {
        if(!args[1]) {
            return message.reply('Error please define second arg');
        } else {
            message.channel.bulkDelete(args[1]);
        }
    }
}