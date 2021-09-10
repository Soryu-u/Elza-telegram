const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, { polling: true });
const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

// npm install /cheerio, request, node-telegram-bot-api, koa/

let notes = [];
let secretSanta = [];
let secretSantaDone = [];
let userSanta = [];

// КОМАНДЫ
{
  // bot.onText(/\/help/, function (msg, match){
  //   const chatId = msg.chat.id;
  //   let firstName = msg.from.first_name;

  //   bot.sendMessage(chatId, "Чем я могу вам помочь?", {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             text:'Курс валют',
  //             callback_data: 'EUR'
  //           },
  //           {
  //             text:'Рандомайзер',
  //             callback_data: 'USD'
  //           },
  //           {
  //             text:'Возможности',
  //             callback_data: 'RUR'
  //           }
  //         ]
  //       ]
  //     }
  //   });
  // });
  // bot.on('callback_query', query => {
  //   const id = query.message.chat.id;


  // });
  //random

  bot.onText(/\/roll/, function (msg, match) {
    const chatId = msg.chat.id;

    function getRandom(max) {
      return Math.floor(Math.random() * Math.floor(max));
    };
    let rundomNum = getRandom(6) + 1
    bot.sendMessage(chatId, "*на кубике выпало число " + rundomNum + "*");
  });

  bot.onText(/\/about/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Итак, что же я могу:

  -Если ты попросишь меня напомнить о чем-то в формате: "Эльза, напомни мне ___ в ХХ:ХХ", то я обязательно сделаю это!
  -Так же я могу подсказать тебе текущий курс валют (какой сейчас курс валют?)
  -А ещё, я могу поискать для тебя какую-то информацию на википедии!
  -Командой /roll можно получить случайное число. (1-6)

  Вообще я активно обучаюсь, и в скором времени научусь ещё чему-то!
  `);
  });



}






// ВОЗМОЖНОСТИ
{
  // wikipedia

  bot.onText(/Эльза, что такое (.+)/, function (msg, match) {
    let userId = msg.from.id;
    let chatId = msg.chat.id;
    let firstName = msg.from.first_name;
    const textRequire = match[1];

    bot.sendMessage(chatId, firstName + ", погоди, сейчас поищу.");

    // axios.get(`https://ru.wikipedia.org/wiki/${textRequire}`). then(res =>)
    bot.sendMessage(chatId, `https://ru.wikipedia.org/wiki/${textRequire}`);

  })

  // command list
  bot.onText(/Эльза, что ты умеешь/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Итак, что же я могу:

  -Если ты попросишь меня напомнить о чем-то в формате: "Эльза, напомни мне ___ в ХХ:ХХ", то я обязательно сделаю это!
  -Так же я могу подсказать тебе текущий курс валют (какой сейчас курс валют?)
  -А ещё, я могу поискать для тебя какую-то информацию на википедии!
  -Командой /roll можно получить случайное число. (1-6)

  Вообще я активно обучаюсь, и в скором времени научусь ещё чему-то!
  `);
  });

  // exchange rate
  bot.onText(/Эльза, какой сейчас курс валют/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Выберите, какая валюта вас интересует?", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Евро',
              callback_data: 'EUR'
            },
            {
              text: 'Доллар',
              callback_data: 'USD'
            },
            {
              text: 'Рубли',
              callback_data: 'RUR'
            },
            {
              text: 'Биткоин',
              callback_data: 'BTC'
            }
          ]
        ]
      }
    });
  });
  bot.on('callback_query', query => {
    const id = query.message.chat.id;

    request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (error, response, body) {
      const data = JSON.parse(body);
      const result = data.filter(item => item.ccy === query.data)[0];
      const flag = {
        'EUR': '🇪🇺',
        'USD': '🇺🇸',
        'RUR': '🇷🇺',
        'UAH': '🇺🇦',
        'BTC': '₿'
      }
      let md = `
      *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*
      Покупка: _${result.buy}_
      Продажа: _${result.sale}_
    `;
      bot.sendMessage(id, md, { parse_mode: 'Markdown' });
    });
  });

  // text scripts (alert)
  bot.onText(/Эльза, напомни мне (.+) в (.+)/, function (msg, match) {
    let userId = msg.from.id;
    let chatId = msg.chat.id;
    let firstName = msg.from.first_name;
    let text = match[1];
    let time = match[2];

    notes.push({ 'cid': chatId, 'uid': userId, 'time': time, 'text': text, 'uname': firstName });

    bot.sendMessage(chatId, "Без проблем, " + firstName + ", я обязательно напомню вам!");
  });
  setInterval(function () {
    for (let i = 0; i < notes.length; i++) {
      const curDate = new Date().getHours() + ':' + new Date().getMinutes();
      if (notes[i]['time'] === curDate) {
        bot.sendMessage(notes[i]['cid'], notes[i]['uname'] + ', напоминаю, что вам нужно ' + notes[i]['text']);
        notes.splice(i, 1);
      }
    }
  }, 1000);










  // ПРИВЕТСТВИЕ


  bot.onText(/Привет, Эльза/, function (msg, match) {
    let userId = msg.from.id;
    let chatId = msg.chat.id;
    let firstName = msg.from.first_name;
    const textRequire = match[1];

    if (userId === 336923062) {
      bot.sendMessage(chatId, "Я ждала вас, хозяин.");
    } else if (userId === 428295179) {
      bot.sendMessage(chatId, "Приветствую, госпожа.");
    } else {
      bot.sendMessage(chatId, "Здравствуй, " + firstName + "!");
    };

    console.log("Вот, что вас интресует:" + userId + "; " + userName + "; " + chatId);

  });
}

bot.onText(/привет эльза/, function (msg, match) {
  let userId = msg.from.id;
  let chatId = msg.chat.id;
  let firstName = msg.from.first_name;
  const textRequire = match[1];

  if (userId === 336923062) {
    bot.sendMessage(chatId, "Я ждала вас, хозяин.");
  } else if (userId === 428295179) {
    bot.sendMessage(chatId, "Приветствую, госпожа.");
  } else {
    bot.sendMessage(chatId, "Здравствуй, " + firstName + "!");
  };

  console.log("Вот, что вас интресует:" + userId + "; " + userName + "; " + chatId);

});

bot.onText(/Привет/, function (msg, match) {
  let userId = msg.from.id;
  let chatId = msg.chat.id;
  let firstName = msg.from.first_name;
  const textRequire = match[1];

  if (userId === 336923062) {
    bot.sendMessage(chatId, "Я ждала вас, хозяин.");
  } else if (userId === 428295179) {
    bot.sendMessage(chatId, "Приветствую, госпожа.");
  } else {
    bot.sendMessage(chatId, "Здравствуй, " + firstName + "!");
  };

  console.log("Вот, что вас интресует:" + userId + "; " + userName + "; " + chatId);

});




// СТАЛЫЕ ФРАЗЫ
{

  smsText = /Эльза, давай знакомиться/;
  bot.onText(smsText, function (msg, match) {
    let userId = msg.from.id;
    let chatId = msg.chat.id;
    let firstName = msg.from.first_name;
    let userName = msg.from.username;
    const textRequire = match[1];

    bot.sendMessage(chatId, "Давайте, " + userName + ", а вот я Эльза. Приятно ^.^");
    console.log("Вот, что вас интресует: id: " + userId + " ; userName: " + userName + "; chatId: " + chatId)
  });


}