const Discord = require('discord.js')
 
module.exports = {
	name: 'help',
	description: 'Cette commande permet d\'avoir de l\'aide',
	cooldown: 5,
    usage: "[nom de la commande]",
	execute(message, args, client) {
		if (args[0]) {
            const command = client.commands.get(args[0].toLowerCase())
            if (!command) return message.channel.send('Cette commande n\'existe pas.')
            message.channel.send(new Discord.MessageEmbed()
                .setColor('#00AEFF')
                .setDescription(`**Commande : ${command.name}**\n\n${command.description}\n\nSyntaxe : \`k/${command.name}${command.usage ? ` ${command.usage}` : ''}\``))
        }
        else {

            const commandList = `${client.commands.map(command => `\`k/${command.name} : ${command.description}\` \n`).join(' ')}\n\nPour plus d'informations sur une commande, tapez \`k/help [nom de la commande]\``;
            

            message.channel.send(new Discord.MessageEmbed()
                .setTitle('Liste des commandes')
                .setColor('#00AEFF')
                .setDescription(commandList))
        }
	}
};
