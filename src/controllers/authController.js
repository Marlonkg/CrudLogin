const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const usuarioModel = require('../models/usuarioModel')

const registrar = async (req, res) => {
    try {
        const {
            apelido, nome_completo, email, senha, confirmacao_senha, pais, estado, cidade, cep, telefone
        } = req.body

        //Validação de todas os inputs
        if (!apelido || !nome_completo || !email || !senha || !confirmacao_senha || !pais || !estado || !cidade || !cep || !telefone){
            return res.status(400).json({erro: 'Preencha todos os campos!'})
        }

        //Validação de senhas diferentes
        if(senha !== confirmacao_senha){
            res.status(400).json({erro: 'As senhas não coinciedem.'})
        }

        //Validação de usuario existente
        const usuarioExistente = await usuarioModel.buscarUsuarioPorEmailOuApelido(email, apelido);
            if (usuarioExistente) {
               return res.status(400).json({ erro: "Este email ou apelido já está em uso." });
        }

        //Criptografando a senha
        const senhaHash = await bcrypt.hash(senha, 10)
        
        const novoUsuarioID = await usuarioModel.criarUsuario(apelido, nome_completo, email, senhaHash, pais, estado, cidade, cep, telefone)

        //Token para auto-login
        const token = jwt.sign(
            {id: novoUsuarioID},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        res.status(201).json({mensagem: 'Usuario registrado com sucesso!',
            token: token, 
            usuario: {
                id: novoUsuarioID,
                apelido: apelido,
                nome: nome_completo,
                email: email
            }
        })

    } catch (erro) {
        console.error(erro)
        res.status(500).json({erro: 'erro interno no servidor ao registrar usuario.'})
    }
}

const login = async (req, res) =>{
    try {

        const {email, senha} = req.body

        //Validação de inputs
        if(!email || !senha) {
            return res.status(400).json({erro: 'Informe email e senha!'})
        }

        //buscando usuario por email
        const usuario = await usuarioModel.buscarUsuarioPorEmailOuApelido(email)

        //Validação de email
        if (!usuario) {
            return res.status(401).json({erro: 'Credenciais inválidas.'})
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)

        //Validação senha
        if (!senhaValida) {
            return res.status(401).json({erro: 'Credenciais inválidas.'})
        }
        
        //Entrada
        const token = jwt.sign(
            { id: usuario.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        )

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token: token,
            usuario: { id: usuario.id, apelido: usuario.apelido, email: usuario.email }
        })


    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro interno do servidor no login." });
    }
}

module.exports = {registrar, login}