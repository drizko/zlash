module.exports = {
	// Best practice for the built-in help menu
	category: 'Z7',
	description: 'Are you trying to escape?',
	
	// For the correct usage of the command
	minArgs: 0,
	maxArgs: 0,
	
	// Invoked when the command is actually ran
	callback: ({ channel, message }) => {
		if (message) channel.send('ВЫ ДОЛЖНЫ БЕЖАТЬ ИЗ ТАРЬКА!');
		return 'ВЫ ДОЛЖНЫ БЕЖАТЬ ИЗ ТАРЬКА!';
	}
}