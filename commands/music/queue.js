const Discord = require('discord.js')
const bot = new Discord.Client({ disableEveryone: true });
const { Player } = require("discord-player");
const player = new Player(bot);
bot.player = player;
module.exports = {
    name: "queue",
    category: "Music",
    description: "A bot köszön neked!",
    run: async (bot, message, args) => {
        let botname = "Teszt bot";
        let prefix = "!";
        const queue = bot.player.getQueue(message);

        if(!bot.player.getQueue(message)) return message.reply("A várólistán nem szerepel semmi!")

        message.channel.send(`**Várólista** - ${message.guild.name}\nJelenleg ${queue.playing.title}  |  ${queue.playing.author}\n\n` + (queue.tracks.map((track, i) => {
            return `**#${i + 1}** - ${track.title} - ${track.author} (A zenét kérte: ${track.requestedBy.username})`
        }).slice(0, 5).join(`\n`) + `\n\n${queue.tracks.length > 5 ? `és még` `**${queue.tracks.length - 5}db zene...` : `A lejátszási listában: **${queue.tracks.length}db zene van.**`}`
        ));
    }
}