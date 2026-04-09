import CategoriaSubGrupoDAO from '../persistencia/categoriaSubGrupoDAO.js';

export default class Categoriasubgrupo{
    #id
    #categoriagrupo
    #nome
    #ncm_padrao
    #localizacao
    #ativo
    #atualizado
    #criado

    constructor(id=0, nome="", ncm_padrao="", localizacao="", ativo="", atualizado="", criado="", categoriagrupo={}){
        this.#id = id;
        this.#nome = nome;
        this.#ncm_padrao = ncm_padrao;
        this.#localizacao = localizacao;
        this.#ativo = ativo;
        this.#atualizado = atualizado;
        this.#criado = criado;
        this.#categoriagrupo = categoriagrupo;
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

    get ncm_padrao(){
        return this.#ncm_padrao;
    }

    set ncm_padrao(novoNcm_padrao){
        this.#ncm_padrao = novoNcm_padrao;
    }

    get localizacao(){
        return this.#localizacao;
    }

    set localizacao(novoLocalizacao){
        this.#localizacao = novoLocalizacao;
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

    get categoriagrupo(){
        return this.#categoriagrupo;
    }

    set categoriagrupo(novoCategoriagrupo){
        this.#categoriagrupo = novoCategoriagrupo;
    }

    toJSON(){
        return {
            id:this.#id,
            nome:this.#nome,
            ncm_padrao:this.#ncm_padrao,
            localizacao:this.#localizacao,
            ativo:this.#ativo,
            atualizado:this.#atualizado,
            criado:this.#criado,
            categoriaGrupo:this.#categoriagrupo.toJSON()
        }
    }

    async gravar(conexao){
        const categoriasubgrupoDAO = new CategoriaSubGrupoDAO();
        await categoriasubgrupoDAO.gravar(this, conexao);
    }
 
    async excluir(conexao){
        const categoriasubgrupoDAO = new CategoriaSubGrupoDAO();
        await categoriasubgrupoDAO.excluir(this, conexao);
    }
 
    async alterar(conexao){
        const categoriasubgrupoDAO = new CategoriaSubGrupoDAO();
        await categoriasubgrupoDAO.atualizar(this, conexao);
    }
 
    async consultar(parametro, conexao){
        const categoriasubgrupoDAO = new CategoriaSubGrupoDAO();
        return await categoriasubgrupoDAO.consultar(this, parametro, conexao);
    }
}