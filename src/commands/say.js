module.exports = {
	name: 'say',
	description: 'Permet de répéter un message',
    usage: '[message]',
    args: true,
	cooldown: 5,
	execute(message, rags) {
		if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        if (!args[0]) return message.channel.send('Veuillez indiquer du texte à envoyer.')
        message.delete()
        message.channel.send(message.content.trim().slice(`k/say`.length))
	}
};
