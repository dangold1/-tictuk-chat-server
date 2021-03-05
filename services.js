const { v4: uuidv4 } = require('uuid');
const users = require('./utils/users');
const channels = require('./utils/channels');

const createUser = ({ channelID, userName, sessionID }) => {
    const newUser = { userName, id: uuidv4(), sessionID, channelID }
    users.push(newUser)
    return newUser;
}

const createMessage = ({ userID, channelID, text, isSystemMessage = false }) => {
    const message = { id: uuidv4(), userID, text, date: new Date(), isSystemMessage };
    const channel = channels.find(channel => channel.id === channelID);
    if (!channel) throw new Error("Channel Not Found");
    channel.messages.push(message);
    return message;
}

const getChannelNameByID = channelID => {
    const channel = channels.find(channel => channel.id === channelID);
    return channel?.name ?? ''
}

module.exports = {
    createUser,
    createMessage,
    getChannelNameByID
}