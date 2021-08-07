module.exports = {
	name: 'queue',
	description: 'Queue command.',
	cooldown: 5,
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('Il n\y a aucune musique en cours.');
		return message.channel.send(`
__**File d'attente:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**En cours de lecture:** ${serverQueue.songs[0].title}.
		`);
	}
};
