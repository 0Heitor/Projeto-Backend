import ContaReceberDAO from '../persistencia/contaReceberDAO.js';

export default class ContaReceber{
    #id
    #cliente
    #origem_tipo
    #valor_total
    #forma_pagamento
    #data_vencimento
    #data_pagamento
    #status
    #ativo
    #atualizado
    #criado

    constructor(id=0, cliente={}, origem_tipo="", valor_total="", forma_pagamento="", data_vencimento="", data_pagamento="", status="", ativo="", atualizado="", criado=""){
        this.#id = id;
        this.#cliente = cliente;
        this.#origem_tipo = origem_tipo;
        this.#valor_total = valor_total;
        this.#forma_pagamento = forma_pagamento;
        this.#data_vencimento = data_vencimento;
        this.#data_pagamento = data_pagamento;
        this.#status = status;
        this.#ativo = ativo;
        this.#atualizado = atualizado;
        this.#criado = criado;
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

    get origem_tipo(){
        return this.#origem_tipo;
    }

    set origem_tipo(novoOrigem_tipo){
        this.#origem_tipo = novoOrigem_tipo;
    }

    get valor_total(){
        return this.#valor_total;
    }

    set valor_total(novoValor_total){
        this.#valor_total = novoValor_total;
    } 

    get forma_pagamento(){
        return this.#forma_pagamento;
    }

    set forma_pagamento(novoForma_pagamento){
        this.#forma_pagamento = novoForma_pagamento;
    }

    get data_vencimento(){
        return this.#data_vencimento;
    }

    set data_vencimento(novoData_vencimento){
        this.#data_vencimento = novoData_vencimento;
    } 

    get data_pagamento(){
        return this.#data_pagamento;
    }

    set data_pagamento(novoData_pagamento){
        this.#data_pagamento = novoData_pagamento;
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

    get atualizado(){
        return this.#atualizado;
    }

    set atualizado(novoAtualizado){
        this.#atualizado = novoAtualizado;
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
            cliente:this.#cliente.toJSON(),
            origem_tipo:this.#origem_tipo,
            valor_total:this.#valor_total,
            forma_pagamento:this.#forma_pagamento,
            data_vencimento:this.#data_vencimento,
            data_pagamento:this.#data_pagamento,
            status:this.#status,
            ativo:this.#ativo,
            atualizado:this.#atualizado,
            criado:this.#criado
        }
    }

    async gravar(conexao){
        const contaReceberDAO = new ContaReceberDAO();
        await contaReceberDAO.gravar(this, conexao);
    }
 
    async excluir(conexao){
        const contaReceberDAO = new ContaReceberDAO();
        await contaReceberDAO.excluir(this, conexao);
    }
 
    async alterar(conexao){
        const contaReceberDAO = new ContaReceberDAO();
        await contaReceberDAO.atualizar(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const contaReceberDAO = new ContaReceberDAO();
        return await contaReceberDAO.consultar(this, parametro, conexao);
    }
}