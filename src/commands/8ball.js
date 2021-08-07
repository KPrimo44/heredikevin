const Discord = require('discord.js'),
    replies = ['Oui', 'Non', 'Peut être', 'Evidemment']
 
module.exports = {
	name: '8ball',
	description: 'Cette commande permet de tirer un message aléatoire',
	cooldown: 5,
    args: true,
    usage: "[message]",
	execute(message, args) {
		const question = args.join(' ')
        message.channel.send(new Discord.MessageEmbed()
            .setTitle(question)
            .setDescription(replies[Math.floor(Math.random() * replies.length)]))
	}
};
