import TipoCacambaDAO from '../persistencia/tipoCacambaDAO.js';

export default class TipoCacamba{
    #id
    #nome
    #volume
    #preco
    #descricao
    #ativo
    #atualizado_em
    #criado_em

    constructor(id=0, nome="", volume=0.0, preco=0.0, descricao="", ativo=true, atualizado_em="", criado_em=""){
        this.#id = id;
        this.#nome = nome;
        this.#volume = volume;
        this.#preco = preco;
        this.#descricao = descricao;
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

    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome = novoNome;
    }

    get volume(){
        return this.#volume;
    }

    set volume(novoVolume){
        this.#volume = novoVolume;
    }

    get preco(){
        return this.#preco;
    }

    set preco(novoPreco){
        this.#preco = novoPreco;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(novaDescricao){
        this.#descricao = novaDescricao;
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
            id: this.#id,
            nome: this.#nome,
            volume: this.#volume,
            preco: this.#preco,
            descricao: this.#descricao,
            ativo: this.#ativo,
            atualizado_em: this.#atualizado_em,
            criado_em: this.#criado_em
        };
    }

    async gravar(conexao){
        const tipoCacambaDAO = new TipoCacambaDAO();
        await tipoCacambaDAO.gravar(this, conexao);
    }

    async alterar(conexao){
        const tipoCacambaDAO = new TipoCacambaDAO();
        await tipoCacambaDAO.atualizar(this, conexao);
    }

    async excluir(conexao){
        const tipoCacambaDAO = new TipoCacambaDAO();
        await tipoCacambaDAO.excluir(this, conexao);
    }

    async consultar(parametro, conexao){
        const tipoCacambaDAO = new TipoCacambaDAO();
        return await tipoCacambaDAO.consultar(this, parametro, conexao);
    }
}