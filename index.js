const Restify = require('restify')
const methods = require('./methods')
const app = Restify.createServer({
    name: "conmeobot"
})
require('dotenv').config()

const VERIFY_TOKEN = process.env.VERIFY_TOKEN
const bot = new methods(process.env.ACCESS_TOKEN)

app.use(Restify.plugins.jsonp())
app.use(Restify.plugins.bodyParser())

app.get('/webhook', (req, res) => {
    //console.log(req.query['hub.challenge'])
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
    //res.send(token)
})

app.post('/', (req, res, next) => {
    const response = req.body
    if (response.object === 'page') {
        const messageObj = bot.getMessageObject(response)
        bot.sendText(`You said: ${messageObj.message}`, messageObj.id)
    }
    res.send(200)
})

app.listen(8080)