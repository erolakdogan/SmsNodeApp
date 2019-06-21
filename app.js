const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');


const nexmo = new Nexmo({
    apiKey: 'b7a5db2d', //Nexmo APİ Key bu alana girilecek.
    apiSecret: 'l9MwVFSGnc13qOhr' //Nexmo Api Secret bu alana girilecek.
}, {
    debug: true
});


const app = express();


app.set('view engine', 'html');
app.engine('html', ejs.renderFile);


app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('index');
});


app.post('/', (req, res) => {
    const {
        number,
        text
    } = req.body;

    nexmo.message.sendSms(
        '79218086285', number, text, { //nexmo Virtual number bu alana girilecek.
            type: 'unicode'
        }, 
        (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                const {
                    messages
                } = responseData;
                const {
                    ['message-id']: id, ['to']: number, ['error-text']: error
                } = messages[0];
                console.dir(responseData);
                const data = {
                    id,
                    number,
                    error
                };

                io.emit('smsStatus', data);
            }
        }
    );
});


const port = 3000;

const server = app.listen(port, () => console.log(`Server started on port ${port}`));


const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    })
});
