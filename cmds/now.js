
module.exports.run = async (bot, message, args) => {

    message.delete();
    message.channel.send("Scrims start now! @everyone");

}


module.exports.help = {
    name: "now"
}