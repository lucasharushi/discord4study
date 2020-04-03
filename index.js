const config = require('./config');

const Discord = require('discord.js');
const bot = new Discord.Client();

const ms = require('ms');
const cheerio = require('cheerio');
const request = require('request');
const ytdl = require('ytdl-core');

const fs = require('fs');
bot.commands = new Discord.Collection();

const commandFIles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFIles) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}









// When bot connect on server
bot.on('ready', function() {
    console.log('Estou conectado!');

    // Set a status when bot is online
    bot.user.setActivity('darude sandstorm', { type: 'LISTENING' }).catch(console.error);
});

const PREFIX = '!'
var version = '1.0.2';

var servers = {};

bot.on('guildMemberAdd', function(member) {
    console.log('hi');
    const channel = member.guild.channels.find(channel => channel.name === "welcome");

    if(!channel) {
        return;
    }

    channel.send(`Welcome to our server, ${member}, please read the rules in the rules channel!`);
});

// When alguem send message
bot.on('message', function(message) {
    // console.log(message);

    let args = message.content.substring(PREFIX.length).split(' ');


    switch(args[0]) {

        case 'ping':  
            bot.commands.get('ping').execute(message, args);
        break;

        case 'send':
            bot.commands.get('send').execute(message, args);
        break;

        case 'sendlocal':
            bot.commands.get('sendlocal').execute(message, args);
        break;

        // Delete messages
        case 'clear':
            bot.commands.get('clear').execute(message, args);
        break;

        // Kick member
        case 'kick':
            bot.commands.get('kick').execute(message, args);
        break;

        // Ban member
        case 'ban':
            bot.commands.get('ban').execute(message, args);
        break;

        // Create a embed
        case 'embed':
            const embed = new Discord.RichEmbed();
            bot.commands.get('embed').execute(message, args, embed);
        break;

        // Mute member
        case 'mute':
            bot.commands.get('mute').execute(message, args, ms);
        break;

        case 'song':
            bot.commands.get('song').execute(message, args, servers, ytdl);
        break;

        case 'skip':
            bot.commands.get('skip').execute(message, args, servers);
        break;

        case 'stop':
            bot.commands.get('stop').execute(message, args, servers);
        break;

        // Search images on dogpile.com
        case 'image':
            bot.commands.get('image').execute(message, args, request, cheerio);
        break;
    }
});



// Bot connect
bot.login(config.token);