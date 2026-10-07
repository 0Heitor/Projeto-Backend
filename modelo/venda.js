import VendaDAO from '../persistencia/vendaDAO.js';
import ItemVenda from './itemVenda.js';

export default class Venda{

    #id
    #cliente
    #usuario
    #itens
    #total
    #forma_pagamento
    #status
    #ativo
    #atualizado_em
    #criado_em

    constructor(id=0, itens=[], cliente={}, usuario={}, total=0, forma_pagamento="", status="", ativo="", atualizado_em="", criado_em=""){
        this.#id = id;
        this.#itens = itens;
        this.#cliente = cliente;
        this.#usuario = usuario;
        this.#total = total;
        this.#forma_pagamento = forma_pagamento;
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

    get usuario(){
        return this.#usuario;
    }

    set usuario(novoUsuario){
        this.#usuario = novoUsuario;
    }

    get itens(){
        return this.#itens;
    }

    set itens(novosItens){
        this.#itens = novosItens;
    }

    get forma_pagamento(){
        return this.#forma_pagamento;
    }

    set forma_pagamento(novaForma_pagamento){
        this.#forma_pagamento = novaForma_pagamento;
    }

    get total(){
        return this.#total;
    }

    set total(novoTotal){
        this.#total = novoTotal;
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
            usuario:this.#usuario.toJSON(),
            itens: this.#itens.map(item => item.toJSON()),
            //usuario:this.#usuario.toJSON(),
            //data_compra:this.#data_compra,
            total:this.#total,
            forma_pagamento:this.#forma_pagamento,
            status:this.#status,
            ativo:this.#ativo,
            atualizado_em:this.#atualizado_em,
            criado_em:this.#criado_em
        }
    }

    async gravar(conexao){
        const vendaDAO = new VendaDAO();
        await vendaDAO.gravar(this, conexao);
    }
    
    async excluir(conexao){
        const vendaDAO = new VendaDAO();
        await vendaDAO.excluir(this, conexao);
    }
    
    async alterar(conexao){
        const vendaDAO = new VendaDAO();
        await vendaDAO.atualizar(this, conexao);
    }
    
    async consultar(parametro, conexao){
        const vendaDAO = new VendaDAO();
        return await vendaDAO.consultar(this, parametro, conexao);
    }

    async consultaItens(conexao){
        const vendaDAO = new VendaDAO();
        return await vendaDAO.consultarItens(this.#id, conexao);
    }
}