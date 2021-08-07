module.exports = {
	name: 'skip',
	description: 'Skip command.',
	cooldown: 5,
	execute(message) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('Je suis désolé mais vous devez être dans un canal vocal pour jouer de la musique !');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('Il n\'y a pas de son dans la playlist.');
		serverQueue.connection.dispatcher.end('La commande de skip a été utilisée !');
	}
};
