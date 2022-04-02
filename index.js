const TelegramApi = require("node-telegram-bot-api")
const {gameOptions,playAgainOptions} = require("./keys")
const token = "5268030100:AAE2IiJ6yzB2UKT4c_a7Lsm1jZCq6LQWxCA"

const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Now I will think of a number from 0 to 9, and you have to guess it!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Guess", gameOptions)
}

const start =async () => {
    bot.setMyCommands([
        {command:'/start',description:"Welcome"},
        {command: '/info',description: "Bot Info"},
        {command: '/game',description: "Play whit me"}
    ])

    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return  bot.sendMessage(chatId, `Welcome ${msg.chat.first_name}`)
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/883/185/883185b3-d156-3d57-8cef-84f35062c23c/5.webp")
        }
        if(text === '/info'){
            return  bot.sendMessage(chatId, `${msg.chat.first_name} this is a OG bot for You!`);
        }
        if (text === '/game'){
        return startGame(chatId)
        }

        return bot.sendMessage(chatId, `${msg.chat.first_name}, i dont now what You say.Plese check menu, and select option!`);
    })

    bot.on('callback_query', async msg => {
         console.log(msg);
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data == chats[chatId]){
            await bot.sendMessage(chatId, `You win,I think of a number ${chats[chatId]}`, playAgainOptions);
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/d22/1d7/d221d758-f358-37e3-8c70-08989c0c1267/4.webp")

        }else{
            await bot.sendMessage(chatId,`You lose,I think of a number ${chats[chatId]}`, playAgainOptions);
        }
    })
}

start()