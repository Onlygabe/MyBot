const ytdl = require('ytdl-core');

module.exports.run = async (bot, message, args) => {

    const streamOptions = {seek: 0, volume: 1};
    let voiceChannelID = "532059170237841409";

    console.log("Starting Voice Command");

    if (voiceChannelID != null) {
        if (message.guild.channels.get(voiceChannelID)){
            let vc = message.guild.channels.get(voiceChannelID);
            console.log("Next Step, Connecting")

            vc.join().then(connection => {
                console.log("[VOICE CHANNEL] joined countdown channel.");
                const stream = ytdl('https://www.youtube.com/watch?v=nyC0c6t7Vq0', {filter: 'audioonly'});
                const dispatcher = connection.playStream(stream, streamOptions);

                dispatcher.on("end", end => {
                    console.log("[VOICE CHANNEL] left countdown channel.")
                    vc.leave();
                });
            }).catch(err => {
                console.log(err);
            });

        }
    }
}



module.exports.help = {
    name: "count"
}