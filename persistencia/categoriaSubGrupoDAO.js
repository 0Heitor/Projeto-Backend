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
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM categorias_subgrupo WHERE 1=1";
        let parametros=[];
        let listaCategorias = [];
        let totalRegistros = 0;
        let i=1;

        /*if(usuario.id && usuario.id !== ''){
            sql += ` AND usu_id = $${i}`;
            parametros.push(usuario.id);
            i++;
        }
        if(usuario.nome && usuario.nome !== ''){
            sql += ` AND usu_nome LIKE $${i}`;
            parametros.push(`%${usuario.nome}%`);
            i++;
        }
        if(usuario.email && usuario.email !== ''){
            if(filtro.consulta && filtro.consulta == "equal"){
                sql += ` AND usu_email = $${i}`;
                parametros.push(usuario.email);
            }
            else{
                sql += ` AND usu_email LIKE $${i}`;
                parametros.push(`%${usuario.email}%`);
            }
            i++;
        }
        if(usuario.senha && usuario.senha !== ''){
            sql += ` AND usu_senha = $${i}`;
            parametros.push(`%${usuario.senha}%`);
            i++;
        }
        if(usuario.nivel && usuario.nivel !== ''){
            sql += ` AND usu_nivel LIKE $${i}`;
            parametros.push(`%${usuario.nivel}%`);
            i++;
        }
        if(usuario.ativo !== undefined && usuario.ativo != ''){
            sql += ` AND usu_ativo = $${i}`;
            parametros.push(usuario.ativo);
            i++;
        }
        if(usuario.ultimo_login && usuario.ultimo_login != ""){
            sql += ` AND usu_ultimo_login >= $${i}`;
            parametros.push(filtro.ultimo_login);
            i++;
        }
        if(usuario.criado && usuario.criado != ""){
            sql += ` AND usu_criado_em::date = $${i}`;
            parametros.push(filtro.criado);
            i++;
        }*/
        sql += " ORDER BY usu_nome ASC";
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
            //Fazer uma busca por id em Categoriagrupo
            const categoriagrupo = new Categoriagrupo(registro.sub_grp_id, "", "", "", "", "", "");
            const grupo = await categoriagrupo.consultar({}, conexao);
            const categoria = new Categoriasubgrupo(registro.sub_id, registro.sub_nome, registro.sub_ncm_padrao, registro.sub_localizacao_padrao, registro.sub_ativo, registro.sub_atualizado_em, registro.sub_criado_em, grupo.listaCategorias);
            listaCategorias.push(categoria);
        }
        return{
            lista: listaCategorias,
            total: totalRegistros
        };
    }
}