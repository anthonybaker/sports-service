var Botkit = require('botkit');
var http = require('http');
var url = require('url');
var request = require('request');
//require('dotenv').config({silent: true});

var controller = Botkit.facebookbot({
	access_token: process.env.page_token,
	verify_token: process.env.verify_token,
	debug: true
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
	controller.createWebhookEndpoints(webserver, bot, function() {
		console.log('ONLINE!');
	});
});

controller.on('tick', function(bot, event) {
	// quiet debug warnings
	return;
});

controller.on('message_received', function(bot, message) {
	
	// if (message.text !== "hello") {
	// 	bot.say({
	// 			text: '(Echo) Text received: ' + message.text,
	// 			channel: message.user
	// 		});
	// }

	if (message.attachments) {
		setTimeout(function() {
			bot.say({
				text: 'It is a picture!',
				channel: message.user
			});
		}, 1200);

		setTimeout(function() {
			bot.say({
				text: 'Thanks, so nice of you to send me a picture',
				channel: message.user
			});
		}, 2000);

		setTimeout(function() {
			bot.say({
				text: 'I like it!',
				channel: message.user
			});
		}, 7000);

		setTimeout(function() {
			bot.reply(message, {
					attachment: {
							'type': 'template',
							'payload': {
									'template_type': 'generic',
									'elements': [
											{
													'title': 'Sports',
													'image_url': 'http://res.cloudinary.com/abakerp/image/upload/v1467377371/sports_01_b6gbfx.jpg',
											}
									]
							}
					}
			});
		}, 10000);
	}
});

// handle postbacks
controller.on('facebook_postback', function(bot, message) {

	switch(message.payload) {
		
	 }

});

// user said hello

controller.hears(['hello', 'hi', 'hey', 'Hi', 'Hello', 'Hey'], 'message_received', function(bot, message) {
	setTimeout(function() {
		bot.reply(message, {
			attachment: {
				'type': 'template',
				'payload': {
					'template_type': 'generic',
					'elements': [
						{
							'title': 'Welcome to Sports Service Bot',
							'image_url': 'http://res.cloudinary.com/abakerp/image/upload/v1467377371/sports_01_b6gbfx.jpg',
						}
					]
				}
			}
		});
	}, 2000);


	sendSportCatQuickReply(message.channel);
});

controller.hears(['Running'], 'message_received', function(bot, message) {
	bot.reply(message, {
		attachment: {
			'type': 'template',
			'payload': {
				'template_type': 'generic',
				'elements': [
					{
						'title': 'Running Program',
						'image_url': 'http://res.cloudinary.com/abakerp/image/upload/v1467377393/running_01_vxsw5r.jpg',
						'buttons': [
							{
								'type': 'web_url',
								'url': 'http://www.nike.com/gb/en_gb/c/running',
								'title': 'Nike Running'
							}
						]
					}
				]
			}
		}
	});
});

controller.hears(['Training'], 'message_received', function(bot, message) {
	bot.reply(message, {
		attachment: {
			'type': 'template',
			'payload': {
				'template_type': 'generic',
				'elements': [
					{
						'title': 'Training Program',
						'image_url': 'http://res.cloudinary.com/abakerp/image/upload/v1467377389/training_02_ml7ql4.jpg',
						'buttons': [
							{
								'type': 'web_url',
								'url': 'http://www.nike.com/gb/en_gb/c/training',
								'title': 'Nike Training'
							}
						]
					}
				]
			}
		}
	});
});


controller.hears(['Basketball'], 'message_received', function(bot, message) {
	bot.reply(message, {
		attachment: {
			'type': 'template',
			'payload': {
				'template_type': 'generic',
				'elements': [
					{
						'title': 'Basketball Program',
						'image_url': 'http://res.cloudinary.com/abakerp/image/upload/v1467377392/basketball_01_ajaclq.jpg',
						'buttons': [
							{
								'type': 'web_url',
								'url': 'http://www.nike.com/gb/en_gb/c/basketball',
								'title': 'Nike Training'
							}
						]
					}
				]
			}
		}
	});
});



// Function to produce Quick Replies (not currently supported by BotKit, so using FB standard call)

function sendSportCatQuickReply(sender) {
	console.log("sendSportCatQuickRepply method called. Trying to send request.");
	messageData = {
		"text":"Hey there! Great to see you here. Tell me, what's your game?",
	    "quick_replies":[
	    	{
	        	"content_type":"text",
	        	"title":"Running",
	        	"payload":"RUNNING_CAT"
	      	},
	     	{
	        	"content_type":"text",
	        	"title":"Training",
	        	"payload":"TRAINING_CAT"
	      	},
	      	{
	        	"content_type":"text",
	        	"title":"Basketball",
	        	"payload":"BASKETBALL_CAT"
	      	}
	    ]
	}
	request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:process.env.page_token},
	    method: 'POST',
	    json: {
	        recipient: {id:sender},
	        message: messageData,
	    }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
