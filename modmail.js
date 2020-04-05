const fs = require('fs');
const Discord = require('discord.js');
const {prefix, DMcommand, token, EnableIncomingMailCommand, DisableIncomingMailCommand, BlacklistCommand, WhitelistCommand,SetStatusCommand} = require('./config.json');
const { nopermreply, BootSuccessful, DmRespondMessage} = require('./strings.json');
const {BotLog, MessageLog, RequirePermissonsToUseDmCommand, StaffRoleID} = require('./info.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const { MessageEmbed } = require('discord.js')
global.version = 'DEBUG 3.0.0'

//Bootup check
client.once('ready', () => {
	console.log('Ready!');
	console.log('Version: '+version)
	fs.readFile('./allow-incoming.config', function(err, data){
		if(err)console.log(err)
		if (data == 'reject'){client.user.setStatus("dnd");const status = 'Mod Mail | Incoming disabled'}else{const status = 'Mod Mail | Incoming enabled'}
	})
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
				.setFooter('Mod Mail | Version '+version)
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
	try{
	if (message.author.bot) return;
	if (message.channel.type == "dm") {
	if (message.content.startsWith(DMcommand)) return;
	const messagecontent = message.content;
	const channel = client.channels.cache.get(MessageLog);
	if (message.content == ''){
		message.channel.send('Error: Message content can\'t be empty.');
		message.channel.send('<@'+message.author.id+'>, you must include some text in your message to send it.');
		return
	}
	
	//Checks if on blacklist
	fs.readFile('./blacklist.txt', function(err, data){
		const blacklistdata = data
		if(data.includes (message.author.id)){
		const MessageIncomingRejectedBlacklisted = new Discord.MessageEmbed()
			.setColor('ff0000')
			.setTitle('Message Rejected')
			.setDescription(`Sorry <@${message.author.id}>, you have been blacklisted of using <@${client.user.id}>. Please try again later or contact server staff.`)
			.addFields(
				{ name: 'Message ',
				value: message.content,
				inline: false },
				)
				.setTimestamp()
				.setFooter('Mod Mail | Version '+version)
			message.channel.send(MessageIncomingRejectedBlacklisted);
			return;
		}
	//Checks if Mod Mail is enabled.
	fs.readFile('./allow-incoming.config', function(err, data){
		if(err)console.log(err)
	
		if (data == 'reject'){
		const MessageIncomingRejected = new Discord.MessageEmbed()
			.setColor('ff0000')
			.setTitle('Message Rejected')
			.setDescription('Sorry, "'+ channel.guild.name+ '" is currently not accepting Mod Mail at the moment. Please try again later.')
			.addFields(
				{ name: 'Message ',
				value: message.content,
				inline: false },
				)
				.setTimestamp()
				.setFooter('Mod Mail | Version '+version)
		message.channel.send(MessageIncomingRejected);return;}
		//Manages requirements
		var today = new Date();
		var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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
			//Checks before sending
			message.react('✅').then(() => message.react('❌'));
			message.channel.send('Are you sure you want to send your message?')

	const filter = (reaction, user) => {
	return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
	};

	message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
	.then(collected => {
		const reaction = collected.first();

		if (reaction.emoji.name === '✅') {
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
				.setFooter('Mod Mail | Version '+version)
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
				.setFooter('Mod Mail | Version '+version)
				channel.send(MessageReceivedEmbed);

			if (message.attachments.size != '0'){
				channel.send("Attachments were found.", { files: [`${message.attachments.first().url}`] });
			}
			return;
		} else {
			message.reply('Message was cancelled.');
			return;
		}
		})
		.catch(collected => {
			message.reply('Message was cancelled due to no response.');
			return;
		});
		})})
	}
	}catch(err){console.log(err);return}
})

//Reply
client.on('message', message => {
	if (message.content.startsWith(`${prefix}${DMcommand}`)){
	if (message.author.bot)return;
	if (message.channel.type == 'dm')return;
	if(RequirePermissonsToUseDmCommand == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){
			
		}else{message.reply(nopermreply);return;}
	}
	console.log('Not DMs')
	try{
	console.log('Command detected')
	const args = message.content.slice((prefix+DMcommand).length).split(/ +/);
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
				.setFooter('Mod Mail | Version '+version)
				try{
					mentionedmemnber.send(ReplyReceived);
					console.log('Attempted to send.')}catch(err){console.log(err)}
					message.channel.send('Direct message reply was sent to `'+mentionedmemnber.user.tag+'`.')
				}catch(err){message.channel.send('Something went wrong and I was unable to direct message `'+mentionedmemnber.user.tag+'`. Please try again.');return;}
}})

//Disable Incoming
client.on('message', message => {
	if (message.content.startsWith(`${prefix}${DisableIncomingMailCommand}`)){
		if (message.author.bot)return;
		if (message.channel.type == 'dm')return;
		if(RequirePermissonsToUseDmCommand == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){

		}else{message.reply(nopermreply);return;}
	}
		fs.writeFileSync('./allow-incoming.config', 'reject')
		client.user.setStatus("dnd");
		message.channel.send('Mod Mail is now disabled.')
		
	}})

//Allow Incoming
	client.on('message', message => {
	if (message.content.startsWith(`${prefix}${EnableIncomingMailCommand}`)){
		if (message.author.bot)return;
		if (message.channel.type == 'dm')return;
		if(RequirePermissonsToUseDmCommand == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){

		}else{message.reply(nopermreply);return;}
	}
		fs.writeFileSync('./allow-incoming.config', 'allow')
		client.user.setStatus("online");
		message.channel.send('Mod Mail is now enabled.')
		
	}})

//Add to blacklist
client.on('message', message => {
	if (message.content.startsWith(`${prefix}${BlacklistCommand}`)){
		if (message.author.bot)return;
		if (message.channel.type == 'dm')return;
		if(RequirePermissonsToUseDmCommand == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){

		}else{message.reply(nopermreply);return;}
	}
	fs.readFile('./blacklist.txt', function(err, data){
		if(data.includes (message.mentions.members.first().id)){message.channel.send(`This user is already on the blacklist.`);return;}else
		{
		fs.appendFile('./blacklist.txt', `${message.mentions.members.first().id}\n`, function(err,){})
		message.channel.send(`<@${message.mentions.members.first().id}> (${message.mentions.members.first().id}) was blacklisted of using <@${client.user.id}>. `)
		}
	})
	}})

//Remove from blacklist
client.on('message', message => {
	if (message.content.startsWith(`${prefix}${WhitelistCommand}`)){
		if (message.author.bot)return;
		if (message.channel.type == 'dm')return;
		if(RequirePermissonsToUseDmCommand == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){

		}else{message.reply(nopermreply);return;}}
	fs.readFile('./blacklist.txt', function(err, data){
		var data = fs.readFileSync('./blacklist.txt', 'utf-8');
		if(!data.includes(message.mentions.members.first().id)){message.channel.send('User not found on the blacklist.');return}else{message.channel.send('User is now whitelisted.');}
		var valuetoremove = message.mentions.members.first().id;
		var newValue = data.replace((valuetoremove), '');
		fs.writeFileSync('./blacklist.txt', newValue, 'utf-8');
	})}
	})

//Sets bot status
client.on('message', message => {
	if (message.author.bot)return;
	if (!message.content.startsWith(`${prefix}${SetStatusCommand}`))return;
	if (message.channel.type == 'dm')return;
	if(RequirePermissonsToUseDmCommand == true){
	if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){}else{message.reply(nopermreply);return;}}
	const args = message.content.slice((prefix+SetStatusCommand).length).split(/ +/);
	const activity = args.join(' ')
	client.user.setActivity(activity, { type: 'WATCHING' });
	fs.writeFileSync('./statusmessage.config', activity, 'utf-8');
	message.channel.send('Bot activity set to `WATCHING '+activity+'`.')
})

//Login
client.login(token);

//const args = message.content.slice((prefix+DMcommand).length).split(/ +/);