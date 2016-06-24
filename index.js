var Botkit = require('botkit');
var http = require('http');
var url = require('url');
var request = require('request');
require('dotenv').config({silent: true});

var controller = Botkit.facebookbot({
	access_token: process.env.TOKEN,
	verify_token: process.env.VERIFY,
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
	if (message.attachments) {
		setTimeout(function() {
			bot.say({
				text: 'It’s oregano!',
				channel: message.user
			});
		}, 1200);

		setTimeout(function() {
			bot.say({
				text: 'Oregano is actually a member of the mint family. Who knew?',
				channel: message.user
			});
		}, 2000);

		setTimeout(function() {
			bot.say({
				text: 'It’s used a lot in Mediterranean and Italian cuisine.',
				channel: message.user
			});
		}, 4000);

		setTimeout(function() {
			bot.say({
				text: 'Think Greek Salad, pizzas, and dry rubs for grilling, just for starters.',
				channel: message.user
			});
		}, 6000);

		setTimeout(function() {
			bot.say({
				text: 'It’s fantastic with Red Pepper, Lemon and Mint.',
				channel: message.user
			});
		}, 8000);

		setTimeout(function() {
			bot.reply(message, {
					attachment: {
							'type': 'template',
							'payload': {
									'template_type': 'generic',
									'elements': [
											{
													'title': 'Oregano Leaves',
													'image_url': 'http://bit.ly/1Pq3PLR',
													'buttons': [
																{
																		'type': 'web_url',
																		'url': 'http://www.mccormick.com/Spices-and-Flavors/Herbs-and-Spices/Spices/Oregano-Leaves',
																		'title': 'Learn about oregano'
																},
																{
																		'type': 'web_url',
																		'url': 'http://www.mccormick.com/Search?qs=oregano&src=mccormick,gourmet,grill-mates,lawrys,zatarains&t=recipe&skip=0&take=24',
																		'title': 'See some recipes'
																}
														]
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
		case 'COOK':
			bot.reply(message, {
				"attachment":{
					"type":"template",
					"payload":{
					"template_type":"button",
					"text":"Who are you cooking for?",
					"buttons":[
						{
							"type":"postback",
							"payload":"clue1",
							"title":"For myself"
						},
						{
							"type":"postback",
							"payload":"COOK_OTHERS",
							"title":"For others"
						},
						{
							"type":"postback",
							"payload":"SEASONAL",
							"title":"Something seasonal"
						}
					]
					}
				}
			});
			break;
		case 'SEASONAL':
			bot.say({
				text: 'Long weekends call for sunshine, brews and these five recipes.',
				channel: message.user
			});

			setTimeout(function() {
				seasonalCarrousel(message);
			}, 2000);
			break;

		case 'COOK_OTHERS':
			askFlavor = function(response, convo) {
				convo.ask('Okay. Got anything in mind?', function(response, convo) {
					askRestrictions(response, convo);
					convo.next();
				});
			};

			startCooking = function(response, convo) {
				convo.say('Okay, let\'s figure out what to make');

				setTimeout(function() {
					bot.say({
						text: 'Tell me if you like any of these recipes.',
						channel: message.user
					});

				}, 2200);

				setTimeout(function() {
					showRecipesCarousel(message);
				}, 3000);
			};

			askRestrictions = function(response, convo) {
				convo.ask('Any dietary restrictions? Type something like "low sodium" or "gluten-free".',[
					{
						pattern: bot.utterances.yes,
						callback: function(response,convo) {
							convo.say('What are they?');
							// do something else...
							convo.next();
						}
					},
					{
						pattern: bot.utterances.no,
						callback: function(response,convo) {
							// convo.say('Perhaps later.');
							startCooking(response, convo);
							convo.next();
						}
					},
					{
					// pattern: new RegExp(/^[a-zA-Z\s]*$/),
					pattern: new RegExp(/(?:)/),
					callback: function(response,convo) {
						convo.say(response.text+'. No problem. We\'ve got this.');
						startCooking(response, convo);
						convo.next();
					}
				}

				]);
			};
			bot.startConversation(message, askFlavor);

			break;

		case 'SPICE':
			bot.startConversation(message,function(err,convo) {
				convo.ask('Flavor is my specialty! What kind of dish would you like to add flavor to?',function(response,convo) {
					// convo.say('Cool, you said: ' + response.text);
					bot.reply(message, {
						"attachment":{
							"type":"template",
							"payload":{
							"template_type":"button",
							"text":"And what kinds of flavors are you in the mood for?",
							"buttons":[
								{
									"type":"postback",
									"payload":"KEEP_SIMPLE",
									"title":"Keep it simple"
								},
								{
									"type":"postback",
									"payload":"ADVENTUROUS",
									"title":"Let’s get adventurous"
								},
								{
									"type":"postback",
									"payload":"HOT",
									"title":"Hot hot hot!"
								}
							]
							}
						}
					});
					convo.next();
				});
			});

			break;

		case 'KEEP_SIMPLE':
			bot.reply(message, {
				"attachment":{
					"type":"template",
					"payload":{
					"template_type":"button",
					"text":"McCormick® Grill Mates® Roasted Garlic & Herb Seasoning and olive oil are great for grilled vegetables.",
					"buttons":[
						{
							"type":"postback",
							"payload":"TELL_MORE",
							"title":"Tell me more"
						},
						{
							"type":"postback",
							"payload":"NEXT_TIP",
							"title":"Next tip"
						},
						{
							"type":"postback",
							"payload":"SHOW_RECIPE",
							"title":"What about recipes?"
						}
					]
					}
				}
			});
			break;

		case 'SHOW_RECIPE':
			bot.say({
				text: 'Here are some tips and recipes to make a great vegetarian barbecue..',
				channel: message.user
			});

			seasonalCarrousel(message);
			break;

		case 'GLADHELP':
			bot.say({
				text: 'Glad I could help. Your barbecue will be awesome!',
				channel: message.user
			});
		break;

		case 'BUY':
			bot.startConversation(message,function(err,convo) {
				convo.ask('If you know what you’d like to buy, you can type it in, or choose from these options.',function(response,convo) {
					// convo.say('Cool, you said: ' + );
					convo.say('Here are our two most popular '+response.text+' products.');
					setTimeout(function() {
						showOreganoCarousel(message);
					}, 2500);
					convo.next();
				});
			});

			setTimeout(function() {
				seasonalCarrousel(message);
			}, 2000);
			break;

		case 'BUY_OREGANO':
			bot.say({
				text: ' Our classic oregano leaves are sweeter, while Mexican oregano leaves are stronger in flavor.',
				channel: message.user
			});

			setTimeout(function() {
				bot.reply(message, {
					"attachment":{
						"type":"template",
						"payload":{
						"template_type":"button",
						"text":"We also have 95 more oregano-related products to discover!",
						"buttons":[
							{
								"type":"postback",
								"payload":"CONFIRMATION",
								"title":"Show me!"
							}
						]
						}
					}
				});
			}, 2000);
			break;

		case 'CONFIRMATION':
			bot.reply(message, {
				"attachment":{
					"type":"template",
					"payload":{
					"template_type":"button",
					"text":"You’re all set. Your order will arrive at your address in New York, NY, in two hours.",
					"buttons":[
						{
							"type":"postback",
							"payload":"ALLGOOD",
							"title":"All good"
						},
						{
							"type":"postback",
							"payload":"CHANGE",
							"title":"Change this!"
						}
					]
					}
				}
			});
			break;

		case 'ALLGOOD':
			bot.say({
				text: 'Glad I could help. Hope the barbecue goes well!',
				channel: message.user
			});
			break;

		// case 'LIKE_RECIPE':
		// 	bot.say({
		// 		text: 'Great! And what kind of flavors are you looking for?',
		// 		channel: message.user
		// 	});
		// 	setTimeout(function() {
		// 		showFlavorsCarousel(message)
		// 	}, 2000);
		// 	break;

		case 'LIKE_RECIPE':
			bot.say({
				text: 'You\'ve got good taste. Here\'s a menu idea for you based on what I know so far.',
				channel: message.user
			});

			setTimeout(function () {
				bot.say({
					text: 'Go ahead and change it up. Swipe right to keep a recipe and left to ditch it.',
					channel: message.user
				});
			}, 2000);
			setTimeout(function() {
				bot.reply(message, {
					attachment: {
							'type': 'template',
							'payload': {
									'template_type': 'generic',
									'elements': [
											{
													'title': 'Your FlavorList',
													'image_url': 'http://i.imgur.com/d7N0CGt.jpg',
													'buttons': [
																{
																		'type': 'web_url',
																		'url': 'http://mkc-os.rgadev.com/flavor-studio/flavorlist.html',
																		'title': 'See the recipes'
																}
														]
											}
									]
							}
					}
				});
			}, 3500);

			setTimeout(function() {
				bot.reply(message, {
					"attachment":{
						"type":"template",
						"payload":{
						"template_type":"button",
						"text":"Whoa. Your menu’s looking hot. Want to show it off? Here’s the link.",
						"buttons":[
							{
								"type":"web_url",
								"url":"http://mkc-os.rgadev.com/flavor-studio/flavorlist.html",
								"title":"Copy link"
							}
						]
						}
					}
				});
			}, 30000);
			break;

		case 'LIKE_BBQ':
			bot.say({
				text: 'I know, right? Looks delish. I’ll add it to your barbecue menu.',
				channel: message.user
			});

			setTimeout(function() {
				showMenu(message);
			}, 1500);

			setTimeout(function() {
				bot.reply(message, {
					attachment:{
					"type":"template",
					"payload":{
						"template_type":"button",
						"text":"So? How’d we do?",
						"buttons":[
							{
								"type":"postback",
								"title":"Looks good",
								"payload":"GLADHELP"
							},
							{
								"type":"postback",
								"title":"Undo the dairy-free",
								"payload":"GLADHELP"
							}
						]
					}
				}
			});
		}, 25000);

			setTimeout(function() {
				bot.say({
					text: 'Hey! So how was the barbecue?',
					channel: message.user
				});

				bot.reply(message, {
					attachment:{
					"type":"template",
					"payload":{
						"template_type":"button",
						"text":"You should show off what you did.",
						"buttons":[
							{
								"type":"web_url",
								"url":"http://mkc-os.rgadev.com/flavor-studio/flavorlist-2.html",
								"title":"Copy link"
							}
						]
					}
				}
			});
			}, 60000);

			break;

	 }

});

// user said hello

controller.hears(['hello', 'hi', 'hey', 'Hi', 'Hello', 'Hey'], 'message_received', function(bot, message) {
		bot.reply(message, {
			attachment:{
			"type":"template",
			"payload":{
				"template_type":"button",
				"text":"Hey! What should we do today?",
				"buttons":[
					{
						"type":"postback",
						"title":"Decide what to cook",
						"payload":"COOK_OTHERS"
					},
					{
						"type":"postback",
						"title":"Spice up a dish",
						"payload":"SPICE"
					}
					// {
					// 	"type":"postback",
					// 	"title":"Buy a McCormick product",
					// 	"payload":"BUY"
					// }
				]
			}
		}
	});
});

controller.hears(['dairy-free', ' dairy free'], 'message_received', function(bot, message){
	bot.say({
		text: 'Dairy-free? No worries. Let’s see what we’ve got',
		channel: message
	});

	bot.startConversation(message,function(err,convo) {

	   convo.ask('Is this for the barbecue?',[
	     {
	       pattern: bot.utterances.yes,
	       callback: function(response,convo) {
	         convo.say('Cool. Here are some dairy-free desserts people like for barbecues.');

					 setTimeout(function () {
						// 	convo.say('Let me know if you see one you like.');
						bot.say({
							text: 'Let me know if you see one you like.',
							channel: message.user
						});
					 }, 2000);
	         setTimeout(function () {
	         	showBarbecueCarousel(message);
					}, 3000);
	         convo.next();
	       }
	     },
	     {
	       pattern: bot.utterances.no,
	       callback: function(response,convo) {
	         convo.say('Perhaps later.');
	         // do something else...
	         convo.next();
	       }
	     },
	     {
	       default: true,
	       callback: function(response,convo) {
	         // just repeat the question
	         convo.repeat();
	         convo.next();
	       }
	     }
	   ]);
	 });
});


function seasonalCarrousel(message) {
	bot.reply(message, {
			attachment: {
					'type': 'template',
					'payload': {
							'template_type': 'generic',
							'elements': [
									{
											'title': 'Hermione and Ron destroy a Horcrux',
											'image_url': 'http://bit.ly/1RPGEop',
											'subtitle': '\'So we\'re another Horcrux down\' said Ron...'
									},
									{
											'title': 'Ravenclaw’s diadem is destroyed by Fiendfyre',
											'image_url': 'http://bit.ly/1RPGEop',
											'subtitle': '\'A blood-like substance, dark and tarry, seemed to be leaking from the diadem.\''
									},
									{
											'title': 'Snape gives Harry memories of his childhood',
											'image_url': 'http://bit.ly/1RPGEop',
											'subtitle': '\'You are,\' said Snape to Lily. \'You are a witch. I\'ve been watching you for a while.\''
									},
									{
											'title': 'Hermione and Ron destroy a Horcrux',
											'image_url': 'http://bit.ly/1RPGEop',
											'subtitle': '\'With a single stroke, Neville sliced off the great snake\'s head...\''
									},
									{
											'title': 'Hermione and Ron destroy a Horcrux',
											'image_url': 'http://bit.ly/1RPGEop',
											'subtitle': '\'Voldemort was dead, killed by his own rebounding curse...\'',
											'buttons': [
														{
																'type': 'postback',
																'payload': 'exit_carousel',
																'title': 'Gotcha'
														}
												]
									}
							]
					}
			}
	});
}

function showOreganoCarousel(message) {
	bot.reply(message, {
			attachment: {
					'type': 'template',
					'payload': {
							'template_type': 'generic',
							'elements': [
									{
											'title': 'Oregano Leaves',
											'image_url': 'http://bit.ly/1RPGEop',
											'buttons': [
														{
																'type': 'postback',
																'payload': 'BUY_OREGANO',
																'title': 'Buy'
														}
												]
									},
									{
											'title': 'Oregano Leaves',
											'image_url': 'http://bit.ly/1RPGEop',
											'buttons': [
														{
																'type': 'postback',
																'payload': 'BUY_OREGANO',
																'title': 'Buy'
														}
												]
									},
									{
											'title': 'Oregano Leaves',
											'image_url': 'http://bit.ly/1RPGEop',
											'buttons': [
														{
																'type': 'postback',
																'payload': 'BUY_OREGANO',
																'title': 'Buy'
														}
												]
									}
							]
					}
			}
	});
}

function showRecipesCarousel(message) {
	bot.reply(message, {
			attachment: {
					'type': 'template',
					'payload': {
							'template_type': 'generic',
							'elements': [
									{
											'title': 'Grilled Romaine & Vegetable Salad with Balsamic Herb Vinaigrette',
											'image_url': 'http://bit.ly/1UlPk7V',
											'buttons': [
														{
																'type': 'web_url',
																'url': 'http://www.mccormick.com/Recipes/Salads-Sides/Grilled-Romaine-and-Vegetable-Salad-with-Balsamic-Herb-Vinaigrette',
																'title': 'View recipe'
														},

														{
																'type': 'postback',
																'payload': 'LIKE_RECIPE',
																'title': 'This one looks good'
														}
												]
									},
									{
											'title': 'Zesty Herb Grilled Vegetables',
											'image_url': 'http://d1doqjmisr497k.cloudfront.net/~/media/Recipe-Photos/McCormick/Salads-Sides/787x426/Zesty_Herb_Grilled_Vegetables_Recipes_787x426.ashx?vd=20150603T020044Z&hash=D62097F12D10CD8E250CD41B2EE342AB24E9BAA9',
											'buttons': [
														{
																'type': 'web_url',
																'url': 'http://www.mccormick.com/Grill-Mates/Recipes/Salads-Sides/Zesty-Herb-Grilled-Vegetables',
																'title': 'View recipe'
														},
														{
																'type': 'postback',
																'payload': 'LIKE_RECIPE',
																'title': 'This one looks good'
														}
												]
									},
									{
											'title': 'Grilled Potato Kabobs',
											'image_url': 'http://d1doqjmisr497k.cloudfront.net/~/media/Recipe-Photos/McCormick/Salads-Sides/787x426/Grilled-Potato-Kabobs_Recipes_787x426.ashx?vd=20150603T020017Z&hash=2BC9FE797FD48725F22F029CB946617C95CF1270',
											'buttons': [
														{
																'type': 'web_url',
																'url': 'http://www.mccormick.com/Grill-Mates/Recipes/Salads-Sides/Grilled-Potato-Kabobs',
																'title': 'View recipe'
														},
														{
																'type': 'postback',
																'payload': 'LIKE_RECIPE',
																'title': 'This one looks good'
														}
												]
									},
									{
											'title': 'Grilled Corn on the Cob with Mesquite Cilantro Butter',
											'image_url': 'http://d1doqjmisr497k.cloudfront.net/~/media/Recipe-Photos/McCormick/Flavor-Forecast-2014/Grilled-Corn-on-the-Cob-with-Mesquite-Cilantro-Butter_Recipes_787x426.ashx?vd=20150603T012002Z&hash=D23D96748BB50809CB6E0C0BA391CD4B5B168356',
											'buttons': [
														{
																'type': 'web_url',
																'url': 'http://www.mccormick.com/Grill-Mates/Recipes/Salads-Sides/Grilled-Corn-on-the-Cob-with-Mesquite-Cilantro-Butter',
																'title': 'View recipe'
														},
														{
																'type': 'postback',
																'payload': 'LIKE_RECIPE',
																'title': 'This one looks good'
														}
												]
									}
							]
					}
			}
	});
}

function showFlavorsCarousel(message) {
	bot.reply(message, {
			attachment: {
					'type': 'template',
					'payload': {
							'template_type': 'generic',
							'elements': [
									{
											'title': 'Smoky',
											'image_url': 'http://bit.ly/1RPGEop',
											'buttons': [
														{
																'type': 'postback',
																'payload': 'LIKE_FLAVOR',
																'title': 'This sounds good'
														}
												]
									},
									{
											'title': 'Smoky',
											'image_url': 'http://bit.ly/1RPGEop',
											'buttons': [
														{
																'type': 'postback',
																'payload': 'LIKE_FLAVOR',
																'title': 'This sounds good'
														}
												]
									},
									{
											'title': 'Smoky',
											'image_url': 'http://bit.ly/1RPGEop',
											'buttons': [
														{
																'type': 'postback',
																'payload': 'LIKE_FLAVOR',
																'title': 'This sounds good'
														}
												]
									}
							]
					}
			}
	});
}

function showBarbecueCarousel(message) {
	bot.reply(message, {
			attachment: {
					'type': 'template',
					'payload': {
							'template_type': 'generic',
							'elements': [
									{
											'title': 'Mango Blueberry Cobbler',
											'image_url': 'http://d1doqjmisr497k.cloudfront.net/~/media/Recipe-Photos/McCormick/Dessert/787x426/Mango-Blueberry-Cobbler.ashx?vd=20130326T190332Z&hash=3F937989C3C98E671D9EA629793837083EDE9E97',
											'buttons': [
														{
																'type': 'web_url',
																'url': 'http://www.mccormick.com/Recipes/Dessert/Mango-Blueberry-Cobbler',
																'title': 'View recipe'
														},
														{
																'type': 'postback',
																'payload': 'LIKE_BBQ',
																'title': 'I like this one'
														}
												]
									},
									{
											'title': 'Peach Blueberry Crisp',
											'image_url': 'http://d1doqjmisr497k.cloudfront.net/~/media/Recipe-Photos/McCormick/Dessert/787x426/Peach-Blueberry-Crisp.ashx?vd=20130326T190412Z&hash=E984DD9941F4D49BF15016BC942C05F962A50A33',
											'buttons': [
														{
																'type': 'web_url',
																'url': 'http://www.mccormick.com/Recipes/Dessert/Peach-Blueberry-Crisp',
																'title': 'View recipe'
														},
														{
																'type': 'postback',
																'payload': 'LIKE_BBQ',
																'title': 'I like this one'
														}
												]
									},
									{
											'title': 'Easy Blue Raspberry Shaved Ice',
											'image_url': 'http://d1doqjmisr497k.cloudfront.net/~/media/Recipe-Photos/McCormick/Dessert/787x426/Easy-Blue-Raspberry-Shaved-Ice_Recipe_787x426.ashx?vd=20150603T011643Z&hash=1694E7E66D5F0FC1C6F3077468B887159175C606',
											'buttons': [
														{
																'type': 'web_url',
																'url': 'http://www.mccormick.com/Recipes/Dessert/Easy-Blue-Raspberry-Shaved-Ice',
																'title': 'View recipe'
														},
														{
																'type': 'postback',
																'payload': 'LIKE_BBQ',
																'title': 'I like this one'
														}
												]
									},
									{
											'title': 'Strawberry Lemonade Frozen Pops',
											'image_url': 'http://d1doqjmisr497k.cloudfront.net/~/media/Recipe-Photos/McCormick/Dessert/787x426/Strawberry-Lemonade-Frozen-Pops_787x426.ashx?vd=20150603T011711Z&hash=5D5E9760721955A63705EA61A889FEA7CA0719BE',
											'buttons': [
														{
																'type': 'web_url',
																'url': 'http://www.mccormick.com/Recipes/Dessert/Strawberry-Lemonade-Frozen-Pops',
																'title': 'View recipe'
														},
														{
																'type': 'postback',
																'payload': 'LIKE_BBQ',
																'title': 'I like this one'
														}
												]
									}
							]
					}
			}
	});
}

function showMenu(message) {
		bot.reply(message, {
			attachment: {
					'type': 'template',
					'payload': {
							'template_type': 'generic',
							'elements': [
									{
											'title': 'Your FlavorList',
											'image_url': 'http://i.imgur.com/d7N0CGt.jpg',
											'buttons': [
														{
																'type': 'web_url',
																'url': 'http://mkc-os.rgadev.com/flavor-studio/flavorlist-2.html',
																'title': 'See the recipes'
														}
												]
									}
							]
					}
			}
	});
}
