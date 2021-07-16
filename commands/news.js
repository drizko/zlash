const fetch = require("node-fetch");
const Discord = require('discord.js');

module.exports = {
	// Best practice for the built-in help menu
	category: 'Z7',
	description: 'Get from hacker news',
	name: 'news',
	
	// For the correct usage of the command
	expectedArgs: '<String 1>',
	minArgs: 0,
	maxArgs: 50,
	hidden: false,
	
	// Invoked when the command is actually ran
	callback: async ({ channel, args }) => {
		let bestStoryId;
		if(args[0]) {
			let query = encodeURIComponent([...args]);
			await fetch(
				`https://hn.algolia.com/api/v1/search?query=${query}&hitsPerPage=2&page=0&tags=story`
				)
				.then((response) => {
					if (response.ok) {
					return response.json();
					}
					throw new Error(response);
				})
				.then((response) => {
					bestStoryId = response.hits[0].objectID || response.hits[0].story_id;
				})
				.catch(console.error);
		} else {
			await fetch('https://hacker-news.firebaseio.com/v0/beststories.json')
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error(response);
				})
				.then((response) => {
					bestStoryId = response[0];
				})
				.catch(console.error);
		}
		await fetch(
			`https://hacker-news.firebaseio.com/v0/item/${bestStoryId}.json`)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(response);
			})
			.then((response) => {
				const embed = new Discord.MessageEmbed()
					.setTitle(response.title)
					.setURL(response.url)
					.addFields({ name: 'HackerNews Score', value: response.score });
				return channel.send(embed);
			})
			.catch(console.error);
		return `User searched for "${[...args]}"`;
	}
  }