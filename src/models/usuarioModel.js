const pool = require('../config/database')

//Função para receber todos os dados do registro
const criarUsuario = async (apelido, nomeCompleto, email, senha_hash, pais, estado, cidade, cep, telefone) =>{
    const query = `INSERT INTO usuarios (apelido, nome_completo, email, senha_hash, pais, estado, cidade, cep, telefone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

    const [resultado] = await pool.query(query, [apelido, nomeCompleto, email, senha_hash, pais, estado, cidade, cep, telefone])

    return resultado.insertId

    //Para evitar duplicatas
    const buscarUsuarioPorEmailOuApelido = async (email, apelido) => {
        const [linhas] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ? OR apelido = ?', [email, apelido]
        )
        return linhas [0]
    }
}

module.exports = {
    criarUsuario,
    buscarUsuarioPorEmailOuApelido
}