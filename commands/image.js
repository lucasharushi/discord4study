module.exports = {
    name: 'image',
    description: 'Get a random image from doge.com',
    execute(message, args, request, cheerio) {
        let search = args[1];
        if(!search) {
            message.reply('You didnt specity search');
            return;
        }

        image(message, search);

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
    }
}