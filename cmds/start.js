const Discord = require('discord.js');
const Listing = require('./../modules/listing')
const fs = require('fs');


module.exports.run = async (bot, message, args) => {
    let snipeChannel = message.channel;
    const filter = m => !m.author.bot;
    let game = new Listing();

    let raw = fs.readFileSync('./roles.json');
    let allowedRoles = JSON.parse(raw);
    
    let validation = function(serverRoles, userRoles){
        let val = false;
        serverRoles.forEach((role) => {
            userRoles.forEach((user) => {
                if (role == user){
                    val = true;
                }
            });
        });
        return val;
    }

    let editLast3 = null;

    let startMessage = new Discord.RichEmbed()
        .setTitle("Toxic Scrims")
        .setDescription("Write your the last 3 digits of you server ID")
        .setColor("#1e8449")
        .setFooter("Toxic Scrims");

    message.channel.send({embed: startMessage});

    let time = 27;
    let editTime = "";

    let timeEmbed = new Discord.RichEmbed()
        .setTitle("Next Match in...")
        .setDescription(time + " minutes")
        .setColor("#1e8449");
    
    setTimeout(async () => {
        editTime = await message.channel.send({embed: timeEmbed}).catch( (err) => {
            console.log("Cant edit deleted message");
        });
    }, 10);

    let timeInterval = setInterval(() => {
        if (time === 1){
            time -= 1;
            timeEmbed.setDescription(time + " minutes");
            clearInterval(timeInterval);
        }else {
            time -=1;
            timeEmbed.setDescription(time + " minutes");
        }

        editTime.edit({embed: timeEmbed}).catch((err) => {
            console.log("Cant Edit");
            clearInterval(timeInterval);
        })

    },60000);

    let last3 = new Discord.RichEmbed()
        .setTitle("Last 3 Code")
        .setColor("#1e8449");

    setTimeout(async () => {
        editLast3 = await message.channel.send({embed: last3});
    }, 10);

    const collector = snipeChannel.createMessageCollector(filter, {max:200, maxMatches: 200, time: 180000});

    collector.on('collect', m => {
        console.log(`Collected ${m.content} | ${m.author.username}`);

        if (validation(allowedRoles.roles,m.member.roles.array())){
            if(m.content === "!start"){
                collector.stop();
                console.log("Collector Stopped");
                return;
            }
        }

        if (game.data.length === 0 && m.content.length === 3){
            game.addID(m.content.toUpperCase(), m.author.username);
        }else if (m.content.length === 3){
            if (game.userPresent(m.author.username)){
                game.deleteUserEntry(m.author.username);
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author.username);
                }else {
                    game.addID(m.content.toUpperCase(),m.author.username);
                }
            }else {
               if (game.idPresent(m.content.toUpperCase())){
                   game.addUser(m.content.toUpperCase(), m.author.username);
               }else {
                   game.addID(m.content.toUpperCase(), m.author.username);
               }
            }
        }

        game.sort();

        let str = "";
        last3 = new Discord.RichEmbed()
            .setTitle("Last 3 Code")
            .setColor("#1e8449");

        for (var i = 0; i < game.data.length; i++){
            str = "";
            for (var j = 0; j < game.data[i].users.length; j++){
                str += game.data[i].users[j] + "\n";
            }
            last3.addField(`${game.data[i].id.toUpperCase()} - ${game.data[i].users.length} PLAYERS`, str, true);
        }

        editLast3.edit({embed: last3}).catch((err) => {
            console.log("Caught edit error");
        });

        if (m.deletable){
            m.delete().catch((err) => {
                console.log("Cant Delete");
                console.log(err);
            });
        }

    })

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
    });


}



module.exports.help = {
    name: "start"
}