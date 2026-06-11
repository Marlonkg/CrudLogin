const express = require('express')

require('dotenv').config()

// Puxando a POOL
const conexao = require('./config/database')

const app = express()
app.use(express.json())

app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

// rota teste
app.get('/', (req, res) =>{
    res.json({mensagem: 'Servidor backend ligado e funcional!'})
})

const PORTA = process.env.PORT || 3000

app.listen(PORTA, () =>{
    console.log(`Servidor está na porta http:localhost:${PORTA}`)
})