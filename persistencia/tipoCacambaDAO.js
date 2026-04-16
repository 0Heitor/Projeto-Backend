import tipoCacamba from "../modelo/tipoCacamba.js";

export default class TipoCacambaDAO{

    async gravar(tipo, conexao){
        if(tipo instanceof tipoCacamba){
            const sql = "INSERT INTO tipos_cacambas (tipo_nome, tipo_volume, tipo_preco, tipo_descricao, tipo_ativo) VALUES ($1, $2, $3, $4, $5) RETURNING tipo_id";
            const parametros = [tipo.nome, tipo.volume, tipo.preco, tipo.descricao, tipo.ativo];
            const retorno = await conexao.query(sql, parametros);
            tipo.id = retorno.rows[0].tipo_id;
        }
    }

    async atualizar(tipo, conexao){
        if(tipo instanceof tipoCacamba){
            const sql = "UPDATE tipos_cacambas SET tipo_nome = $1, tipo_volume = $2, tipo_preco = $3, tipo_descricao = $4, tipo_ativo = $5, tipo_atualizado_em = $6 WHERE tipo_id = $7";
            const parametros = [tipo.nome, tipo.volume, tipo.preco, tipo.descricao, tipo.ativo, tipo.atualizado_em, tipo.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(tipo, conexao){
        if(tipo instanceof tipoCacamba){
            const sql = "DELETE FROM tipos_cacambas WHERE tipo_id = $1";
            const parametros = [tipo.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(tipo, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM tipos_cacambas WHERE 1=1";
        let parametros=[];
        let listaTipos = [];
        let totalRegistros = 0;
        let i=1;

        if(tipo.id && tipo.id !== '' && tipo.id !== '0'){
            sql += ` AND tipo_id = $${i}`;
            parametros.push(tipo.id);
            i++;
        }
        if(tipo.nome && tipo.nome !== ''){
            if(filtro.consulta && filtro.consulta === "equal"){
                sql += ` AND tipo_nome = $${i}`;
                parametros.push(tipo.nome);
            } else {
                sql += ` AND tipo_nome LIKE $${i}`;
                parametros.push(`%${tipo.nome}%`);
            }
            i++;
        }
        if(tipo.volume && tipo.volume !== ''){
            sql += ` AND tipo_volume = $${i}`;
            parametros.push(tipo.volume);
            i++;
        }
        if(tipo.preco && tipo.preco !== ''){
            sql += ` AND tipo_preco = $${i}`;
            parametros.push(tipo.preco);
            i++;
        }
        if(tipo.ativo !== undefined && tipo.ativo != ''){
            sql += ` AND tipo_ativo = $${i}`;
            parametros.push(tipo.ativo);
            i++;
        }
        sql += " ORDER BY tipo_nome ASC";
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
        totalRegistros = resultado.rows.length > 0 ? parseInt(resultado.rows[0].total_geral) : 0;
        for(const registro of registros){
            const tipo = new tipoCacamba(registro.tipo_id, registro.tipo_nome, registro.tipo_volume, registro.tipo_preco, registro.tipo_descricao, registro.tipo_ativo, registro.tipo_criado_em, registro.tipo_atualizado_em);
            listaTipos.push(tipo);
        }
        return {
            lista: listaTipos, 
            total: totalRegistros
        };
    }
}