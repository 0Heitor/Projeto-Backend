//import Fornecedor from '../modelo/fornecedor.js';
import ItemVenda from '../modelo/itemVenda.js';
import Venda from '../modelo/venda.js';
import Produto from '../modelo/produto.js';

export default class ItemVendaDAO{

    async gravar(item, conexao){
        if(item instanceof ItemVenda){
            const sql = "INSERT INTO itens_venda (itv_ven_id, itv_prod_id, itv_quantidade, itv_ativo) VALUES ($1, $2, $3, $4) RETURNING itv_id";
            const parametros = [item.venda.id, item.produto.id, item.quantidade, item.ativo];
            const retorno = await conexao.query(sql, parametros);
            item.id = retorno.rows[0].itv_id;
        }
    }

    async atualizar(item, conexao){
        if(item instanceof ItemVenda){
            const sql = "UPDATE itens_venda SET itv_ven_id = $1, itv_prod_id = $2, itv_quantidade = $3, itv_ativo = $4, itv_atualizado_em = $5 WHERE itv_id = $6";
            const parametros = [item.venda.id, item.produto.id, item.quantidade, item.ativo, item.atualizado_em, item.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(item, conexao){
        if(item instanceof ItemVenda){
            const sql = "DELETE FROM itens_venda WHERE itv_id = $1";
            const parametros = [item.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(item, filtro, conexao){
            let sql="SELECT i.*, v.*, COUNT(*) OVER() as total_geral FROM itens_venda i INNER JOIN vendas v ON i.itv_ven_id = v.ven_id WHERE 1=1";
            let parametros=[];
            let listaItens = [];
            let totalRegistros = 0;
            let i=1;
    
            if(item.id && item.id !== '' && item.id !== '0'){
                sql += ` AND i.itv_id = $${i}`;
                parametros.push(item.id);
                i++;
            }
            if(item.venda && item.venda.id && item.venda.id !== '' && item.venda.id !== '0'){
                sql += ` AND i.itv_ven_id = $${i}`;
                parametros.push(item.venda.id);
                i++;
            }
            if(item.produto && item.produto.id && item.produto.id !== '' && item.produto.id !== '0'){
                sql += ` AND i.itv_prod_id = $${i}`;
                parametros.push(item.produto.id);
                i++;
            }
            if(item.ativo !== undefined && item.ativo !== ''){
                sql += ` AND i.itv_ativo = $${i}`;
                parametros.push(item.ativo);
                i++;
            }
            /*if(item.data_compra && item.data_compra !== ""){
                sql += ` AND v.ven_data_venda::date = $${i}`;
                parametros.push(item.data_compra);
                i++;
            }*/
            if(item.criado_em && item.criado_em !== ""){
                sql += ` AND v.ven_criado_em::date = $${i}`;
                parametros.push(item.criado_em);
                i++;
            }
            if(item.atualizado_em && item.atualizado_em !== ""){
                sql += ` AND v.ven_atualizado_em::date = $${i}`;
                parametros.push(item.atualizado_em);
                i++;
            }
            sql += " ORDER BY i.itv_id ASC";
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
                const produto = new Produto(registro.itv_prod_id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                const prod = await produto.consultar([], conexao);
                const item = new ItemVenda(registro.itv_id, registro.itv_ven_id, prod.lista[0], registro.itv_quantidade, registro.itv_ativo, registro.itv_atualizado_em, registro.itv_criado_em);
                listaItens.push(item);
            }
            return{
                lista: listaItens,
                total: totalRegistros
            };
        }

}