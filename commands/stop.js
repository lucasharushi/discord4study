module.exports = {
    name: 'stop',
    description: 'Stop queue',
    execute(message, args, servers) {
        var server = servers[message.guild.id];

        if(message.guild.voiceConnection) {
            for(var i = server.queue.length - 1; i >= 0; i--) {
                server.queue.splice(i, 1);
            }

            server.dispatcher.end();
            message.channel.send('ending the queue leaving the voice channel');
            console.log('stopped the queue');
        }

        if(message.guild.connection) {
            message.guild.voiceConnection.disconnect();
        }
    }
}