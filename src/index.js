require('dotenv').config();
const { readdirSync } = require('fs');
const { join } = require('path');
const Client = require('./struct/Client');
const { Collection } = require('discord.js');
const client = new Client({ token: process.env.DISCORD_TOKEN, prefix: process.env.DISCORD_PREFIX });

client.db = require('./db.json')

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(join(__dirname, 'commands', `${file}`));
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log(`Connectée à ${client.user.tag}`)
	const statuses = [
        () => `k/help`,
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'PLAYING'})
        i = ++i % statuses.length
    }, 1e4)
    setInterval(() => {
        const [bots, humans] = client.guilds.cache.first().members.cache.partition(member => member.user.bot)
        client.channels.cache.get("804754916681580554").setName(`🤵🏽Humains : ${humans.size}`)
        client.channels.cache.get("804754917318328360").setName(`🤖Bots : ${bots.size}`)
        client.channels.cache.get("804747776667025449").setName(`🔡Total : ${client.guilds.cache.first().memberCount}`)
        client.channels.cache.get("804754915611901993").setName(`🛠Salons : ${client.guilds.cache.first().channels.cache.size}`)
       	client.channels.cache.get("804754917931221023").setName(`📒Rôles : ${client.guilds.cache.first().roles.cache.size}`)
    }, 3e4)
});

client.on('message', message => {
	if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;
	const args = message.content.slice(client.config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (command.guildOnly && message.channel.type !== 'text') return message.reply('Je ne peux pas exécuter cette commande en DM !');
	if (command.args && !args.length) {
		let reply = `Vous n'avez fourni aucun argument, ${message.author}!`;
		if (command.usage) reply += `\nL'usage approprié est : \`${client.config.prefix}${command.name} ${command.usage}\``;
		return message.channel.send(reply);
	}
	if (!client.cooldowns.has(command.name)) {
		client.cooldowns.set(command.name, new Collection());
	}
	const now = Date.now();
	const timestamps = client.cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Veuillez patienter ${timeLeft.toFixed(1)}s avant de réutiliser la commande \`${command.name}\`.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply('il y a eu une erreur en essayant d\'exécuter cette commande !');
	}
});

client.on('channelCreate', channel => {
    if (!channel.guild) return
    const muteRole = channel.guild.roles.cache.find(role => role.name === 'Muted')
    if (!muteRole) return
    channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false
    })
})

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get("804441311343804448").send(`${member}`, new Discord.MessageEmbed()
        .setDescription(`${member} a rejoint le serveur. Nous sommes désormais ${member.guild.memberCount} ! 🎉`)
        .setColor('#00ff00'))
		memberReactor.roles.add('804441289613115402', "AutoRole")
})
 
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get("804441311343804448").send(new Discord.MessageEmbed()
        .setDescription(`${member.user.tag} a quitté le serveur... 😢`)
        .setColor('#ff0000'))
		member.roles.add('804441289613115402', "AutoRole")
})

client.login(client.config.token);
