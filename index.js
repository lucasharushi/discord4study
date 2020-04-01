const config = require('./config');

const discord = require('discord.js');
const client = new discord.Client();

const ms = require('ms');
const cheerio = require('cheerio');
const request = require('request');
const ytdl = require('ytdl-core');

// When bot connect on server
client.on('ready', function() {
    console.log('Estou conectado!');
});

const PREFIX = '!'
var version = '1.0.2';

var servers = {};

// When alguem send message
client.on('message', function(message) {
    // console.log(message);

    let args = message.content.substring(PREFIX.length).split(' ');


    switch(args[0]) {

        // Show my website
        case 'website':
            message.channel.send('https://independent-studies.com');
        break;

        // Get version bot
        case 'info':
            if(args[1] === 'version') {
                message.channel.send(`Version ${version}`);
            } else {
                message.channel.send('Invalid Args');
            }
        break;

        // Delete messages
        case 'clear':
            if(!args[1]) {
                return message.reply('Error please define second arg');
            } else {
                message.channel.bulkDelete(args[1]);
            }
        break;

        // Create a embed
        case 'embed':
            const embed = new discord.RichEmbed()
                .setTitle('User Information')
                .addField('Dev Name', message.author.username, true)
                .addField('Version', version, true)
                .addField('Current Server', message.guild.name, true)
                .setThumbnail(message.author.avatarURL)
                .setFooter('Read my website!')
                .setColor('#0099FF');

            message.channel.send(embed);
        break;

        case 'mute':
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
        break;

        case 'play':

            function play(connection, message) {
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
                        play(connection, message);
                    });
            }
        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) {
                server.dispatcher.end();
            }
 
            message.channel.send('skipping the song!');
        break;
        
        case 'stop':
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
        break;

        // Search images on dogpile.com
        case 'image':
            let search = args[1];
            if(!search) {
                message.reply('You didnt specity search');
                return;
            }

            image(message, search);
        break;
    }
});

function image(message, search) {
    // Get images from dogpile.com
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + search,
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    }

    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }

        $ = cheerio.load(responseBody);

        var links = $('.image a.link');

        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr('href'));

        // console.log(urls);
        if(!urls.length) {
            return;
        }

        // Send result
        // for(let cont = 0; cont < urls.length; cont++) {
            // message.channel.send(urls[cont]);
        // }
        message.channel.send(urls[Math.floor(Math.random() * urls.length)] + " " + message.guild.members.random());
        // this method return so many results in $urls, so generate a random value in array
    });
}

// Bot connect
client.login(config.token);