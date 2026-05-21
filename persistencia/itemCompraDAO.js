import ItemCompra from '../modelo/itemCompra.js';
import Fornecedor from '../modelo/fornecedor.js';
import Compra from '../modelo/compra.js';
import Produto from '../modelo/produto.js';

export default class ItemCompraDAO{
    async gravar(item, conexao){
        if(item instanceof ItemCompra){
            const sql = "INSERT INTO itens_compra (itc_com_id, itc_prod_id, itc_quantidade, itc_valor_unitario, itc_ativo) VALUES ($1, $2, $3, $4, $5) RETURNING itc_id";
            const parametros = [item.compra.id, item.produto.id, item.quantidade, item.valor_unitario, item.ativo];
            const retorno = await conexao.query(sql, parametros);
            item.id = retorno.rows[0].itc_id;
        }
    }
    
    async atualizar(item, conexao){
        if(item instanceof ItemCompra){
            const sql = "UPDATE itens_compra SET itc_com_id = $1, itc_prod_id = $2, itc_quantidade = $3, itc_valor_unitario = $4, itc_ativo = $5, itc_atualizado_em = $6 WHERE itc_id = $7";
            const parametros = [item.compra.id, item.produto.id, item.quantidade, item.valor_unitario, item.ativo, item.atualizado_em, item.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(item, conexao){
        if(item instanceof ItemCompra){
            const sql = "DELETE FROM itens_compra WHERE itc_id = $1";
            const parametros = [item.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(item, filtro, conexao){
        let sql="SELECT i.*, c.*, COUNT(*) OVER() as total_geral FROM itens_compra i INNER JOIN compras c ON i.itc_com_id = c.com_id WHERE 1=1";
        let parametros=[];
        let listaItens = [];
        let totalRegistros = 0;
        let i=1;

        if(item.id && item.id !== '' && item.id !== '0'){
            sql += ` AND i.itc_id = $${i}`;
            parametros.push(item.id);
            i++;
        }
        if(item.compra && item.compra.id && item.compra.id !== '' && item.compra.id !== '0'){
            sql += ` AND i.itc_com_id = $${i}`;
            parametros.push(item.compra.id);
            i++;
        }
        if(item.produto && item.produto.id && item.produto.id !== '' && item.produto.id !== '0'){
            sql += ` AND i.itc_prod_id = $${i}`;
            parametros.push(item.produto.id);
            i++;
        }
        if(item.ativo !== undefined && item.ativo !== ''){
            sql += ` AND i.itc_ativo = $${i}`;
            parametros.push(item.ativo);
            i++;
        }
        if(item.data_compra && item.data_compra !== ""){
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
        totalRegistros = registros.length > 0 ? parseInt(registros[0].total_geral) : 0;
        for(const registro of registros){
            //const fornecedor = new Fornecedor(registro.for_id, registro.for_codigo, registro.for_nome_fantasia, registro.for_cnpj, registro.for_telefone, registro.for_uf, registro.for_cidade, registro.for_bairro, registro.for_endereco, registro.for_ativo, registro.for_criado_em);
            //const compra = new Compra(registro.com_id, fornecedor, registro.com_data_compra, registro.com_valor_total, registro.com_status, registro.com_ativo, registro.com_atualizado_em, registro.com_criado_em);
            const produto = new Produto(registro.itc_prod_id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
            const prod = await produto.consultar([], conexao);
            const item = new ItemCompra(registro.itc_id, registro.itc_com_id, prod.lista[0], registro.itc_quantidade, registro.itc_valor_unitario, registro.itc_ativo, registro.itc_atualizado_em, registro.itc_criado_em);
            listaItens.push(item);
        }
        return{
            lista: listaItens,
            total: totalRegistros
        };
    }
}