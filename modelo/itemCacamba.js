import ItemCacambaDAO from "../persistencia/itemCacambaDAO.js";

export default class ItemCacamba{
    #id
    #locacao
    #cacamba
    #valor_unitario
    #data_retirada_real
    #status_item
    #ativo
    #atualizado_em
    #criado_em

    constructor(id=0, locacao={}, cacamba={}, valor_unitario=0, data_retirada_real="", status_item="", ativo="", atualizado_em="", criado_em=""){
        this.#id = id;
        this.#locacao = locacao;
        this.#cacamba = cacamba;
        this.#valor_unitario = valor_unitario;
        this.#data_retirada_real = data_retirada_real;
        this.#status_item = status_item;
        this.#ativo = ativo;
        this.#atualizado_em = atualizado_em;
        this.#criado_em = criado_em;
    }

    get id(){
        return this.#id;
    }

    set id(nodoId){
        this.#id = nodoId;
    }

    get locacao(){
        return this.#locacao;
    }

    set locacao(novaLocacao){
        this.#locacao = novaLocacao;
    }

    get cacamba(){
        return this.#cacamba;
    }

    set cacamba(novaCacamba){
        this.#cacamba = novaCacamba;
    }

    get valor_unitario(){
        return this.#valor_unitario;
    }

    set valor_unitario(novoValor){
        this.#valor_unitario = novoValor;
    }

    get data_retirada_real(){
        return this.#data_retirada_real;
    }

    set data_retirada_real(novaData){
        this.#data_retirada_real = novaData;
    }

    get status_item(){
        return this.#status_item;
    }

    set status_item(novoStatus){
        this.#status_item = novoStatus;
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
            locacao:this.#locacao,
            cacamba:this.#cacamba.toJSON(),
            valor_unitario:this.#valor_unitario,
            data_retirada_real:this.#data_retirada_real,
            status_item:this.#status_item,
            ativo:this.#ativo,
            atualizado_em:this.#atualizado_em,
            criado_em:this.#criado_em
        }
    }

    async gravar(conexao){
        const itemDAO = new ItemCacambaDAO();
        await itemDAO.gravar(this, conexao);
    }
    
    async excluir(conexao){
        const itemDAO = new ItemCacambaDAO();
        await itemDAO.excluir(this, conexao);
    }
    
    async alterar(conexao){
        const itemDAO = new ItemCacambaDAO();
        await itemDAO.atualizar(this, conexao);
    }
    
    async consultar(parametro, conexao){
        const itemDAO = new ItemCacambaDAO();
        return await itemDAO.consultar(this, parametro, conexao);
    }
}