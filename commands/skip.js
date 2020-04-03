module.exports = {
    name: 'skip',
    description: 'Jump song to next in the queue',
    execute(message, args, servers) {
        var server = servers[message.guild.id];
        if(server.dispatcher) {
            server.dispatcher.end();
        }

        message.channel.send('skipping the song!');
    }
}