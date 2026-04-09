import Categoriagrupo from '../modelo/categoriagrupo.js';

export default class CategoriaGrupoDAO{

    async gravar(categoria, conexao){
        if(categoria instanceof Categoriagrupo){
            const sql = "INSERT INTO categorias_grupo (grp_nome, grp_margem_lucro_sugerida, grp_comissao_padrao, grp_ativo) VALUES ($1, $2, $3, $4) RETURNING grp_id";
            const parametros = [categoria.nome, categoria.margem_lucro, categoria.comissao_padrao, categoria.ativo];
            const retorno = await conexao.query(sql, parametros);
            categoria.id = retorno.rows[0].grp_id;
        }
    }

    async atualizar(categoria, conexao){
        if(categoria instanceof Categoriagrupo){
            const sql = "UPDATE categorias_grupo SET grp_nome = $1, grp_margem_lucro_sugerida = $2, grp_comissao_padrao = $3, grp_ativo = $4, grp_atualizado_em = $5 WHERE grp_id = $6";
            const parametros = [categoria.nome, categoria.margem_lucro, categoria.comissao_padrao, categoria.ativo, categoria.atualizado, categoria.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(categoria, conexao){
        if(categoria instanceof Categoriagrupo){
            const sql = "DELETE FROM categorias_grupo WHERE grp_id = $1";
            const parametros = [categoria.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(categoria, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM categorias_grupo WHERE 1=1";
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
        }
        sql += " ORDER BY grp_nome ASC";
        if(filtro.limit && filtro.limit != ""){
            sql += ` LIMIT $${i}`;
            parametros.push(parseInt(filtro.limit));
            i++;
        }
        if(filtro.offset && filtro.offset != ""){
            sql += ` OFFSET $${i}`
            parametros.push(parseInt(filtro.offset));
        }*/

        const resultado = await conexao.query(sql, parametros);
        const registros = resultado.rows;
        totalRegistros = registros.length > 0 ? parseInt(registros[0].total_geral) : 0;
        for(const registro of registros){
            const categoria = new Categoriagrupo(registro.grp_id, registro.grp_nome, registro.grp_margem_lucro_sugerida, registro.grp_comissao_padrao, registro.grp_ativo, registro.grp_atualizada_em, registro.grp_criado_em);
            listaCategorias.push(categoria);
        }
        return{
            lista: listaCategorias,
            total: totalRegistros
        };
    }

}