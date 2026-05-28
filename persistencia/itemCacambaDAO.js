import Cacamba from "../modelo/cacamba.js";
import ItemCacamba from "../modelo/itemCacamba.js";

export default class ItemCacambaDAO{
    async gravar(item, conexao){
        if(item instanceof ItemCacamba){
            const sql = "INSERT INTO itens_cacamba (itc_loc_id, itc_cac_id, itc_valor_unitario, itc_status_item) VALUES ($1, $2, $3, $4) RETURNING itc_id";
            const parametros = [item.locacao.id, item.cacamba.id, item.valor_unitario, item.status_item];
            const retorno = await conexao.query(sql, parametros);
            item.id = retorno.rows[0].itc_id;
        }
    }
    
    async atualizar(item, conexao){
        if(item instanceof ItemCacamba){
            const sql = "UPDATE itens_cacamba SET itc_loc_id = $1, itc_cac_id = $2, itc_valor_unitario = $3, itc_data_retirada_real = $4, itc_status_item = $5, itc_ativo = $6, itc_atualizado_em = $7 WHERE itc_id = $8";
            const parametros = [item.locacao.id, item.cacamba.id, item.valor_unitario, item.data_retirada_real, item.status_item, item.ativo, item.atualizado_em, item.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(item, conexao){
        if(item instanceof ItemCacamba){
            const sql = "DELETE FROM itens_cacamba WHERE itc_id = $1";
            const parametros = [item.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(item, filtro, conexao){
        let sql="SELECT i.*, c.*, COUNT(*) OVER() as total_geral FROM itens_cacamba i INNER JOIN cacambas c ON i.itc_cac_id = c.cac_id WHERE 1=1";
        let parametros=[];
        let listaItens = [];
        let totalRegistros = 0;
        let i=1;

        if(item.id && item.id !== '' && item.id !== '0'){
            sql += ` AND i.itc_id = $${i}`;
            parametros.push(item.id);
            i++;
        }
        if(item.locacao && item.locacao.id && item.locacao.id !== '' && item.locacao.id !== '0'){
            sql += ` AND i.itc_loc_id = $${i}`;
            parametros.push(item.locacao.id);
            i++;
        }
        if(item.cacamba && item.cacamba.id && item.cacamba.id !== '' && item.cacamba.id !== '0'){
            sql += ` AND i.itc_cac_id = $${i}`;
            parametros.push(item.cacamba.id);
            i++;
        }
        if(item.ativo !== undefined && item.ativo !== ''){
            sql += ` AND i.itc_ativo = $${i}`;
            parametros.push(item.ativo);
            i++;
        }
        /*if(item.data_compra && item.data_compra !== ""){
            sql += ` AND c.com_data_compra::date = $${i}`;
            parametros.push(item.data_compra);
            i++;
        }
        if(item.criado_em && item.criado_em !== ""){
            sql += ` AND c.com_criado_em::date = $${i}`;
            parametros.push(item.criado_em);
            i++;
        }
        if(item.atualizado_em && item.atualizado_em !== ""){
            sql += ` AND c.com_atualizado_em::date = $${i}`;
            parametros.push(item.atualizado_em);
            i++;
        }*/
        sql += " ORDER BY c.cac_id DESC";
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
            const cacamba = new Cacamba(registro.itc_cac_id, {}, "", "", "", "", "", "", "","");
            const cac = await cacamba.consultar({}, conexao);
            const item = new ItemCacamba(registro.itc_id, registro.itc_loc_id, cac.lista[0], registro.itc_valor_unitario, registro.itc_data_retirada_real, registro.itc_status_item, registro.itc_ativo, registro.itc_atualizado_em, registro.itc_criado_em);
            listaItens.push(item);
        }
        return{
            lista: listaItens,
            total: totalRegistros
        };
    }
}