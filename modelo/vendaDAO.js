import Venda from '../modelo/venda.js';
import Cliente from '../modelo/cliente.js';
import Usuario from '../modelo/usuario.js';
import ItemVenda from '../modelo/itemVenda.js';

export default class VendaDAO{
    async gravar(venda, conexao){
        if(venda instanceof Venda){
            const sql = "INSERT INTO vendas (ven_cli_id, ven_usu_id, ven_total, ven_forma_pagamento, ven_status) VALUES ($1, $2, $3, $4, $5) RETURNING ven_id";
            const parametros = [venda.cliente.id, venda.usuario.id, venda.total, venda.forma_pagamento, venda.status];
            const retorno = await conexao.query(sql, parametros);
            venda.id = retorno.rows[0].ven_id;
        }
    }
    
    async atualizar(venda, conexao){
        if(venda instanceof Venda){
            const sql = "UPDATE vendas SET ven_cli_id = $1, ven_usu_id = $2, ven_total = $3, ven_forma_pagamento = $4, ven_status = $5, ven_ativo = $6, ven_atualizado_em = $7 WHERE ven_id = $8";
            const parametros = [venda.cliente.id, venda.usuario.id, venda.total, venda.forma_pagamento, venda.status, venda.ativo, venda.atualizado_em, venda.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(venda, conexao){
        if(venda instanceof Venda){
            const sql = "DELETE FROM vendas WHERE ven_id = $1";
            const parametros = [venda.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(venda, filtro, conexao){
        let sql = `
            SELECT 
                v.*, 
                c.*,
                u.*, 
                COUNT(*) OVER() as total_geral
            FROM vendas v 
            INNER JOIN clientes c ON v.ven_cli_id = c.cli_id
            INNER JOIN usuarios u ON v.ven_usu_id = u.usu_id
            WHERE 1=1`;
        //(SELECT json_agg(i.*) FROM itens_venda i WHERE i.itc_com_id = c.com_id) AS itens_venda
        let parametros=[];
        let listaVendas = [];
        let totalRegistros = 0;
        let i=1;

        if(venda.id && venda.id !== '' && venda.id !== '0'){
            sql += ` AND v.ven_id = $${i}`;
            parametros.push(venda.id);
            i++;
        }
        if(venda.cliente && venda.cliente.nome !== undefined && venda.cliente.nome !== ''){
            sql += ` AND c.cli_nome LIKE $${i}`;
            parametros.push(`%${venda.cliente.nome}%`);
            i++;
        }
        if(venda.usuario && venda.usuario.nome !== undefined && venda.usuario.nome !== ''){
            sql += ` AND u.usu_nome LIKE $${i}`;
            parametros.push(`%${venda.usuario.nome}%`);
            i++;
        }
        /*if(venda.usuario && venda.usuario !== ''){
            sql += ` AND u.usu_nome LIKE $${i}`;
            parametros.push(`%${venda.usuario.nome}%`);
            i++;
        }*/
        if(venda.total && venda.total !== ""){
            sql += ` AND v.ven_total = $${i}`;
            parametros.push(venda.total);
            i++;
        }
        if(venda.forma_pagamento && venda.forma_pagamento !== ""){
            sql += ` AND v.ven_forma_pagamento = $${i}`;
            parametros.push(venda.forma_pagamento);
            i++;
        }
        if(venda.status && venda.status !== ''){
            sql += ` AND v.ven_status = $${i}`;
            parametros.push(venda.status);
            i++;
        }
        if(venda.ativo !== undefined && venda.ativo !== ''){
            sql += ` AND v.ven_ativo = $${i}`;
            parametros.push(venda.ativo);
            i++;
        }
        if(venda.criado_em && venda.criado_em !== ""){
            sql += ` AND v.ven_criado_em::date = $${i}`;
            parametros.push(venda.criado_em);
            i++;
        }
        if(venda.atualizado_em && venda.atualizado_em !== ""){
            sql += ` AND v.ven_atualizado_em::date = $${i}`;
            parametros.push(venda.atualizado_em);
            i++;
        }
        sql += " ORDER BY v.ven_criado_em DESC";
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
            const cliente = new Cliente(registro.cli_id, registro.cli_nome, registro.cli_cpf_cnpj, registro.cli_telefone, registro.cli_email, registro.cli_ativo, registro.cli_criado_em);
            const usuario = new Usuario(registro.usu_id, registro.usu_nome, registro.usu_email, "", "", registro.usu_ativo, registro.usu_ultimo_login, registro.usu_criado_em, "", "", 0);
            
            const itensvenda = new ItemVenda(0, /*registro.ven_id*/{}, {}, 0, true, "", "");
            itensvenda.venda = {id: registro.ven_id};
            const item = await itensvenda.consultar({}, conexao);

            const venda = new Venda(registro.ven_id, item.lista, cliente, usuario, registro.ven_total, registro.ven_forma_pagamento, registro.ven_status, registro.ven_ativo, registro.ven_atualizado_em, registro.ven_criado_em);
            listaVendas.push(venda);
        }
        return{
            lista: listaVendas,
            total: totalRegistros
        };
    }
}