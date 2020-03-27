const fs = require('fs');
const Discord = require('discord.js');
const { DMcommand, token } = require('./config.json');
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
				.setFooter('Mod Mail')
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
	if (message.content.startsWith(DMcommand)) return;
		var today = new Date();
		var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		const messagecontent = message.content;
		const channel = client.channels.cache.get(MessageLog);
		global.dateTime = date+' '+time;
		if (message.content == ''){
				message.channel.send('Error: Message content can\'t be empty.');
				message.channel.send('<@'+message.author.id+'>, you must include some text in your message to send it.');
				return
			}
		if(message.content.length > '1024'){
				message.channel.send('Error: MessageEmbed field can\'t exceed 1024 characters.');
				message.channel.send('<@'+message.author.id+'>, your message can\'t exceed 1024 characters. Please shorten your message.');
				return
			}
		const MessageSentEmbed = new Discord.MessageEmbed()
			.setColor('008000')
			.setTitle('Message Sent')
			.setDescription('Your message was sent to the "'+ channel.guild.name+ '" server. '+DmRespondMessage)
			.addFields(
				{ name: 'Current date/time ',
				value: dateTime,
				inline: false },
				{ name: 'Message ',
				value: messagecontent,inline: false },
				)
				.setTimestamp()
				.setFooter('Mod Mail')
			message.channel.send(MessageSentEmbed);
				 
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

			if (message.attachments.size != '0'){
				channel.send("Attachments were found.", { files: [`${message.attachments.first().url}`] });
			}
	}

})

client.on('message', message => {
	if (message.content.startsWith(`${DMcommand}`)){
	if (message.author.bot)return;
	if (message.channel.type == 'dm')return;
	console.log('Not DMs')
	try{
	console.log('Command detected')
	const args = message.content.slice(DMcommand.length).split(/ +/);
	console.log(args)
	args.join(' ')
	const mentionedmemnber = message.mentions.members.first()
		const newargs = args.filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg));
		const reply = newargs.join (' ')
		const ReplyReceived = new Discord.MessageEmbed()
				.setTitle('Reply Received')
				.setDescription(`You have received a reply.`)
				.addFields(
					{ name: 'Message ', 
					value: reply, 
					inline: false },
				)
				.setTimestamp()
				try{
					mentionedmemnber.send(ReplyReceived);
					console.log('Attempted to send.')}catch(err){console.log(err)}
					message.channel.send('Direct message reply was sent to `'+mentionedmemnber.user.tag+'`.')
				}catch(err){message.channel.send('Something went wrong and I was unable to direct message `'+mentionedmemnber.user.tag+'`. Please try again.');return;}
}})
//Login
client.login(token);;