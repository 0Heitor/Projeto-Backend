import CategoriaGrupoDAO from '../persistencia/categoriaGrupoDAO.js';

export default class Categoriagrupo{
    #id
    #nome
    #margem_lucro
    #comissao_padrao
    #ativo
    #atualizado
    #criado


    constructor(id=0, nome="", margem_lucro="", comissao_padrao="", ativo="", atualizado="", criado=""){
        this.#id = id;
        this.#nome = nome;
        this.#margem_lucro = margem_lucro;
        this.#comissao_padrao = comissao_padrao;
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

    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome = novoNome;
    }

    get margem_lucro(){
        return this.#margem_lucro;
    }

    set margem_lucro(novoMargem_lucro){
        this.#margem_lucro = novoMargem_lucro;
    }

    get comissao_padrao(){
        return this.#comissao_padrao;
    }

    set comissao_padrao(novoComissao_padrao){
        this.#comissao_padrao = novoComissao_padrao;
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
            nome:this.#nome,
            margem_lucro:this.#margem_lucro,
            comissao_padrao:this.#comissao_padrao,
            ativo:this.#ativo,
            atualizado:this.#atualizado,
            criado:this.#criado
        }
    }

    async gravar(conexao){
        const categoriagrupoDAO = new CategoriaGrupoDAO();
        await categoriagrupoDAO.gravar(this, conexao);
    }
 
    async excluir(conexao){
        const categoriagrupoDAO = new CategoriaGrupoDAO();
        await categoriagrupoDAO.excluir(this, conexao);
    }
 
    async alterar(conexao){
        const categoriagrupoDAO = new CategoriaGrupoDAO();
        await categoriagrupoDAO.atualizar(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const categoriagrupoDAO = new CategoriaGrupoDAO();
        return await categoriagrupoDAO.consultar(this, parametro, conexao);
    }
}