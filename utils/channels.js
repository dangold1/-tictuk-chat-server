const { v4: uuidv4 } = require('uuid');

const channels = [
    {
        id: uuidv4(),
        name: "Talk Shop",
        messages: [],
    },
    {
        id: uuidv4(),
        name: "Talk to me",
        messages: [],
    },
];

module.exports = channels;