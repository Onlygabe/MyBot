
module.exports.run = async (bot, message, args) => {

    message.delete();
    message.channel.send("Scrims start now!");

}


module.exports.help = {
    name: "now"
}