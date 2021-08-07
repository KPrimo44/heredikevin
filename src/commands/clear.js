module.exports = {
	name: 'clear',
	description: 'Efface un nombre de message défini.',
	cooldown: 5,
    args: true,
    usage: "[nombre]",
	execute(message, args) {
		if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const count = args[0]
        if (!/\d+/.test(count)) return message.channel.send('Veuillez indiquer un nombre de messages à supprimer.')
        if (count < 1 || count > 99) return message.channel.send('Le nombre de message doit être compris entre 1 et 99.')
        message.channel.bulkDelete(Number(count) + 1, true)
        message.channel.send(`${args[0]} messages ont été supprimés !`).then(sent => sent.delete({timeout: 5e3}))
	}
};
