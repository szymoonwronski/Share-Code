const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(express.text())

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE,
    multipleStatements: true
})

const PORT = process.env.PORT || 5555

app.listen(PORT, () => console.log('server is running...'))

app.get('/', (req, res) => {
    res.status(400).sendFile(__dirname + '/help.txt')
})

app.get('/:id', (req, res) => {
    pool.query('SELECT code FROM codes WHERE id = ?', [req.params.id], (qErr, qRes) => {
        if (qErr) throw qErr
        if (isEmpty(qRes)) { res.status(404).send('404 Not Found'); return }
        res.set({ 'Content-Type': 'text/plain' }).status(200).send(qRes[0].code)
    })
})

app.post('/', (req, res) => {
    if (isEmpty(req.body)) { res.status(400).send('400 Bad Request'); return }
    pool.query('INSERT INTO codes (code) VALUES (?)', [req.body], (qErr, qRes) => {
        if (qErr) throw qErr
        res.status(201).send(`Shared code ID: ${qRes.insertId}`)
    })
})

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
}