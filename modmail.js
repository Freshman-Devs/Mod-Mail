const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { nopermreply, BootSuccessful} = require('./strings.json');
const {BotLog} = require('./info.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

	
});

client.once('ready', () => {
	console.log('Ready!');
	
		const path = './runstate.txt'

		
		  if (fs.existsSync(path)) {
			//file exists
			var today = new Date();
			var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
			var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			global.dateTime = date+' '+time;
			const StartupEmbed = new Discord.MessageEmbed()
			.setColor('#ffa900')
			.setTitle('Bot Started - Issue Detected')
			.setDescription(`The bot loaded successfully, but didn't shutdown or restart correctly. Please make sure you shutdown or restart the bot correctly next time.`)
			.addFields(
				{ name: 'Current date/time: ', value: dateTime, inline: true },
			)
			.setTimestamp()
			.setFooter('Bot written by Daniel C');
			global.modlog = client.channels.cache.get(`${BotLog}`);
			modlog.send(StartupEmbed);
			return
		  }else{
		  var today = new Date();
				var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				global.dateTime = date+' '+time;
				const StartupEmbed = new Discord.MessageEmbed()
				.setColor('#00FF00')
				.setTitle('Bot Started')
				.setDescription(`${BootSuccessful}`)
				.addFields(
					{ name: 'Current date/time: ', value: dateTime, inline: true },
				)
				.setTimestamp()
				.setFooter('Bot written by Daniel C');
				global.modlog = client.channels.cache.get(`${BotLog}`);
				modlog.send(StartupEmbed);
				fs.writeFileSync('./runstate.txt', 'running')
				return;
				}
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

//Error
client.on('error', error => {
	console.error('an error has occured', error);

});


//Check for direct messages
client.on('message', message => {
	if (message.author.bot) return;
	if (message.channel.type == "dm") {
		if (message.content.startsWith(prefix)) return;
		const messagecontent = message.content
		const channel = client.channels.cache.get(``);
		channel.send(messagecontent);

	}

})

//Login
client.login(token);;
