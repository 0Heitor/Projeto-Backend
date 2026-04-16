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
    #codigo_recuperacao
    #codigo_recuperacao_validade
    #tentativas_recuperacao


    constructor(id=0, nome="", email="", senha="", nivel="", ativo="", ultimo_login="", criado="", codigo_recuperacao="", codigo_recuperacao_validade="", tentativas_recuperacao=0){
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
        this.#nivel = nivel;
        this.#ativo = ativo;
        this.#ultimo_login = ultimo_login;
        this.#criado = criado;
        this.#codigo_recuperacao = codigo_recuperacao;
        this.#codigo_recuperacao_validade = codigo_recuperacao_validade;
        this.#tentativas_recuperacao = tentativas_recuperacao;
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

    get codigo_recuperacao(){
        return this.#codigo_recuperacao;
    }

    set codigo_recuperacao(novoCodigo_recuperacao){
        this.#codigo_recuperacao = novoCodigo_recuperacao;
    }

    get codigo_recuperacao_validade(){
        return this.#codigo_recuperacao_validade;
    }

    set codigo_recuperacao_validade(novoCodigo_recuperacao_validade){
        this.#codigo_recuperacao_validade = novoCodigo_recuperacao_validade;
    }

    get tentativas_recuperacao(){
        return this.#tentativas_recuperacao;
    }

    set tentativas_recuperacao(novoTentativas_recuperacao){
        this.#tentativas_recuperacao = novoTentativas_recuperacao;
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

    toJSONEmail() {
        return {
            email: this.#email,
            nome: this.#nome,
            nivel: this.#nivel
        };
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

    async atualizarCodigoRecuperacao(conexao){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.atualizarCodigoRecuperacao(this, conexao);
    }

    async atualizarLogin(conexao){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.atualizarLogin(this, conexao);
    }

    async atualizarSenha(conexao){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.atualizarSenha(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const usuarioDAO = new UsuarioDAO();
        return await usuarioDAO.consultar(this, parametro, conexao);
    }

    async consultarEmail(parametro, conexao){
        const usuarioDAO = new UsuarioDAO();
        return await usuarioDAO.consultarEmail(this, parametro, conexao);
    }

    async validarCodigoRecuperacao(conexao){
        const usuarioDAO = new UsuarioDAO();
        return await usuarioDAO.validarCodigoRecuperacao(this, conexao);
    }
}