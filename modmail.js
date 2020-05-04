console.log('Loading. Please wait a moment.')
global.version = '5.1.0'

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require('fs');
const {
	MessageEmbed
} = require('discord.js')

const {	Prefix, 
		Token,

		DMCommand, 
		EnableIncomingMailCommand,
		DisableIncomingMailCommand,
		BlacklistCommand,
		WhitelistCommand,
		SetStatusCommand,
		highTrafficCommand,

		BotLog, 
		MessageLog, 
		RequirePermissons, 
		StaffRoleID,

		NoPermReply, 
		BootSuccessful, 
		DMRespondMessage,
	} = require('./config.json');

//Makes required files if not found
client.on('ready', () => {
	if (!fs.existsSync('./blacklist.txt')) {
		fs.writeFileSync('./blacklist.txt', 'dummy\n')
}
if (!fs.existsSync('./allow-incoming.config')) {
			fs.writeFileSync('./allow-incoming.config', 'allow')
	}
})

//Bootup check
client.once('ready', () => {
	console.log('Ready!');
	console.log('Version: '+version)
	fs.readFile('./allow-incoming.config', function(err, data){
		if(err)console.log(err)
		if (data == 'reject'){client.user.setStatus("dnd");const status = 'Mod Mail | Incoming disabled'}else{const status = 'Mod Mail | Incoming enabled'}
	})
	if(fs.existsSync('./statusmessage.config')){
		fs.readFile('./statusmessage.config', function(err, data){
		client.user.setActivity(data.toString(), { type: 'WATCHING' });
		})
	}
	var today = new Date();
	var date = today.getMonth()+1+'-'+(today.getDate())+'-'+today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	global.dateTime = date+' '+time;
	const StartupEmbed = new Discord.MessageEmbed()
		.setColor('#00FF00')
		.setTitle('Bot Started')
		.setDescription(`${BootSuccessful}`)
		.setTimestamp()
		.setFooter('Mod Mail | Version '+version)
		global.modlog = client.channels.cache.get(`${BotLog}`);
		modlog.send(StartupEmbed);
				//Check for updates
				const https = require('https');
				const file = fs.createWriteStream("version.txt"); 
				const request = https.get("https://techgeekgamer.github.io/Mod-Mail/latestversion.txt", function(response) {
					response.pipe(file);
					const changedfile = fs.createWriteStream("changelog.txt"); 
					const changedrequest = https.get("https://techgeekgamer.github.io/Mod-Mail/changelog.txt", function(changedresponse) {
						changedresponse.pipe(changedfile);
						fs.readFile('./changelog.txt', function(err, data){
							const changelog = data.toString()
							fs.readFile('./version.txt', function(err, data){
								const latestversion = data.toString().replace(/[\r\n]+/g, '');
						 			if(version != latestversion){
									const UpdateAvailableEmbed = new Discord.MessageEmbed()
									.setTitle('Update Available')
									.setColor('ffa500')
									.setDescription(`An update is available.\nLatest version: ${latestversion}\nYour version: ${version}`)
									.addField('Changelog',changelog,false)
									.setTimestamp()
									.setFooter('Mod Mail | Version '+version)
									modlog.send(UpdateAvailableEmbed);
									}
									try {
										fs.unlinkSync(`./version.txt`)
										fs.unlinkSync(`./changelog.txt`)
								  	} catch(err) {
										  console.error(err)
									  }
				})
			})
		})
	})								 
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
		if (message.content.startsWith(DMCommand)) return;
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
		if(data && data.toString().includes(message.author.id)){
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
			.setDescription('Your message was sent to the "'+ channel.guild.name+ '" server. '+DMRespondMessage)
			.addFields(
				
				{ name: 'Message ',
				value: messagecontent,inline: false },
				)
				.setTimestamp()
				.setFooter('Mod Mail | Version '+version)
			message.channel.send(MessageSentEmbed);
				 
			const MessageReceivedEmbed = new Discord.MessageEmbed()
				.setTitle('Message Received')
				.setDescription(`A message was received.`)
				.addFields(
					
					{ name: 'Sender', value: `<@${message.author.id}>`, inline: false },
					{ name: 'Sender Tag', value: message.author.tag, inline: false },
					{ name: 'Sender ID', value: message.author.id, inline: false },
					{ name: 'Message ', value: messagecontent, inline: false },
				)
				.setTimestamp()
				.setFooter('Mod Mail | Version '+version)
				channel.send(MessageReceivedEmbed);

			if (message.attachments.size != '0'){
				channel.send("Attachment was found. ", { files: [`${message.attachments.first().url}`] });
			}
			return;
		} else {
			message.reply('Message was cancelled.');
			return;
		}
		}).catch(collected => {
			message.reply('Message was cancelled due to no response.');
			return;
		});
		})})
	}
	}catch(err){console.log(err);return}
})

//Reply
client.on('message', message => {
	if (message.content.startsWith(`${Prefix}${DMCommand}`)){
	if (message.author.bot)return;
	if (message.channel.type == 'dm')return;
	if(RequirePermissons == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){
		}else{message.reply(NoPermReply);return;}
	}
	console.log('Not DMs')
		
	console.log('Command detected')
	const args = message.content.slice((Prefix+DMCommand).length).split(/ +/);
	console.log(args)
	args.join(' ')
	const mentionedmemnber = message.mentions.members.first()
		const newargs = args.filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg));
		const reply = newargs.join (' ')
		if(reply.length > '1024'){
			message.channel.send('Error: MessageEmbed field can\'t exceed 1024 characters.');
			message.channel.send('<@'+message.author.id+'>, your message can\'t exceed 1024 characters. Please shorten your message.');
			return
		}else{
			
		}
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
					mentionedmemnber.send(ReplyReceived).catch(err => {message.channel.send('Something went wrong and I was unable to direct message `'+mentionedmemnber.user.tag+'`. Please try again.');return})
					message.channel.send('Direct message was sent to `'+mentionedmemnber.user.tag+'`.\nMessage: '+reply)
				}catch(err){
					message.channel.send('Something went wrong and I was unable to direct message `'+mentionedmemnber.user.tag+'`. Please try again.');return;
			}
	}
})

//Disable Incoming
client.on('message', message => {
	if (message.content.startsWith(`${Prefix}${DisableIncomingMailCommand}`)){
		if (message.author.bot)return;
		if (message.channel.type == 'dm')return;
		if(RequirePermissons == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){

		}else{message.reply(NoPermReply);return;}
	}
		fs.writeFileSync('./allow-incoming.config', 'reject')
		client.user.setStatus("dnd");
		message.channel.send('Mod Mail is now disabled.')
		
}})

//Allow Incoming
	client.on('message', message => {
	if (message.content.startsWith(`${Prefix}${EnableIncomingMailCommand}`)){
		if (message.author.bot)return;
		if (message.channel.type == 'dm')return;
		if(RequirePermissons == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){

		}else{message.reply(NoPermReply);return;}
	}
		fs.writeFileSync('./allow-incoming.config', 'allow')
		client.user.setStatus("online");
		message.channel.send('Mod Mail is now enabled.')
		
}})

//Add to blacklist
client.on('message', message => {
	if (message.content.startsWith(`${Prefix}${BlacklistCommand}`)){
		if (message.author.bot)return;
		if (message.channel.type == 'dm')return;
		if(RequirePermissons == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){

		}else{message.reply(NoPermReply);return;}
	}
	fs.readFile('./blacklist.txt', function(err, data){
		if(data.includes (message.mentions.members.first().id)){message.channel.send(`This user is already on the blacklist.`);return;}else{
		fs.appendFile('./blacklist.txt', `${message.mentions.members.first().id}\n`, function(err,){})
		message.channel.send(`<@${message.mentions.members.first().id}> (${message.mentions.members.first().id}) was blacklisted of using <@${client.user.id}>. `)
		}
	})
}})

//Remove from blacklist
client.on('message', message => {
	if (message.content.startsWith(`${Prefix}${WhitelistCommand}`)){
		if (message.author.bot)return;
		if (message.channel.type == 'dm')return;
		if(RequirePermissons == true){
		if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){

		}else{message.reply(NoPermReply);return;}}
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
	if (!message.content.startsWith(`${Prefix}${SetStatusCommand}`))return;
	if (message.channel.type == 'dm')return;
	if(RequirePermissons == true){
	if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){}else{message.reply(NoPermReply);return;}}
	const args = message.content.slice((Prefix+SetStatusCommand).length).split(/ +/);
	const activity = args.join(' ')
	client.user.setActivity(activity, { type: 'WATCHING' });
	fs.writeFileSync('./statusmessage.config', activity, 'utf-8');
	message.channel.send('Bot activity set to `WATCHING'+activity+'`.')
})

//Check for updates - command
client.on('message', message => {
	if (message.author.bot)return;
	if (!message.content.startsWith(`${Prefix}updates`))return;
	const https = require('https');
	const file = fs.createWriteStream("version.txt");
	const request = https.get("https://techgeekgamer.github.io/Mod-Mail/latestversion.txt", function(response) {
		response.pipe(file);
		fs.readFile('./version.txt', function(err, data){
			const latestversion = data.toString().replace(/[\r\n]+/g, '');
			const changedfile = fs.createWriteStream("changelog.txt"); //https://techgeekgamer.github.io/Mod-Mail/changelog.txt
			const changedrequest = https.get("https://techgeekgamer.github.io/Mod-Mail/changelog.txt", function(changedresponse) {
			changedresponse.pipe(changedfile);
			fs.readFile('./changelog.txt', function(err, data){
			const changelog = data.toString()
			message.channel.send('You are currently using `'+version+'`. The latest is '+latestversion+'.')
			const UpdateEmbed = new Discord.MessageEmbed()
			UpdateEmbed.setTitle(`Changelog for ${latestversion}`)
			UpdateEmbed.setDescription(changelog)
			message.channel.send(UpdateEmbed)
	try {
		fs.unlinkSync(`./version.txt`)
		fs.unlinkSync(`./changelog.txt`)
	  } catch(err) {
		console.error(err)
	  }
	})
})
})
})
})

//Command: Reply that there might be a delay
client.on('message', message => {
	if (message.content.startsWith(`${Prefix}${highTrafficCommand}`)){
const args = message.content.slice((Prefix+highTrafficCommand).length).split(/ +/);
	console.log(args)
	args.join(' ')
	const mentionedmemnber = message.mentions.members.first()
		const newargs = args.filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg));
		const reply = newargs.join (' ')
		const BusyMommentEmbed = new Discord.MessageEmbed()
			BusyMommentEmbed.setTitle('Notice from server')
			BusyMommentEmbed.setColor('ffff00')
			if(reply == ''){
				BusyMommentEmbed.setDescription(`Hello <@${mentionedmemnber.id}>, please be aware that you may have a delay in response.\n\nReason: No reason provided.`)
			}else{
				BusyMommentEmbed.setDescription(`Hello <@${mentionedmemnber.id}>, please be aware that you may have a delay in response.\n\nReason: ${reply}`)
			}
			BusyMommentEmbed.setTimestamp()
			BusyMommentEmbed.setFooter('Mod Mail | Version '+version)
				try{
					mentionedmemnber.send(BusyMommentEmbed);
					console.log('Attempted to send.')}catch(err){console.log(err);message.channel.send('Something went wrong.')}
					message.channel.send('Busy reply sent to `'+mentionedmemnber.user.tag+'`.')
		}
})

//Help command (<prefix>help)
client.on('message', message => {
	if (message.author.bot)return;
	if (!message.content.startsWith(`${Prefix}help`))return;
	if (message.channel.type == 'dm')return;
	if(RequirePermissons == true){
	if (message.member.roles.cache.some(role => role.id === `${StaffRoleID}`)){}else{message.reply(NoPermReply);return;}}
	var helpmenu = []
	var helpmenuright = []
	var helpembed = new MessageEmbed()
	helpembed.setTitle(client.user.username + ' HELP MENU')
	helpmenu.push(`${Prefix}${DMCommand} @user`)
	helpmenu.push(`${Prefix}${DisableIncomingMailCommand}`)
	helpmenu.push(`${Prefix}${EnableIncomingMailCommand}`)
	helpmenu.push(`${Prefix}${BlacklistCommand} @user`)
	helpmenu.push(`${Prefix}${WhitelistCommand} @user`)
	helpmenu.push(`${Prefix}${SetStatusCommand} <text>`)
	helpmenu.push(`${Prefix}${highTrafficCommand} @user <reason>`)
	helpmenu.join('\n')

	helpmenuright.push('Replys to a user.')
	helpmenuright.push('Disables incoming DMs.')
	helpmenuright.push('Enable incoming DMs.')
	helpmenuright.push('Blocks the mentioned user from DMing.')
	helpmenuright.push('Allows the mentioned user to DM.')
	helpmenuright.push('Sets the bot\'s status.')
	helpmenuright.push('Lets a user know there may be a delay.')
	helpmenuright.join('\n')

	helpembed.addField('Commands', helpmenu,true)
	helpembed.addField('Info', helpmenuright,true)
	message.channel.send(helpembed)
})


//Login
client.login(Token)