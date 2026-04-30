import Categoriasubgrupo from '../modelo/categoriasubgrupo.js';
import Categoriagrupo from '../modelo/categoriagrupo.js';

export default class CategoriaSubGrupoDAO{

    async gravar(categoria, conexao){
        if(categoria instanceof Categoriasubgrupo){
            const sql = "INSERT INTO categorias_subgrupo (sub_nome, sub_ncm_padrao, sub_localizacao_padrao, sub_ativo, sub_atualizado_em, sub_criado_em, sub_grp_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING sub_id";
            const parametros = [categoria.nome, categoria.ncm_padrao, categoria.localizacao, categoria.ativo, categoria.categoriagrupo.id];
            const retorno = await conexao.query(sql, parametros);
            categoria.id = retorno.rows[0].sub_id;
        }
    }

    async atualizar(categoria, conexao){
        if(categoria instanceof Categoriasubgrupo){
            const sql = "UPDATE categorias_subgrupo SET sub_nome = $1, sub_ncm_padrao = $2, sub_localizacao_padrao = $3, sub_ativo = $4, sub_atualizado_em = $5, sub_grp_id = $6 WHERE sub_id = $7";
            const parametros = [categoria.nome, categoria.ncm_padrao, categoria.localizacao, categoria.ativo, categoria.atualizado, categoria.categoriagrupo.id, categoria.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(categoria, conexao){
        if(categoria instanceof Categoriasubgrupo){
            const sql = "DELETE FROM categorias_subgrupo WHERE sub_id = $1";
            const parametros = [categoria.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(categoria, filtro, conexao){
        let sql="SELECT s.*, g.*, COUNT(*) OVER() as total_geral FROM categorias_subgrupo s INNER JOIN categorias_grupo g ON s.sub_grp_id = g.grp_id WHERE 1=1";
        let parametros=[];
        let listaCategorias = [];
        let totalRegistros = 0;
        let i=1;

        if(categoria.id && categoria.id !== ''){
            sql += ` AND s.sub_id = $${i}`;
            parametros.push(categoria.id);
            i++;
        }
        if(categoria.nome && categoria.nome !== ''){
            sql += ` AND s.sub_nome LIKE $${i}`;
            parametros.push(`%${categoria.nome}%`);
            i++;
        }
        if(categoria.ncm_padrao && categoria.ncm_padrao !== ''){
            if(filtro.consulta && filtro.consulta == "equal"){
                sql += ` AND s.sub_ncm_padrao = $${i}`;
                parametros.push(categoria.ncm_padrao);
            }
            else{
                sql += ` AND s.sub_ncm_padrao LIKE $${i}`;
                parametros.push(`%${categoria.ncm_padrao}%`);
            }
            i++;
        }
        if(categoria.localizacao && categoria.localizacao !== ''){
            sql += ` AND s.sub_localizacao_padrao = $${i}`;
            parametros.push(`%${categoria.localizacao}%`);
            i++;
        }
        if(categoria.ativo !== undefined && categoria.ativo != ''){
            sql += ` AND s.sub_ativo = $${i}`;
            parametros.push(categoria.ativo);
            i++;
        }
        if(categoria.atualizado && categoria.atualizado != ""){
            sql += ` AND s.sub_atualizado_em ::date = $${i}`;
            parametros.push(filtro.atualizado);
            i++;
        }
        if(categoria.criado && categoria.criado != ""){
            sql += ` AND s.sub_criado_em::date = $${i}`;
            parametros.push(filtro.criado);
            i++;
        }
        sql += " ORDER BY s.sub_nome ASC";
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
            const categoriagrupo = new Categoriagrupo(registro.grp_id, registro.grp_nome, registro.grp_margem_lucro_sugerida, registro.grp_comissao_padrao, registro.grp_ativo, registro.grp_atualizado_em, registro.grp_criado_em);
            const categoria = new Categoriasubgrupo(registro.sub_id, categoriagrupo, registro.sub_nome, registro.sub_ncm_padrao, registro.sub_localizacao_padrao, registro.sub_ativo, registro.sub_atualizado_em, registro.sub_criado_em);
            listaCategorias.push(categoria);
        }
        return{
            lista: listaCategorias,
            total: totalRegistros
        };
    }
}