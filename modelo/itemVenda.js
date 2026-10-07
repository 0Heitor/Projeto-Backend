import ItemVendaDAO from "../persistencia/itemVendaDAO.js";

export default class ItemVenda{

    #id
    #venda
    #produto
    #quantidade
    #ativo
    #atualizado_em
    #criado_em

    constructor(id=0, venda={}, produto={}, quantidade=0, ativo="", atualizado_em="", criado_em=""){
        this.#id = id;
        this.#venda = venda;
        this.#produto = produto;
        this.#quantidade = quantidade;
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

    get venda(){
        return this.#venda;
    }

    set venda(novaVenda){
        this.#venda = novaVenda;
    }

    get produto(){
        return this.#produto;
    }

    set produto(novoProduto){
        this.#produto = novoProduto;
    }

    get quantidade(){
        return this.#quantidade;
    }

    set quantidade(novaQuantidade){
        this.#quantidade = novaQuantidade;
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
            //compra:this.#compra.toJSON(),
            venda:this.#venda,
            produto:this.#produto.toJSON(),
            quantidade:this.#quantidade,
            //valor_unitario:this.#valor_unitario,
            ativo:this.#ativo,
            atualizado_em:this.#atualizado_em,
            criado_em:this.#criado_em
        }
    }
    
    async gravar(conexao){
        const itemDAO = new ItemVendaDAO();
        await itemDAO.gravar(this, conexao);
    }
    
    async excluir(conexao){
        const itemDAO = new ItemVendaDAO();
        await itemDAO.excluir(this, conexao);
    }
    
    async alterar(conexao){
        const itemDAO = new ItemVendaDAO();
        await itemDAO.atualizar(this, conexao);
    }
    
    async consultar(parametro, conexao){
        const itemDAO = new ItemVendaDAO();
        return await itemDAO.consultar(this, parametro, conexao);
    }
}