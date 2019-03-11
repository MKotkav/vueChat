'use strict'
const path = require('path');
const appDir = path.dirname(require.main.filename);
const mongodb = require('mongodb');
const dbkey = require('../../hide/dbKeys')


exports.load_index = (req, res, err) => {
    if(process.env.NODE_ENV === 'production') {
        res.sendFile('../../public/index.html');
    }
    else res.sendFile('../../../client/public/index.html');
}

exports.add_message = async (req, res, err) => {
    try {
        const messages = await loadMessages();
        await messages.insertOne({
            name: req.body.name,
            message: req.body.message,
            time: req.body.time
        });
        res.status(201).json();
    }
    catch (error) {
        err(error);
    }
}

exports.delete_message = async (req, res, err) => {
    const messages = await loadMessages();
    await messages.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(204).send();
}

exports.get_messages = async (req, res, err) => {
    const messages = await loadMessages();
    res.json(await messages.find({}).toArray());
}

exports.handleSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('message', async (data) => {
            const messages = await loadMessages();
            const message = JSON.parse(data);
            try {
                await messages.insertOne({
                    name: message.name,
                    message: message.message,
                    time: message.time
                });
            }
            catch (error) {
                console.log(error);
            }
            const returnMessage = await messages.find(
                {
                    name: message.name,
                    message: message.message,
                    time: message.time
                }).toArray();
            io.emit('messageEmit', returnMessage[0]);
        });
        socket.on('delete', async (id) => {
            const messages = await loadMessages();
            try {
                await messages.deleteOne({ _id: new mongodb.ObjectID(id) })
            }
            catch (error) {
                console.log(error);
            }
            io.emit('deleteEmit');
        });
    })
}

async function loadMessages() {
    const client = await mongodb.MongoClient.connect(dbkey.dbKey(), { useNewUrlParser: true });
    return client.db('vue_chat').collection('messages');
}