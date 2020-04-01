const config = require('./config');

const discord = require('discord.js');
const client = new discord.Client();

const ms = require('ms');
const cheerio = require('cheerio');
const request = require('request');

// When bot connect on server
client.on('ready', function() {
    console.log('Estou conectado!');
});

const PREFIX = '!'
var version = '1.0.2';

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
        message.channel.send(urls[Math.floor(Math.random() * urls.length)] + " " + message.guild.members.random());
        // this method return so many results in $urls, so generate a random value in array
    });
}

// Bot connect
client.login(config.token);