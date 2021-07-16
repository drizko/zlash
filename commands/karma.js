const fetch = require('node-fetch');
const { db } = require('../index')


module.exports = {
	category: 'Z7',
	description: 'Give or take away karma',
	name: 'karma',
	expectedArgs: '<User> <--|++> [reason]',
	minArgs: 2,
	maxArgs: 100,
	callback: async ({ message, channel, args }) => {
		let mention;
		let guildName;
		let action = args[1];
		// If it's a traditional command
		if (message) {
			mention = message.mentions.users.first();
			guildName = message.guild.name
			if (!mention) return channel.send('No user found')
			if (action !== '--' && action !== '++')  return channel.send('Invalid action use `++` or `--` after the mention')
		}
		// If it's a slash command
		else {
			mention = await fetch(`${process.env.DISCORD_URL}/users/${args[0]}`, { headers: { 'Authorization': 'Bot ' + process.env.TOKEN }})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(response);
			});
			guildName = channel.guild.name;
		}
		// if (message.author.id == mention.id && args[0] === '++') {
		// 	message.channel.send("Can't give karma to yourself");
		// 	return;
		// }
		const userRef = db.collection(guildName).doc(mention.id);
		const snapshot = await userRef.get();
		const data = snapshot.data();
		let karma = data && data.karma || 0;

		if (action === 'increment' || action === '++') {
			karma++;
		}
		else if (action === 'decrement' || action === '--') {
			karma--;
		}
		if (!data) {
			await userRef.set({
				karma,
				id: mention.id.toString(),
			});
		}
		else {
			await userRef.update({ karma });
		}
		
		const pointStr = karma === 1 ? 'point' : 'points';

		if (message) {
			return await channel.send(`<@${mention.id}> you now have ${karma} ${pointStr}`);
		}
		return `<@${mention.id}> you now have ${karma} ${pointStr}`
	}
}
