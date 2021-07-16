const { db } = require('../index')

module.exports = {
	category: 'Z7',
	description: 'Turn entrance music off / update link',
	name: 'entrance',
	expectedArgs: '<off | on> [youtube link]',
	minArgs: 1,
	maxArgs: 2,
	callback: async ({ message, args, member, guild }) => {
		let userRef;
		let userId;

		console.log(args);

		if (message) {
			userId = message.author.id;
			userRef = db.collection(message.guild.name).doc(userId);
		}
		else {
			userId = member.user.id;
			userRef = db.collection(guild.name).doc(userId);
		}
		const snapshot = await userRef.get();
		const data = snapshot.data();

		if (!data) {
			await userRef.set({
				id: userId.toString(),
			});
		}

		if (args[0] === "off") {
			await userRef.update({ entrance: false });
		}

		if (args[0] === "on") {
			await userRef.update({ entrance: true });
		}

		if(args[1]) {
			await userRef.update({ entranceUrl: args[1] });
		}

		if(message) return message.channel.send("Entrance settings updated");

		return "Entrance settings updated";
	}
}
