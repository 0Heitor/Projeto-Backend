import Cacamba from '../modelo/cacamba.js';

export default class CacambaDAO{

    async gravar(cacamba, conexao){
        if(cacamba instanceof Cacamba){
            const sql = "INSERT INTO cacambas (cac_numero, cac_tamanho, cac_status, cac_modelo, cac_ativo) VALUES ($1, $2, $3, $4, $5) RETURNING cac_id";
            const parametros = [cacamba.numero, cacamba.tamanho, cacamba.status, cacamba.modelo, cacamba.ativo];
            const retorno = await conexao.query(sql, parametros);
            cacamba.id = retorno.rows[0].cac_id;
        }
    }

    async atualizar(cacamba, conexao){
        if(cacamba instanceof Cacamba){
            const sql = "UPDATE cacambas SET cac_numero = $1, cac_tamanho = $2, cac_status = $3, cac_modelo = $4, cac_ultima_revisao = $5, cac_ativo = $6, cac_atualizado_em = $7 WHERE cac_id = $8";
            const parametros = [cacamba.numero, cacamba.tamanho, cacamba.status, cacamba.modelo, cacamba.ultima_revisao, cacamba.ativo, cacamba.atualizado_em, cacamba.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(cacamba, conexao){
        if(cacamba instanceof cacamba){
            const sql = "DELETE FROM cacambas WHERE cac_id = $1";
            const parametros = [cacamba.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(cacamba, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM cacambas WHERE 1=1";
        let parametros=[];
        let listaCacambas = [];
        let totalRegistros = 0;
        let i=1;

        if(cacamba.id && cacamba.id !== '' && cacamba.id !== '0'){
            sql += ` AND cac_id = $${i}`;
            parametros.push(cacamba.id);
            i++;
        }
        if(cacamba.numero && cacamba.numero !== ''){
            if(filtro.consulta && filtro.consulta === "equal"){
                sql += ` AND cac_numero = $${i}`;
                parametros.push(cacamba.numero);
            } else {
                sql += ` AND cac_numero LIKE $${i}`;
                parametros.push(`%${cacamba.numero}%`);
            }
            i++;
        }
        if(cacamba.tamanho && cacamba.tamanho !== ''){
            sql += ` AND cac_tamanho = $${i}`;
            parametros.push(cacamba.tamanho);
            i++;
        }
        if(cacamba.status && cacamba.status !== ''){
            sql += ` AND cac_status = $${i}`;
            parametros.push(cacamba.status);
            i++;
        }
        if(cacamba.modelo && cacamba.modelo !== ''){
            sql += ` AND cac_modelo LIKE $${i}`;
            parametros.push(`%${cacamba.modelo}%`);
            i++;
        }
        if(cacamba.ativo !== undefined && cacamba.ativo !== ''){
            sql += ` AND cac_ativo = $${i}`;
            parametros.push(cacamba.ativo);
            i++;
        }
        if(cacamba.ultima_revisao && cacamba.ultima_revisao !== ""){
            sql += ` AND cac_ultima_revisao = $${i}`;
            parametros.push(cacamba.ultima_revisao);
            i++;
        }
        if(cacamba.criado_em && cacamba.criado_em !== ""){
            sql += ` AND cac_criado_em::date = $${i}`;
            parametros.push(cacamba.criado_em);
            i++;
        }
        if(cacamba.atualizado_em && cacamba.atualizado_em !== ""){
            sql += ` AND cac_atualizado_em::date = $${i}`;
            parametros.push(cacamba.atualizado_em);
            i++;
        }
        sql += " ORDER BY cac_numero ASC";
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
            const cacamba = new Cacamba(registro.cac_id, registro.cac_numero, registro.cac_tamanho, registro.cac_status, registro.cac_modelo, registro.cac_ultima_revisao, registro.cac_ativo, registro.cac_atualizado_em, registro.cac_criado_em);
            listaCacambas.push(cacamba);
        }
        return{
            lista: listaCacambas,
            total: totalRegistros
        };
    }
}