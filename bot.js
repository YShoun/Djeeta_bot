const Discord =  require('discord.js');
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./score.sqlite");

// VARIABLES
const help =
    '\n__***Commands list:***__' +
    '\n' +
    '\n!addrole role' +
    '\n    fire, water, wind, earth, dark, light' +
    '\n    other roles incoming' +
    '\n!removerole role' +
    '\n    fire, water, wind, earth, dark, light' +
    '\n    other roles incoming' +
    '\n!choose choice1 or choice2' +
    '\n!ranking' +
    '\n!mylevel' +
    '\n!mypoints';

bot.on('ready', () => {
    console.log('Server is ready.');
});


// To welcome the new member
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const welcomeChannel = member.guild.channels.find(channel => channel.name === 'crew_lounge');
    // Do nothing if the channel wasn't found on this server
    if (!welcomeChannel) return;
    // Send the message, mentioning the member
    welcomeChannel.send(`Welcome to the server ${member} ! Feel free to add some roles in #bot_spam channel.`);
});

// To see the commands list
bot.on('message', message => {
    //For rank bot
    if (message.author.bot) return; // Ignore bots.
    if (message.channel.type === "dm") return; // Ignore DM channels.

    // Get string of input
    let str = message.content;

    // if it's help
    if (str === '!help') {
        message.channel.send(help);
    }

    //If it's to add roles
    else if (str === '!addrole fire') {
        let role = message.guild.roles.find(role => role.name === "Fire");
        message.member.addRole(role);
        message.channel.send("Fire role was added.");
    }
    else if (str === '!addrole water') {
        role = message.guild.roles.find(role => role.name === "Water");
        message.member.addRole(role);
        message.channel.send("Water role was added.");
    }
    else if (str === '!addrole earth') {
        role = message.guild.roles.find(role => role.name === "Earth");
        message.member.addRole(role);
        message.channel.send("Earth role was added.");
    }
    else if (str === '!addrole wind') {
        role = message.guild.roles.find(role => role.name === "Wind");
        message.member.addRole(role);
        message.channel.send("Wind role was added.");
    }
    else if (str === '!addrole dark') {
        role = message.guild.roles.find(role => role.name === "Dark");
        message.member.addRole(role);
        message.channel.send("Dark role was added.");
    }
    else if (str === '!addrole light') {
        role = message.guild.roles.find(role => role.name === "Light");
        message.member.addRole(role);
        message.channel.send("Light role was added.");
    }

    //If it's to remove roles
    else if (str === '!removerole fire') {
        var role2 = message.guild.roles.find(role2 => role2.name === "Fire");
        message.member.removeRole(role2);
        message.channel.send("Fire role was removed.");
    }
    else if (str === '!removerole water') {
        role2 = message.guild.roles.find(role2 => role2.name === "Water");
        message.member.removeRole(role2);
        message.channel.send("Water role was removed.");
    }
    else if (str === '!removerole earth') {
        role2 = message.guild.roles.find(role2 => role2.name === "Earth");
        message.member.removeRole(role2);
        message.channel.send("Earth role was removed.");
    }
    else if (str === '!removerole wind') {
        role2 = message.guild.roles.find(role2 => role2.name === "Wind");
        message.member.removeRole(role2);
        message.channel.send("Wind role was removed.");
    }
    else if (str === '!removerole dark') {
        role2 = message.guild.roles.find(role2 => role2.name === "Dark");
        message.member.removeRole(role2);
        message.channel.send("Dark role was removed.");
    }
    else if (str === '!removerole light') {
        role2 = message.guild.roles.find(role2 => role2.name === "Light");
        message.member.removeRole(role2);
        message.channel.send("Light role was removed.");
    }

    //If it's to make a choice
    else if (str.includes("!choose")) {
        let number = Math.floor(Math.random() * 50);
        let temp = message.content;

        if(!str.includes("or"))
        {
            message.channel.send("Use 'or' between the two elements.");
        }
        else if(number%3 ===  0)
        {
            temp = temp.substring(8, str.indexOf("or"));
            message.channel.send("You better choose : " + temp);
        }
        else if(number%3 === 1)
        {
            temp = temp.substring(str.indexOf("or")+3, );
            message.channel.send("You better choose : " + temp);
        }
    }

    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO scores (userId, username, points, level) VALUES (?, ?, ?, ?)", [message.author.id, message.author.tag, 1, 0]);
        } else {
            let curLevel = Math.floor(0.2 * Math.sqrt(row.points + 1));
            if (curLevel > row.level) {
                row.level = curLevel;
                sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
                message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
            }
            sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
        }
    }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, username TEXT, points INTEGER, level INTEGER)").then(() => {
            sql.run("INSERT INTO scores (userId, username, points, level) VALUES (?, ?, ?, ?)", [message.author.id, message.author.tag, 1, 0]);
        });
    });

    if (message.content.startsWith("!mylevel")) {
        sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
            if (!row) return message.reply("Your current level is 0");
            message.reply(`${row.username}, your current level is ${row.level}`);
        });
    }

    if (message.content.startsWith("!mypoints")) {
        sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
            if (!row) return message.reply("sadly you do not have any points yet!");
            message.reply(`you currently have ${row.points} points, good going!`);
        });
    }

    if (message.content.startsWith("!ranking")) {

        sql.get(`SELECT * FROM scores ORDER BY points ASC LIMIT 0, 1`).then(result => {
            if (!result) return message.channel.send("1 none");
            message.channel.send(`Ranking:\n1 ${result.username}`);

            sql.get(`SELECT * FROM scores ORDER BY points ASC LIMIT 1, 1`).then(result2 => {
                if (!result2) return message.channel.send("2 none");
                message.channel.send(`\n2 ${result2.username}`);

                sql.get(`SELECT * FROM scores ORDER BY points ASC LIMIT 2, 1`).then(result3 => {
                    if (!result3) return message.channel.send("3 none");
                    message.channel.send(`\n3 ${result3.username}`);

                    sql.get(`SELECT * FROM scores ORDER BY points ASC LIMIT 3, 1`).then(result4 => {
                        if (!result4) return message.channel.send("4 none");
                        message.channel.send(`\n4 ${result4.username}`);

                        sql.get(`SELECT * FROM scores ORDER BY points ASC LIMIT 4, 1`).then(result5 => {
                            if (!result5) return message.channel.send("5 none");
                            message.channel.send(`\n5 ${result5.username}`);
                        });
                    });
                });
            });
        });
    }

});

bot.login(process.env.BOT_TOKEN);
