import CompraDAO from '../persistencia/compraDAO.js';
import ItemCompra from './itemCompra.js';

export default class Compra{
    #id
    #fornecedor
    #itens
    //#usuario
    #data_compra
    #valor_total
    #status
    #ativo
    #atualizado_em
    #criado_em


    constructor(id=0, itens=[], fornecedor={},/* usuario={},*/ data_compra="", valor_total=0, status="", ativo="", atualizado_em="", criado_em=""){
        this.#id = id;
        this.#itens = itens;
        this.#fornecedor = fornecedor;
        //this.#usuario = usuario;
        this.#data_compra = data_compra;
        this.#valor_total = valor_total;
        this.#status = status;
        this.#ativo = ativo;
        this.#atualizado_em = atualizado_em;
        this.#criado_em = criado_em;
        /*this.#itens = itens.map(item => {
            return {
                id: item.itc_id,
                quantidade: item.itc_quantidade,
                valor_unitario: item.itc_valor_unitario,
                descricao: item.prod_descricao,
                marca: item.prod_marca
            };
        });*/
    }

    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;
    }

    get fornecedor(){
        return this.#fornecedor;
    }

    set fornecedor(novoFornecedor){
        this.#fornecedor = novoFornecedor;
    }

    /*get usuario(){
        return this.#usuario;
    }

    set usuario(novoUsuario){
        this.#usuario = novoUsuario;
    }*/

    get itens(){
        return this.#itens;
    }

    set itens(novosItens){
        this.#itens = novosItens;
    }

    get data_compra(){
        return this.#data_compra;
    }

    set data_compra(novaDataCompra){
        this.#data_compra = novaDataCompra;
    }

    get valor_total(){
        return this.#valor_total;
    }

    set valor_total(novoValorTotal){
        this.#valor_total = novoValorTotal;
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
            fornecedor:this.#fornecedor.toJSON(),
            itens: this.#itens.map(item => item.toJSON()),
            //usuario:this.#usuario.toJSON(),
            data_compra:this.#data_compra,
            valor_total:this.#valor_total,
            status:this.#status,
            ativo:this.#ativo,
            atualizado_em:this.#atualizado_em,
            criado_em:this.#criado_em
        }
    }

    async gravar(conexao){
        const compraDAO = new CompraDAO();
        await compraDAO.gravar(this, conexao);
    }
 
    async excluir(conexao){
        const compraDAO = new CompraDAO();
        await compraDAO.excluir(this, conexao);
    }
 
    async alterar(conexao){
        const compraDAO = new CompraDAO();
        await compraDAO.atualizar(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const compraDAO = new CompraDAO();
        return await compraDAO.consultar(this, parametro, conexao);
    }

    async consultaItens(conexao){
        const compraDAO = new CompraDAO();
        return await compraDAO.consultarItens(this.#id, conexao);
    }
}