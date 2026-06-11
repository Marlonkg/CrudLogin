const mysql = require('mysql2/promise')

require('dotenv').config()

// Criação da POOL com dados do .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true, // Se as conexões estiverem ocupadas, manda a proxima requisição esperar.
    connectionLimit: 10, // Limite máximo de 10 conexões ao mesmo tempo.
    queueLimit: 0 // Sem limite de requisições em espera (Talvez eu mude)
})

module.exports = pool