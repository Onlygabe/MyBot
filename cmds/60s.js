
module.exports.run = async (bot, message, args) => {

    message.delete();
    message.channel.send("Next scrim in 1 minute @everyone");

}


module.exports.help = {
    name: "60s"
}