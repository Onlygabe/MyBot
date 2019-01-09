

module.exports.run = async (bot, message, args) => {
    message.delete();
    message.channel.send("Next Scrim in 30seconds @everyone");



}

module.exports.help = {
    name: "30s"
}

