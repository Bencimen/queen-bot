const Discord = require('discord.js')
const bot = new Discord.Client({ disableEveryone: true });
const { Player } = require("discord-player");
const player = new Player(bot);
bot.player = player;
module.exports = {
    name: "play",
    category: "Music",
    description: "Lejátszó",
    run: async (bot, message, args) => {
        let botname = "Teszt bot";
        let prefix = "!";
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Nincs jogod ehhez!")
        bot.player.on("trackStart", (message, track) => message.channel.send(`Most megy: ${track.title}`))

        bot.player.on("trackAdd", (message, track, queue) => message.channel.send(`${message.content.split(" ").slice(1).join(" ")} hozzá lett adva a várolistához!`))

        if (!message.member.voice.channel) return message.reply("Te nem vagy bent egy voice csatornában sem!")
        if (!args[0]) return message.reply("Kérlek adj meg egy URL-t vagy egy zene címet!")
        message.member.voice.channel.join();

        bot.player.play(message, args.join(" "), { firstResult: true })
        message.channel.send(message)
    }
}