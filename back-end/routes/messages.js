const express = require('express');
const Messages = express.Router();
const db = require('../database/db');

Messages.post('/', async (req, res) => {
    const { sender_id, receiver_id, content } = req.body;

    if (!sender_id || !receiver_id || !content) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await db.sendMessage(sender_id, receiver_id, content);
        res.status(201).json({ message: "Message sent" });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

Messages.get('/', async (req, res) => {
    const { sender_id, receiver_id } = req.query;

    if (!sender_id || !receiver_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await db.getChat(sender_id, receiver_id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

Messages.get('/recent', async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    try {
        const chats = await db.getRecentChats(user_id);
        res.status(200).json({ recentChats: chats });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

module.exports = Messages;