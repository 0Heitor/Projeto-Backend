import FornecedorDAO from '../persistencia/fornecedorDAO.js';

export default class Fornecedor{
    #id
    #codigo
    #nome_fantasia
    #cnpj
    #telefone
    #uf
    #cidade
    #bairro
    #endereco
    #criado
    #ativo

    constructor(id=0, codigo=0, nome_fantasia="", cnpj="", telefone="", uf="", cidade="", bairro="", endereco="", ativo="", criado=""){
        this.#id = id;
        this.#codigo = codigo;
        this.#nome_fantasia = nome_fantasia;
        this.#cnpj = cnpj;
        this.#telefone = telefone;
        this.#uf = uf;
        this.#cidade = cidade;
        this.#bairro = bairro;
        this.#endereco = endereco;
        this.#ativo = ativo;
        this.#criado = criado;
    }

    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;
    }

    get codigo(){
        return this.#codigo;
    }

    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get nome_fantasia(){
        return this.#nome_fantasia;
    }

    set nome_fantasia(novoNome_fantasia){
        this.#nome_fantasia = novoNome_fantasia;
    }

    get cnpj(){
        return this.#cnpj;
    }

    set cnpj(novoCnpj){
        this.#cnpj = novoCnpj;
    }

    get telefone(){
        return this.#telefone;
    }

    set telefone(novoTelefone){
        this.#telefone = novoTelefone;
    }

    get uf(){
        return this.#uf;
    }

    set uf(novoUf){
        this.#uf = novoUf;
    }

    get cidade(){
        return this.#cidade;
    }

    set cidade(novoCidade){
        this.#cidade = novoCidade;
    }

    get bairro(){
        return this.#bairro;
    }

    set bairro(novoBairro){
        this.#bairro = novoBairro;
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

    get criado(){
        return this.#criado;
    }

    set criado(novoCriado){
        this.#criado = novoCriado;
    }

    toJSON(){
        return {
            id:this.#id,
            codigo:this.#codigo,
            nome_fantasia:this.#nome_fantasia,
            cnpj:this.#cnpj,
            telefone:this.#telefone,
            uf:this.#uf,
            cidade:this.#cidade,
            bairro:this.#bairro,
            endereco:this.#endereco,
            ativo:this.#ativo,
            criado:this.#criado            
        }
    }

    async gravar(conexao){
        const fornecedorDAO = new FornecedorDAO();
        await fornecedorDAO.gravar(this, conexao);
    }
 
    async excluir(conexao){
        const fornecedorDAO = new FornecedorDAO();
        await fornecedorDAO.excluir(this, conexao);
    }
 
    async alterar(conexao){
        const fornecedorDAO = new FornecedorDAO();
        await fornecedorDAO.atualizar(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const fornecedorDAO = new FornecedorDAO();
        return await fornecedorDAO.consultar(this, parametro, conexao);
    }
}