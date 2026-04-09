import CacambaDAO from '../persistencia/cacambaDAO.js';

export default class Cacamba{
    #id
    #numero
    #tamanho
    #status
    #modelo
    #ultima_revisao
    #ativo
    #atualizado_em
    #criado_em


    constructor(id=0, numero="", tamanho="", status="", modelo="", ultima_revisao="", ativo="", atualizado_em="", criado_em=""){
        this.#id = id;
        this.#numero = numero;
        this.#tamanho = tamanho;
        this.#status = status;
        this.#modelo = modelo;
        this.#ultima_revisao = ultima_revisao;
        this.#ativo = ativo;
        this.#atualizado_em = atualizado_em;
        this.#criado_em = criado_em;
    }

    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;
    }

    get numero(){
        return this.#numero;
    }

    set numero(novoNumero){
        this.#numero = novoNumero;
    }

    get tamanho(){
        return this.#tamanho;
    }

    set tamanho(novoTamanho){
        this.#tamanho = novoTamanho;
    }

    get status(){
        return this.#status;
    }

    set status(novoStatus){
        this.#status = novoStatus;
    }

    get modelo(){
        return this.#modelo;
    }

    set modelo(novoModelo){
        this.#modelo = novoModelo;
    }

    get ultima_revisao(){
        return this.#ultima_revisao;
    }

    set ultima_revisao(novoUltima_revisao){
        this.#ultima_revisao = novoUltima_revisao;
    }

    get ativo(){
        return this.#ativo;
    }

    set ativo(novoAtivo){
        this.#ativo = novoAtivo;
    }

    get atualizado_em(){
        return this.#atualizado_em;
    }

    set atualizado_em(novoAtualizado_em){
        this.#atualizado_em = novoAtualizado_em;
    }

    get criado_em(){
        return this.#criado_em;
    }

    set criado_em(novoCriado_em){
        this.#criado_em = novoCriado_em;
    }

    toJSON(){
        return {
            id:this.#id,
            numero:this.#numero,
            tamanho:this.#tamanho,
            status:this.#status,
            modelo:this.#modelo,
            ultima_revisao:this.#ultima_revisao,
            ativo:this.#ativo,
            atualizada_em:this.#atualizado_em,
            criado_em:this.#criado_em
        }
    }

    async gravar(conexao){
        const cacambaDAO = new CacambaDAO();
        await cacambaDAO.gravar(this, conexao);
    }
 
    async excluir(conexao){
        const cacambaDAO = new CacambaDAO();
        await cacambaDAO.excluir(this, conexao);
    }
 
    async alterar(conexao){
        const cacambaDAO = new CacambaDAO();
        await cacambaDAO.atualizar(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const cacambaDAO = new CacambaDAO();
        return await cacambaDAO.consultar(this, parametro, conexao);
    }
}