import ItemCompraDAO from "../persistencia/itemCompraDAO.js";

export default class ItemCompra{

    #id
    #compra
    #produto
    #quantidade
    #valor_unitario
    #ativo
    #atualizado_em
    #criado_em

    constructor(id=0, compra={}, produto={}, quantidade=0, valor_unitario="", ativo="", atualizado_em="", criado_em=""){
        this.#id = id;
        this.#compra = compra;
        this.#produto = produto;
        this.#quantidade = quantidade;
        this.#valor_unitario = valor_unitario;
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

    get compra(){
        return this.#compra;
    }

    set compra(novaCompra){
        this.#compra = novaCompra;
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

    get valor_unitario(){
        return this.#valor_unitario;
    }

    set valor_unitario(novoValorUnitario){
        this.#valor_unitario = novoValorUnitario;
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
                compra:this.#compra,
                produto:this.#produto.toJSON(),
                quantidade:this.#quantidade,
                valor_unitario:this.#valor_unitario,
                ativo:this.#ativo,
                atualizado_em:this.#atualizado_em,
                criado_em:this.#criado_em
            }
        }
    
    async gravar(conexao){
        const itemDAO = new ItemCompraDAO();
        await itemDAO.gravar(this, conexao);
    }
    
    async excluir(conexao){
        const itemDAO = new ItemCompraDAO();
        await itemDAO.excluir(this, conexao);
    }
    
    async alterar(conexao){
        const itemDAO = new ItemCompraDAO();
        await itemDAO.atualizar(this, conexao);
    }
    
    async consultar(parametro, conexao){
        const itemDAO = new ItemCompraDAO();
        return await itemDAO.consultar(this, parametro, conexao);
    }
}