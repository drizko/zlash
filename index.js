const Discord = require('discord.js')
const WOKCommands = require('wokcommands')
require('dotenv').config()
const admin = require('firebase-admin');
const serviceAccount = require('./z7-bot-db-auth.json');
const ytdl = require("ytdl-core-discord");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const guildId = '769360654083424257'
const client = new Discord.Client()
const db = admin.firestore();

client.on('ready', () => {
	new WOKCommands(client, {
		commandsDir: 'commands',
		testServers: [guildId],
		showWarns: true,
	})
	.setDefaultPrefix('zz ')
	.setCategorySettings([
		{
			name: 'Z7',
			emoji: '🎮'
		}
	]);
})

client.on("voiceStateUpdate", async (oldState, newState) => {
	const newUserChannel = newState.channel;
	const oldUserChannel = oldState.channel;

	if (oldUserChannel == undefined && newUserChannel !== undefined) {
		const userRef = db.collection(newState.guild.name).doc(newState.member.id);
		const snapshot = await userRef.get();
		const data = snapshot.data();
		const url = data && data.entranceUrl;
		if (url && ytdl.validateURL(url) && data.entrance) {
			newUserChannel
				.join()
				.then((connection) => {
					play(connection, url);
				})
				.catch((reject) => {
					console.error(reject);
				});
		}
	}
});

async function play(connection, url) {
	const seconds = new URL(url).searchParams.get('t') || 0;
	const milliseconds = Number(seconds) * 1000;
	connection.play(await ytdl(url, { begin: milliseconds }).catch(), {
		type: "opus",
	});
}

exports.db = db;
client.login(process.env.TOKEN)
