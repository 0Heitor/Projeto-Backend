import Compra from '../modelo/compra.js';
import Fornecedor from '../modelo/fornecedor.js';
import ItemCompra from '../modelo/itemCompra.js';
//import Usuario from '../modelo/usuario.js';

export default class CompraDAO{
    async gravar(compra, conexao){
        if(compra instanceof Compra){
            const sql = "INSERT INTO compras (com_for_id, com_valor_total, com_ativo) VALUES ($1, $2, $3) RETURNING com_id";
            const parametros = [compra.fornecedor.id, compra.valor_total, compra.ativo];
            const retorno = await conexao.query(sql, parametros);
            compra.id = retorno.rows[0].com_id;
        }
    }

    async atualizar(compra, conexao){
        if(compra instanceof Compra){
            const sql = "UPDATE compras SET com_for_id = $1, com_data_compra = $2, com_valor_total = $3, com_ativo = $4, com_atualizado_em = $5 WHERE com_id = $6";
            const parametros = [compra.fornecedor.id, compra.data_compra, compra.valor_total/*, compra.status*/, compra.ativo, compra.atualizado_em, compra.id];
            await conexao.query(sql, parametros);
        }
    }

    //Feito
    async excluir(compra, conexao){
        if(compra instanceof Compra){
            const sql = "DELETE FROM compras WHERE com_id = $1";
            const parametros = [compra.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(compra, filtro, conexao){
        let sql = `
            SELECT 
                c.*, 
                f.*, 
                COUNT(*) OVER() as total_geral
            FROM compras c 
            INNER JOIN fornecedores f ON c.com_for_id = f.for_id  
            WHERE 1=1`;
        //(SELECT json_agg(i.*) FROM itens_compra i WHERE i.itc_com_id = c.com_id) AS itens_compra
        let parametros=[];
        let listaCompras = [];
        let totalRegistros = 0;
        let i=1;

        if(compra.id && compra.id !== '' && compra.id !== '0'){
            sql += ` AND c.com_id = $${i}`;
            parametros.push(compra.id);
            i++;
        }
        if(compra.fornecedor && compra.fornecedor.nome_fantasia !== ''){
            sql += ` AND f.for_nome_fantasia LIKE $${i}`;
                parametros.push(`%${compra.fornecedor.nome_fantasia}%`);
            i++;
        }
        /*if(compra.usuario && compra.usuario !== ''){
            sql += ` AND u.usu_nome LIKE $${i}`;
            parametros.push(`%${compra.usuario.nome}%`);
            i++;
        }*/
        if(compra.valor_total && compra.valor_total !== ""){
            sql += ` AND c.com_valor_total = $${i}`;
            parametros.push(compra.valor_total);
            i++;
        }
        if(compra.status && compra.status !== ''){
            sql += ` AND c.com_status = $${i}`;
            parametros.push(compra.status);
            i++;
        }
        if(compra.ativo !== undefined && compra.ativo !== ''){
            sql += ` AND c.com_ativo = $${i}`;
            parametros.push(compra.ativo);
            i++;
        }
        if(compra.data_compra && compra.data_compra !== ""){
            sql += ` AND c.com_data_compra::date = $${i}`;
            parametros.push(compra.data_compra);
            i++;
        }
        if(compra.criado_em && compra.criado_em !== ""){
            sql += ` AND c.com_criado_em::date = $${i}`;
            parametros.push(compra.criado_em);
            i++;
        }
        if(compra.atualizado_em && compra.atualizado_em !== ""){
            sql += ` AND c.com_atualizado_em::date = $${i}`;
            parametros.push(compra.atualizado_em);
            i++;
        }
        sql += " ORDER BY c.com_data_compra DESC";
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
        i = 0;
        totalRegistros = registros.length > 0 ? parseInt(registros[0].total_geral) : 0;
        for(const registro of registros){
            //const usuario = new Usuario(registro.usu_id, registro.usu_nome, registro.usu_email, "", registro.usu_nivel, registro.usu_ativo, registro.usu_ultimo_login, registro.usu_criado_em, "", "", 0);
            const fornecedor = new Fornecedor(registro.for_id, registro.for_codigo, registro.for_nome_fantasia, registro.for_cnpj, registro.for_telefone, registro.for_uf, registro.for_cidade, registro.for_bairro, registro.for_endereco, registro.for_ativo, registro.for_criado_em);
            const itenscompra = new ItemCompra(0, /*registro.com_id*/{}, {}, 0, 0, true, "", "");
            itenscompra.compra = {id: registro.com_id};
            const item = await itenscompra.consultar({}, conexao);

            const compra = new Compra(registro.com_id, item.lista, fornecedor/*, usuario*/, registro.com_data_compra, registro.com_valor_total, registro.com_status, registro.com_ativo, registro.com_atualizado_em, registro.com_criado_em);
            listaCompras.push(compra);
        }
        return{
            lista: listaCompras,
            total: totalRegistros
        };
    }
}