const express = require('express')

const app = express()
app.use(express.text())

const PORT = process.env.PORT || 5555

app.listen(PORT, () => console.log('server is running...'))

var sharedCode

app.get('/', (req, res) => {
    res.send(sharedCode)
})

app.post('/', (req, res) => {
    sharedCode = req.body;
    res.send('udalo sie')
})