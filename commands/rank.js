const Discord = require('discord.js');
const { db } = require('../index');

module.exports = {
	category: 'Z7',
	description: 'Karma rank',
	name: 'rank',
	minArgs: 0,
	maxArgs: 0,
	callback: async ({ message, channel, args, member, guild, client, instance, interaction }) => {
		let usersRef;
		let members;

		if (message) {
			usersRef = usersRef = db.collection(message.guild.name);
			members = message.guild.members;
		} else {
			usersRef = db.collection(guild.name);
			members = guild.members;
		}
		const users = await usersRef.orderBy('karma', 'desc').get();

		let leaderboard = '';
		let place = 1;
		await users.docs.forEach(async user => {
			const userData = user.data();
			members.fetch(userData.id).then(guildMember => {
				leaderboard += `${place}. **${guildMember.user.username} :** ${userData.karma}\n`;
				place += 1;
			});
		});

		const embed = new Discord.MessageEmbed()
			.setTitle('Rank Leaderboard')
			.setDescription(leaderboard);

		if (message) return await message.channel.send(embed);
		return embed;
	}
}
