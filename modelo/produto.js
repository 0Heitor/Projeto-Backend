import ProdutoDAO from '../persistencia/produtoDAO.js';

export default class Produto{
    #id
    #categoriasubgrupo
    #fornecedor
    #codigo
    #codigo_de_barras
    #descricao
    #descricao_marca
    #unidade_medida
    #preco_custo
    #preco_venda
    #margem_lucro
    #percentual_financeiro
    #tributacao
    #estoque
    #ativo
    #atualizado
    #criado


    constructor(id=0, categoriasubgrupo={}, fornecedor={}, codigo="", codigo_de_barras="", descricao="", descricao_marca="", unidade_medida="", preco_custo=0, preco_venda=0, margem_lucro=0, percentual_financeiro=0, tributacao=0, estoque=0, ativo="", atualizado="", criado=""){
        this.#id = id;
        this.#categoriasubgrupo = categoriasubgrupo;
        this.#fornecedor = fornecedor;
        this.#codigo = codigo;
        this.#codigo_de_barras = codigo_de_barras;
        this.#descricao = descricao;
        this.#descricao_marca = descricao_marca;
        this.#unidade_medida = unidade_medida;
        this.#preco_custo = preco_custo;
        this.#preco_venda = preco_venda;
        this.#margem_lucro = margem_lucro;
        this.#percentual_financeiro = percentual_financeiro;
        this.#tributacao = tributacao;
        this.#estoque = estoque;
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

    get categoriasubgrupo(){
        return this.#categoriasubgrupo;
    }

    set categoriasubgrupo(novoCategoriasubgrupo){
        this.#categoriasubgrupo = novoCategoriasubgrupo;
    }

    get fornecedor(){
        return this.#fornecedor;
    }

    set fornecedor(novoFornecedor){
        this.#fornecedor = novoFornecedor;
    }

    get codigo(){
        return this.#codigo;
    }

    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    } 

    get codigo_de_barras(){
        return this.#codigo_de_barras;
    }

    set codigo_de_barras(novoCodigo_de_barras){
        this.#codigo_de_barras = novoCodigo_de_barras;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(novoDescricao){
        this.#descricao = novoDescricao;
    } 

    get descricao_marca(){
        return this.#descricao_marca;
    }

    set descricao_marca(novoDescricao_marca){
        this.#descricao_marca = novoDescricao_marca;
    } 

    get unidade_medida(){
        return this.#unidade_medida;
    }

    set unidade_medida(novoUnidade_medida){
        this.#unidade_medida = novoUnidade_medida;
    } 

    get preco_custo(){
        return this.#preco_custo;
    }

    set preco_custo(novoPreco_custo){
        this.#preco_custo = novoPreco_custo;
    }

    get preco_venda(){
        return this.#preco_venda;
    }

    set preco_venda(novoPreco_venda){
        this.#preco_venda = novoPreco_venda;
    }

    get margem_lucro(){
        return this.#margem_lucro;
    }

    set margem_lucro(novoMargem_lucro){
        this.#margem_lucro = novoMargem_lucro;
    }

    get percentual_financeiro(){
        return this.#percentual_financeiro;
    }

    set percentual_financeiro(novoPercentual_financeiro){
        this.#percentual_financeiro = novoPercentual_financeiro;
    }

    get tributacao(){
        return this.#tributacao;
    }

    set tributacao(novoTributacao){
        this.#tributacao = novoTributacao;
    }

    get estoque(){
        return this.#estoque;
    }

    set estoque(novoEstoque){
        this.#estoque = novoEstoque;
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
            categoriasubgrupo:this.#categoriasubgrupo.toJSON(),
            fornecedor:this.#fornecedor.toJSON(),
            codigo:this.#codigo,
            codigo_de_barras:this.#codigo_de_barras,
            descricao:this.#descricao,
            descricao_marca:this.#descricao_marca,
            unidade_medida:this.#unidade_medida,
            preco_custo:this.#preco_custo,
            preco_venda:this.#preco_venda,
            margem_lucro:this.#margem_lucro,
            percentual_financeiro:this.#percentual_financeiro,
            tributacao:this.#tributacao,
            estoque:this.#estoque,
            ativo:this.#ativo,
            atualizado:this.#atualizado,
            criado:this.#criado
        }
    }

    async gravar(conexao){
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.gravar(this, conexao);
    }
 
    async excluir(conexao){
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.excluir(this, conexao);
    }
 
    async alterar(conexao){
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.atualizar(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const produtoDAO = new ProdutoDAO();
        return await produtoDAO.consultar(this, parametro, conexao);
    }
}