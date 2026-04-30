import Cacamba from '../modelo/cacamba.js';
import TipoCacamba from '../modelo/tipoCacamba.js';

export default class CacambaDAO{

    async gravar(cacamba, conexao){
        if(cacamba instanceof Cacamba){
            const sql = "INSERT INTO cacambas (cac_numero, cac_status, cac_modelo, cac_ativo, cac_endereco_atual, cac_tipo_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING cac_id";
            const parametros = [cacamba.numero, cacamba.status, cacamba.modelo, cacamba.ativo, cacamba.endereco_atual, cacamba.tipoCacamba.id];
            const retorno = await conexao.query(sql, parametros);
            cacamba.id = retorno.rows[0].cac_id;
        }
    }

    async atualizar(cacamba, conexao){
        if(cacamba instanceof Cacamba){
            const sql = "UPDATE cacambas SET cac_numero = $1, cac_status = $2, cac_endereco_atual = $3, cac_modelo = $4, cac_ultima_revisao = $5, cac_ativo = $6, cac_atualizado_em = $7, cac_tipo_id = $8 WHERE cac_id = $9";
            const parametros = [cacamba.numero, cacamba.status, cacamba.endereco_atual, cacamba.modelo, cacamba.ultima_revisao, cacamba.ativo, cacamba.atualizado_em, cacamba.tipoCacamba.id, cacamba.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(cacamba, conexao){
        if(cacamba instanceof Cacamba){
            const sql = "DELETE FROM cacambas WHERE cac_id = $1";
            const parametros = [cacamba.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(cacamba, filtro, conexao){
        let sql="SELECT c.*, t.*, COUNT(*) OVER() as total_geral FROM cacambas c INNER JOIN tipos_cacambas t ON c.cac_tipo_id = t.tipo_id WHERE 1=1";
        let parametros=[];
        let listaCacambas = [];
        let totalRegistros = 0;
        let i=1;

        if(cacamba.id && cacamba.id !== '' && cacamba.id !== '0'){
            sql += ` AND c.cac_id = $${i}`;
            parametros.push(cacamba.id);
            i++;
        }
        if(cacamba.numero && cacamba.numero !== ''){
            if(filtro.consulta && filtro.consulta === "equal"){
                sql += ` AND c.cac_numero = $${i}`;
                parametros.push(cacamba.numero);
            } else {
                sql += ` AND c.cac_numero LIKE $${i}`;
                parametros.push(`%${cacamba.numero}%`);
            }
            i++;
        }
        /*if(cacamba.tamanho && cacamba.tamanho !== ''){
            sql += ` AND c.cac_tamanho = $${i}`;
            parametros.push(cacamba.tamanho);
            i++;
        }*/
        if(cacamba.status && cacamba.status !== ''){
            sql += ` AND c.cac_status = $${i}`;
            parametros.push(cacamba.status);
            i++;
        }
        if(cacamba.endereco_atual && cacamba.endereco_atual !== ''){
            sql += ` AND c.cac_endereco_atual LIKE $${i}`;
            parametros.push(`%${cacamba.endereco_atual}%`);
            i++;
        }
        if(cacamba.modelo && cacamba.modelo !== ''){
            sql += ` AND c.cac_modelo LIKE $${i}`;
            parametros.push(`%${cacamba.modelo}%`);
            i++;
        }
        if(cacamba.ativo !== undefined && cacamba.ativo !== ''){
            sql += ` AND c.cac_ativo = $${i}`;
            parametros.push(cacamba.ativo);
            i++;
        }
        if(cacamba.ultima_revisao && cacamba.ultima_revisao !== ""){
            sql += ` AND c.cac_ultima_revisao = $${i}`;
            parametros.push(cacamba.ultima_revisao);
            i++;
        }
        if(cacamba.criado_em && cacamba.criado_em !== ""){
            sql += ` AND c.cac_criado_em::date = $${i}`;
            parametros.push(cacamba.criado_em);
            i++;
        }
        if(cacamba.atualizado_em && cacamba.atualizado_em !== ""){
            sql += ` AND c.cac_atualizado_em::date = $${i}`;
            parametros.push(cacamba.atualizado_em);
            i++;
        }
        sql += " ORDER BY c.cac_numero ASC";
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
            const tipo = new TipoCacamba(registro.tipo_id, registro.tipo_nome, registro.tipo_volume, registro.tipo_preco, registro.tipo_descricao, registro.tipo_ativo, registro.tipo_atualizado_em, registro.tipo_criado_em);
            const cacamba = new Cacamba(registro.cac_id, tipo, registro.cac_numero, registro.cac_status, registro.cac_modelo, registro.cac_endereco_atual , registro.cac_ultima_revisao, registro.cac_ativo, registro.cac_atualizado_em, registro.cac_criado_em);
            listaCacambas.push(cacamba);
        }
        return{
            lista: listaCacambas,
            total: totalRegistros
        };
    }
}