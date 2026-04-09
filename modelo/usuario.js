import UsuarioDAO from '../persistencia/usuarioDAO.js';

export default class Usuario{
    #id
    #nome
    #email
    #senha
    #nivel
    #ativo
    #ultimo_login
    #criado


    constructor(id=0, nome="", email="", senha="", nivel="", ativo="", ultimo_login="", criado=""){
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
        this.#nivel = nivel;
        this.#ativo = ativo;
        this.#ultimo_login = ultimo_login;
        this.#criado = criado;
    }

    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome = novoNome;
    }

    get email(){
        return this.#email;
    }

    set email(novoEmail){
        this.#email = novoEmail;
    }

    get senha(){
        return this.#senha;
    }

    set senha(novoSenha){
        this.#senha = novoSenha;
    }

    get nivel(){
        return this.#nivel;
    }

    set nivel(novoNivel){
        this.#nivel = novoNivel;
    }

    get ativo(){
        return this.#ativo;
    }

    set ativo(novoAtivo){
        this.#ativo = novoAtivo;
    }

    get ultimo_login(){
        return this.#ultimo_login;
    }

    set ultimo_login(novoUltimo_login){
        this.#ultimo_login = novoUltimo_login;
    }

    get criado(){
        return this.#criado;
    }

    set criado(novoCriado){
        this.#criado = novoCriado;
    }

    toJSON(){
        return {
            id:this.#id,
            nome:this.#nome,
            email:this.#email,
            senha:this.#senha,
            nivel:this.#nivel,
            ativo:this.#ativo,
            ultimo_login:this.#ultimo_login,
            criado:this.#criado
        }
    }

    async gravar(conexao){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.gravar(this, conexao);
    }
 
    async excluir(conexao){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.excluir(this, conexao);
    }
 
    async alterar(conexao){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.atualizar(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const usuarioDAO = new UsuarioDAO();
        return await usuarioDAO.consultar(this, parametro, conexao);
    }
}