const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { nopermreply, BootSuccessful, DmRespondMessage} = require('./strings.json');
const {BotLog, MessageLog} = require('./info.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const { MessageEmbed } = require('discord.js')


//Bootup check
client.once('ready', () => {
	console.log('Ready!');
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
				global.modlog = client.channels.cache.get(`${BotLog}`);
				modlog.send(StartupEmbed);
				return;
				
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
		var today = new Date();
			var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
			var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			global.dateTime = date+' '+time;
		const messagecontent = message.content
		const channel = client.channels.cache.get(MessageLog);
		const MessageReceivedEmbed = new Discord.MessageEmbed()
			.setTitle('Message Received')
			.setDescription(`A message was received via direct messages.`)
			.addFields(
				{ name: 'Current date/time ', value: dateTime, inline: false },
				{ name: 'Sender', value: message.author.tag, inline: false },
				{ name: 'Sender ID', value: message.author.id, inline: false },
				{ name: 'Message ', value: messagecontent, inline: false },
			)
			.setTimestamp()
		channel.send(MessageReceivedEmbed);
		message.channel.send('Message was sent to the "'+ channel.guild.name+ '" server. '+DmRespondMessage)

	}

})

//Login
client.login(token);;
