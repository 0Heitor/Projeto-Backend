import LocacaoDAO from "../persistencia/locacaoDAO.js";

export default class Locacao{
    #id
    #cliente
    #itens
    #data_pedido
    #data_entrega
    #data_retirada_prevista
    #data_retirada_real
    #endereco_entrega
    #valor_total
    #status
    #ativo
    #atualizado_em
    #criado_em

    constructor(id=0, cliente={}, itens=[], data_pedido="", data_entrega="", data_retirada_prevista="", data_retirada_real="", endereco_entrega="", valor_total=0, status="", ativo="", atualizado_em="", criado_em=""){
        this.#id = id;
        this.#cliente = cliente;
        this.#itens = itens;
        this.#data_pedido = data_pedido;
        this.#data_entrega = data_entrega;
        this.#data_retirada_prevista = data_retirada_prevista;
        this.#data_retirada_real = data_retirada_real;
        this.#endereco_entrega = endereco_entrega;
        this.#valor_total = valor_total;
        this.#status = status;
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

    get cliente(){
        return this.#cliente;
    }

    set cliente(novoCliente){
        this.#cliente = novoCliente;
    }

    get itens(){
        return this.#itens;
    }

    set itens(novoItens){
        this.#itens = novoItens;
    }

    get data_pedido(){
        return this.#data_pedido;
    }

    set data_pedido(novoData_pedido){
        this.#data_pedido = novoData_pedido;
    }

    get data_entrega(){
        return this.#data_entrega;
    }

    set data_entrega(novoData_entrega){
        this.#data_entrega = novoData_entrega;
    }

    get data_retirada_prevista(){
        return this.#data_retirada_prevista;
    }

    set data_retirada_prevista(novoData_retirada_prevista){
        this.#data_retirada_prevista = novoData_retirada_prevista;
    }

    get data_retirada_real(){
        return this.#data_retirada_real;
    }

    set data_retirada_real(novoData_retirada_real){
        this.#data_retirada_real = novoData_retirada_real;
    }

    get endereco_entrega(){
        return this.#endereco_entrega;
    }

    set endereco_entrega(novoEndereco_entrega){
        this.#endereco_entrega = novoEndereco_entrega;
    }

    get valor_total(){
        return this.#valor_total;
    }

    set valor_total(novoValor_total){
        this.#valor_total = novoValor_total;
    }

    get status(){
        return this.#status;
    }

    set status(novoStatus){
        this.#status = novoStatus;
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
            cliente:this.#cliente.toJSON(),
            itens: this.#itens.map(item => item.toJSON()),
            data_pedido:this.#data_pedido,
            data_entrega:this.#data_entrega,
            data_retirada_prevista:this.#data_retirada_prevista,
            data_retirada_real:this.#data_retirada_real,
            endereco_entrega:this.#endereco_entrega,
            valor_total:this.#valor_total,
            status:this.#status,
            ativo:this.#ativo,
            atualizado_em:this.#atualizado_em,
            criado_em:this.#criado_em
        }
    }
    
    async gravar(conexao){
        const locacaoDAO = new LocacaoDAO();
        await locacaoDAO.gravar(this, conexao);
    }
    
    async excluir(conexao){
        const locacaoDAO = new LocacaoDAO();
        await locacaoDAO.excluir(this, conexao);
    }
    
    async alterar(conexao){
        const locacaoDAO = new LocacaoDAO();
        await locacaoDAO.atualizar(this, conexao);
    }
    
    async consultar(parametro, conexao){
        const locacaoDAO = new LocacaoDAO();
        return await locacaoDAO.consultar(this, parametro, conexao);
    }
}