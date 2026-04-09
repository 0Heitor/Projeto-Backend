import Produto from '../modelo/produto.js';
import Fornecedor from '../modelo/fornecedor.js';
import Categoriasubgrupo from '../modelo/categoriasubgrupo.js';

export default class ProdutoDAO{

    async gravar(produto, conexao){
        if(produto instanceof Produto){
            const sql = "INSERT INTO produtos (usu_nome, usu_email, usu_senha, usu_nivel, usu_ativo, usu_ultimo_login) VALUES ($1, $2, $3, $4, $5, $6) RETURNING prod_id";
            const parametros = [produto.nome, produto.email, produto.senha, produto.nivel, produto.ativo, produto.ultimo_login];
            const retorno = await conexao.query(sql, parametros);
            produto.id = retorno.rows[0].prod_id;
        }
    }

    async atualizar(produto, conexao){
        if(produto instanceof Produto){
            const sql = "UPDATE produtos SET usu_nome = $1, usu_email = $2, usu_senha = $3, usu_nivel = $4, usu_ativo = $5, usu_ultimo_login = $6 WHERE prod_id = $7";
            const parametros = [produto.nome, produto.email, produto.senha, produto.nivel, produto.ativo, produto.ultimo_login, produto.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(produto, conexao){
        if(produto instanceof Produto){
            const sql = "DELETE FROM produtos WHERE prod_id = $1";
            const parametros = [produto.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(produto, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM produtos WHERE 1=1";
        let parametros=[];
        let listaProdutos = [];
        let totalRegistros = 0;
        let i=1;

        /*if(produto.id && produto.id !== ''){
            sql += ` AND usu_id = $${i}`;
            parametros.push(produto.id);
            i++;
        }
        if(produto.nome && produto.nome !== ''){
            sql += ` AND usu_nome LIKE $${i}`;
            parametros.push(`%${produto.nome}%`);
            i++;
        }
        if(produto.email && produto.email !== ''){
            if(filtro.consulta && filtro.consulta == "equal"){
                sql += ` AND usu_email = $${i}`;
                parametros.push(produto.email);
            }
            else{
                sql += ` AND usu_email LIKE $${i}`;
                parametros.push(`%${produto.email}%`);
            }
            i++;
        }
        if(produto.senha && produto.senha !== ''){
            sql += ` AND usu_senha = $${i}`;
            parametros.push(`%${produto.senha}%`);
            i++;
        }
        if(produto.nivel && produto.nivel !== ''){
            sql += ` AND usu_nivel LIKE $${i}`;
            parametros.push(`%${produto.nivel}%`);
            i++;
        }
        if(produto.ativo !== undefined && produto.ativo != ''){
            sql += ` AND usu_ativo = $${i}`;
            parametros.push(produto.ativo);
            i++;
        }
        if(produto.ultimo_login && produto.ultimo_login != ""){
            sql += ` AND usu_ultimo_login >= $${i}`;
            parametros.push(filtro.ultimo_login);
            i++;
        }
        if(produto.criado && produto.criado != ""){
            sql += ` AND usu_criado_em::date = $${i}`;
            parametros.push(filtro.criado);
            i++;
        }*/
        sql += " ORDER BY prod_codigo_interno ASC";
        if(filtro.limit && filtro.limit != ""){
            sql += ` LIMIT $${i}`;
            parametros.push(parseInt(filtro.limit));
            i++;
        }
        if(filtro.offset && filtro.offset != ""){
            sql += ` OFFSET $${i}`
            parametros.push(parseInt(filtro.offset));
        }

        const resultado = await conexao.query(sql, parametros);
        const registros = resultado.rows;
        totalRegistros = registros.length > 0 ? parseInt(registros[0].total_geral) : 0;
        for(const registro of registros){
            const categoriasubgrupo = new Categoriasubgrupo(registro.prod_sub_id, "", "", "", "", "", "", {});
            const subgrupo = await categoriasubgrupo.consultar({}, conexao);
            const fornecedor = new Fornecedor(registro.prod_fornecedor_id, 0, "", "", "", "", "", "", "", "", "");
            const forn = await fornecedor.consultar({}, conexao);
            const produto = new Produto(registro.prod_id);
            listaProdutos.push(produto);
        }
        return{
            lista: listaProdutos,
            total: totalRegistros
        };
    }

}