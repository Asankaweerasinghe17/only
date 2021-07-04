const Asena = require('../events');
const {MessageType,Mimetype} = require('@adiwajshing/baileys');
const config = require('../config');

const Config = require('../config');
const ffmpeg = require('fluent-ffmpeg');

const Language = require('../language');
const bix = Language.getString('unvoice')

const Ierr = "*Necesitas contestar el archivo de audio!*"


//============================== audd ==============================
var request = require("request");
var axios = require("axios");
var fs = require('fs');



    Asena.addCommand({pattern: 'recona', fromMe: true}, (async (message, match) => {

        if (message.reply_message === false) return await message.client.sendMessage(message.jid, bix.UV_REPLY, MessageType.text);

        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
        .format('mp3')
        .save('lyr.mp3')
        .on('end', async () => {

            var data = { 'api_token': '5fb6efe589810fae711031de2a77c25a', 'file': fs.createReadStream('lyr.mp3'), 'return': 'apple_music,spotify' };
            request ({ uri: 'https://api.audd.io/', form: data, method: "POST" }, async (err, res, body) => {
                return await message.client.sendMessage(message.jid, body, MessageType.text);
            })
        })

    }));

    Asena.addCommand({pattern: 'reconb ?(.*)', fromMe: true}, (async (message, match) => {

     if (message.reply_message === false) return await message.client.sendMessage(message.jid, bix.UV_REPLY, MessageType.text);
          
        var data = {
                'api_token': '5fb6efe589810fae711031de2a77c25a',
                'url': `${match[1]}`,
                'return': 'apple_music,spotify',
            };

            axios({
                method: 'post',
                url: 'https://api.audd.io/',
                data: data,
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(async (response) => {
                return await message.client.sendMessage(message.jid, response, MessageType.text);
                 //console.log(response);
            })
            .catch(async (error) => {
                return await message.client.sendMessage(message.jid, error, MessageType.text);
                //console.log(error);
            });

    }));
