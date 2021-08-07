const { Util } = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
	name: 'play',
	description: 'Play command.',
	usage: '[command name]',
	args: true,
	aliases: 'p',
	cooldown: 5,
	async execute(message, args) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('Je suis désolé mais vous devez être dans un canal vocal pour jouer de la musique !');
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('Je ne peux pas me connecter à votre canal vocal, assurez-vous que j\'ai les autorisations nécessaires !');
		if (!permissions.has('SPEAK')) return message.channel.send('Je ne peux pas parler dans ce canal vocal, assurez-vous que j\'ai les autorisations nécessaires !');

		const serverQueue = message.client.queue.get(message.guild.id);
		const songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, '$1'));
		console.log(songInfo);
		const song = {
			id: songInfo.videoDetails.videoId,
			title: Util.escapeMarkdown(songInfo.videoDetails.title),
			url: songInfo.videoDetails.video_url
		};

		if (serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send(`✅ **${song.title}** a été ajouté à la liste d'attente !`);
		}

		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: channel,
			connection: null,
			songs: [],
			volume: 1,
			playing: true
		};
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);
			console.log(queue)
			if (!song) {
				queue.voiceChannel.leave();
				message.client.queue.delete(message.guild.id);
				queue.textChannel.send(`🎶 J'ai terminé l'écoute dans ${queue.voiceChannel.name}.`);				
				return;
			}

			const dispatcher = queue.connection.play(ytdl(song.url))
				.on('finish', () => {
					queue.songs.shift();
					play(queue.songs[0]);

				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 5);
			queue.textChannel.send(`🎶 Commencez à jouer: **${song.title}** dans ${queue.voiceChannel.name}.`);
		};

		try {
			const connection = await channel.join();
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		} catch (error) {
			console.error(`Je n\'ai pas pu rejoindre le canal vocal: ${error}`);
			message.client.queue.delete(message.guild.id);
			await channel.leave();
			return message.channel.send(`Je n\'ai pas pu rejoindre le canal vocal: ${error}`);
		}
	}
};
