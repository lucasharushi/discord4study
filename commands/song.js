module.exports = {
    name: 'song',
    description: 'play song from Youtube',
    execute(message, args, servers, ytdl) {
        if(!args[1]) {
            message.channel.send('you need to provide a link!');
            return;
        }
        
        // if is a voice channel
        if(!message.member.voiceChannel) {
            message.channel.send('you muste be in a channel to play the bot!');
            return;
        }

        if(!servers[message.guild.id]) {
            servers[message.guild.id] = {
                queue: []
            }
        }

        var server = servers[message.guild.id];

        server.queue.push(args[1]);

        if(!message.guild.voiceConnection) {
            message.member.voiceChannel.join()
                .then(function(connection) {
                    play(connection, message, servers, ytdl);
                });
        }
    }
}

function play(connection, message, servers, ytdl) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: 'audioonly'}));
    server.queue.shift();

    server.dispatcher.on('end', function() {
        if(server.queue[0]) {
            play(connection, message);
        } else {
            connection.disconnect();
        }
    });
}