import ClienteDAO from '../persistencia/clienteDAO.js';

export default class Cliente{
    #id
    #nome
    #cpf_cnpj
    #rg
    #data_nascimento
    #profissao
    #local_trabalho
    #telefone
    #cep
    #endereco
    #ativo
    #observacoes
    #criado

    constructor(id=0, nome="", cpf_cnpj="", rg="", data_nascimento="", profissao="", local_trabalho="", telefone="", cep="", endereco="", ativo="", observacoes="", criado=""){
        this.#id = id;
        this.#nome = nome;
        this.#cpf_cnpj = cpf_cnpj;
        this.#rg = rg;
        this.#data_nascimento = data_nascimento;
        this.#profissao = profissao;
        this.#local_trabalho = local_trabalho;
        this.#telefone = telefone;
        this.#cep = cep;
        this.#endereco = endereco;
        this.ativo = ativo;
        this.#observacoes = observacoes;
        this.#criado = criado;
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

    get cpf_cnpj(){
        return this.#cpf_cnpj;
    }

    set cpf_cnpj(novoCpf_cnpj){
        this.#cpf_cnpj = novoCpf_cnpj;
    }

    get rg(){
        return this.#rg;
    }

    set rg(novoRg){
        this.#rg = novoRg;
    }

    get data_nascimento(){
        return this.#data_nascimento;
    }

    set data_nascimento(novoData_nascimento){
        this.#data_nascimento = novoData_nascimento;
    }

    get profissao(){
        return this.#profissao;
    }

    set profissao(novoProfissao){
        this.#profissao = novoProfissao;
    }

    get local_trabalho(){
        return this.#local_trabalho;
    }

    set local_trabalho(novoLocal_trabalho){
        this.#local_trabalho = novoLocal_trabalho;
    }

    get telefone(){
        return this.#telefone;
    }

    set telefone(novoTelefone){
        this.#telefone = novoTelefone;
    }

    get cep(){
        return this.#cep;
    }

    set cep(novoCep){
        this.#cep = novoCep;
    }

    get endereco(){
        return this.#endereco;
    }

    set endereco(novoEndereco){
        this.#endereco = novoEndereco;
    }

    get ativo(){
        return this.#ativo;
    }

    set ativo(novoAtivo){
        this.#ativo = novoAtivo;
    }

    get observacoes(){
        return this.#observacoes;
    }

    set observacoes(novoObservacoes){
        this.#observacoes = novoObservacoes;
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
            nome:this.#nome,
            cpf_cnpj:this.#cpf_cnpj,
            rg:this.#rg,
            data_nascimento:this.#data_nascimento,
            profissao:this.#profissao,
            local_trabalho:this.#local_trabalho,
            telefone:this.#telefone,
            cep:this.#cep,
            endereco:this.#endereco,
            ativo:this.ativo,
            observacoes:this.#observacoes,
            criado:this.#criado
        }
    }

    async gravar(conexao){
        const clienteDAO = new ClienteDAO();
        await clienteDAO.gravar(this, conexao);
    }
 
    async excluir(conexao){
        const clienteDAO = new ClienteDAO();
        await clienteDAO.excluir(this, conexao);
    }
 
    async alterar(conexao){
        const clienteDAO = new ClienteDAO();
        await clienteDAO.atualizar(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const clienteDAO = new ClienteDAO();
        return await clienteDAO.consultar(this, parametro, conexao);
    }
}