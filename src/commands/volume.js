module.exports = {
	name: 'volume',
	description: 'Volume command.',
	cooldown: 5,
	execute(message, args) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('Je suis désolé mais vous devez être dans un canal vocal pour jouer de la musique !');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('Il n\y a aucune musique en cours.');
		if (!args[0]) return message.channel.send(`Le volume actuel est: **${serverQueue.volume}**.`);

		if (message.author.id == "292636011698192384") {
			[serverQueue.volume] = args;
			serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
			return message.channel.send(`Je règle le volume sur: **${args[0]}**.`);
		} else {
			if(!isNaN(args[0]) && args[0] >= 0 && args[0] <= 5) {
				[serverQueue.volume] = args;
				serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
				return message.channel.send(`Je règle le volume sur: **${args[0]}**.`);
			} else {
				message.channel.send("Veuillez préciser un nombre entre 0 et 5")
			}
		}
		
	}
};
