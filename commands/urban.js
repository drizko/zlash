const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
	category: 'Z7',
	description: 'Search urbandictionary.com',
	name: 'urban',
	expectedArgs: '<Search query>',
	minArgs: 1,
	maxArgs: 100,
	callback: async ({ message, channel, args }) => {
		const query = args.join(' ')
		const queryURIEncoded = encodeURIComponent(query)
		const url = `https://api.urbandictionary.com/v0/define?term=${queryURIEncoded}`
		const result = await fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json()
				}
				throw new Error(response)
			})
			.then((response) => {
				// used for formatting definitions and examples to match urban dictionary format
				function replacer(match, p1, p2, p3, offset, string) {
					// p1 is nondigits, p2 digits, and p3 non-alphanumerics
					const term = match.slice(1, -1)
					const termURIEncoded = encodeURIComponent(term)
					return `[${term}](https://www.urbandictionary.com/define.php?term=${termURIEncoded})`;
				}

				// check if no results were found
				const isEmpty = response.list.length === 0
				if (isEmpty) {
					return `No results found for "${query}"`;
				}

				// construct the discord message embed
				const topResult = response.list.reduce((prev, current) => (prev.thumbs_up > current.thumbs_up) ? prev : current)
				const definition = topResult.definition
				const formattedDefinition = definition.replace(/\[(.*?)\]/g, replacer)
				const example = topResult.example
				const formattedExample = example.replace(/\[(.*?)\]/g, replacer)
				const link = topResult.permalink

				const title = topResult.word
				const description = formattedDefinition
		
				const embed = new Discord.MessageEmbed()
					.setColor('#efff00')
					.setTitle(title)
					.setDescription(description || 'blank description')
					.setURL(link)
					.addFields({
						name: 'examples',
						value: formattedExample || 'There are no examples to display'
					})

				return embed;
			})
			.catch(error => {
				console.error(error);
				return error;
			});

		if (message) return channel.send(result);
		return result
	}
}



