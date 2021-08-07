module.exports = {
	name: 'pause',
	description: 'Pause command.',
	cooldown: 5,
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ je mets la musique en pause pour vous !');
		}
		return message.channel.send('Il n\y a aucune musique en cours.');
	}
};
