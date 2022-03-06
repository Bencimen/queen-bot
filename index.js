const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client({ disableEveryone: true }, { partials: ["MESSAGE", "CHANNEL", "REACTION"] });
const prefix = config.prefix
var stats = {};
const random = require("random")
const fs = require("fs");
const jsonfile = require("jsonfile")
const { Player } = require("discord-player");
const player = new Player(bot);
bot.player = player;

////////////////////////////////////////////////////////////////////////

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

bot.categoires = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(bot)
});


bot.on("message", async (message) => {
    let prefix = config.prefix;

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message)

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length == 0) return;

    let command = bot.commands.get(cmd);
    if (!command) command = bot.commands.get(bot.aliases.get(cmd));

    if (command)
        command.run(bot, message, args);
});

////////////////////////////////////////////////////////////////////////

if (fs.existsSync("stats.json")) {
    stats = jsonfile.readFileSync("stats.json");
}
bot.on("guildMemberAdd", guildMember => {
    bot.channels.cache.get("949634478282801182").send(`Üdvözöllek <@${guildMember.id}>! Olvas el a szabályzatot: <#${"949630475486523452"}> és érezd jól magad!`);
})
bot.on("guildMemberRemove", guildMember => {
    bot.channels.cache.get("949634478282801182").send(`<@${guildMember.id}> távozott tőlünk! :c`);
})


bot.on("ready", async () => {
    console.log("Queen-bot készen áll!")

    let státuszok = [
        "Prefix: .",
        "Készítő: Bencimen",
        "Koncert: 17:00"
    ]

    setInterval(function () {
        let status = státuszok[Math.floor(Math.random() * státuszok.length)]

        bot.user.setActivity(status, { type: "WATCHING" })
    }, 3000)
})

bot.on("message", async message => {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if (message.author.id === bot.user.id) return;

    if (message.guild.id in stats === false) {
        stats[message.guild.id] = {};
    }

    const guildStats = stats[message.guild.id];
    if (message.author.id in guildStats === false) {
        guildStats[message.author.id] = {
            xp: 0,
            level: 0,
            last_message: 0
        };
    }
    const userStats = guildStats[message.author.id];

    if (Date.now() - userStats.last_message > 60000) {
        userStats.xp += random.int(15, 25);
        userStats.last_message = Date.now();
        var XPToNextLevel = 5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;
        if (userStats.xp >= XPToNextLevel) {
            levelUpChannel = "949691305947181066";
            userStats.level++;
            userStats.xp = userStats.xp - XPToNextLevel;
            bot.channels.cache.get(levelUpChannel).send(`Gratulálok <@${message.author.id}>! Sikeresen elérted a ${userStats.level}. szintet!`);
        }

        jsonfile.writeFileSync("stats.json", stats);

        console.log(XPToNextLevel + " XP-re van szükség a következő szinthez!")

        console.log(message.author.username, userStats.xp, "XP-t ért el!")
    }

    if (userStats.level === 1) {
        message.member.roles.add("949609138214809620")
    }
    if (userStats.level === 5) {
        message.member.roles.add("949616438279295006")
    }
    if (userStats.level === 10) {
        message.member.roles.add("949616531896168508")
    }
    if (userStats.level === 15) {
        message.member.roles.add("949616736502706206")
    }
    if (userStats.level === 20) {
        message.member.roles.add("949616656626376724")
    }
    if (userStats.level === 25) {
        message.member.roles.add("949616722225270804")
    }
    if (userStats.level === 30) {
        message.member.roles.add("949616882695151646")
    }
    if (userStats.level === 35) {
        message.member.roles.add("949616963431313468")
    }
    if (userStats.level === 40) {
        message.member.roles.add("949617051671080991")
    }
    if (userStats.level === 45) {
        message.member.roles.add("949617141831856180")
    }
    if (userStats.level === 50) {
        message.member.roles.add("949617315941613588")
    }
    if (cmd === `${prefix}stats`) {
        if (userStats.level >= 1) {
            const statEmbed = new Discord.MessageEmbed()
                .setTitle(message.author.username, "XP")
                .addField(`${userStats.level} szint!`, `${XPToNextLevel - userStats.xp} XP kell még a következő szinthez!`)
                .setFooter(`Queen-bot  |  ${message.createdAt}`)
            message.channel.send(statEmbed);
        } else message.reply("0-ás szintű vagy!")
    }
    if (cmd === "time") {
        let time = new Date().toLocaleTimeString();
        message.channel.send(time)
    }
})
bot.on("ready", async () => {
    setInterval(function () {
        let time = new Date().toLocaleTimeString();
        if (time === "13:19:00") {
            keresés = "Queen - Another One Bites the Dust (Official Video)"
            bot.channels.cache.get("949983957078925342").join();
            bot.player.on("trackStart", (message, track) => bot.channels.cache.get("949356178478104629").send(`Most megy: ${track.title}`))

            bot.player.on("trackAdd", (message, track, queue) => bot.channels.cache.get("949356178478104629").send(`${message.content.split(" ").slice(1).join(" ")} hozzá lett adva a várolistához!`))
            bot.channels.cache.get("949983957078925342").player.play(keresés, { firstResult: true });
        }
    }, 1000)
})


bot.login(process.env.BOT_TOKEN)
