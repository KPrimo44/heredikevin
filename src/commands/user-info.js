const Discord = require('discord.js'),
    moment = require('moment')
 
module.exports = {
	name: 'queue',
	description: 'Affiche les informations d\'un membre',
    usage: '<@mention>',
	cooldown: 5,
	execute(message, args, client) {
		const member = message.mentions.members.first() || message.member
        message.channel.send(new Discord.MessageEmbed()
            .addField('Membre', member, true)
            .addField('Tag', member.user.tag, true)
            .addField('Date de création du compte', moment(member.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss'), true)
            .addField('Date d\'arrivée sur le serveur', moment(member.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss'), true)
            .addField('Date de début de boost', member.premiumSince ? moment(member.premiumSince).format('[Le] DD/MM/YYYY [à] HH:mm:ss') : 'Ne boost pas', true)
            .addField('Infractions', client.db.warns[member.id] ? client.db.warns[member.id].length : 'Aucune', true)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter(`ID : ${member.id}`))
	}
};
