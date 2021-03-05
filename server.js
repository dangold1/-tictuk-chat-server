const { PORT = 8080 } = process.env;
const app = require('express')();
const httpServer = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const io = require('socket.io')(httpServer, { cors: { origin: '*' } });
const channels = require('./utils/channels');
const { createUser, createMessage, getChannelNameByID } = require('./services');

//----------------------------------Middlewares-------------------------------------

app.use(bodyParser.json());
app.use(cors());

//----------------------------------Routes-------------------------------------

app.get('/get-channels', (req, res) => {
    res.json({ channels });
});

app.post('/send-message',(req, res) => {
    const { channelID, text, userID } = req.body;
    const message = createMessage({ userID, channelID, text, isSystemMessage: false });
    io.emit("RECEIVED_MESSAGE", { message, channelID });
})

//----------------------------------Connection-------------------------------------

httpServer.listen(PORT, () => {
    console.log("server is running! =>", { PORT });
});

io.on('connection', (socket) => {
    const sessionID = socket.id;
    console.log('New client connected =>', sessionID);
    socket.on("CREATE_USER", ({ channelID, userName }) => {
        const user = createUser({ userName, channelID, sessionID });
        socket.emit("CREATED_USER", user);
    });

    socket.on("WELCOME_USER", user => {
        const { channelID, userName, id: userID } = user;
        const channelName = getChannelNameByID(channelID)
        const text = `Welcome ${userName} to the room "${channelName}"`;
        const message = createMessage({ userID, channelID, text, isSystemMessage: true });
        io.emit("RECEIVED_MESSAGE", { message, channelID });
    });
});
