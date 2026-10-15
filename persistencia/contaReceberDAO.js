import ContaReceber from "../modelo/contaReceber.js";
import Cliente from "../modelo/cliente.js";

export default class ContaReceberDAO{

    async atualizar(conta, conexao){
        if(conta instanceof ContaReceber){
            const sql = "UPDATE financeiro_receber SET rec_cliente_id = $1, rec_origem_tipo = $2, rec_valor = $3, forma_pagamento = $4, rec_data_vencimento = $5, rec_data_pagamento = $6, rec_status = $7, rec_ativo = $8, rec_atualizado_em = $9 WHERE rec_id = $10";
            const parametros = [conta.cliente.id, conta.origem_tipo, conta.valor_total, conta.forma_pagamento, conta.data_vencimento, conta.data_pagamento, conta.status, conta.ativo, conta.atualizado, conta.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(tipo, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM financeiro_receber f INNER JOIN clientes c ON f.rec_cliente_id = c.cli_id WHERE 1=1";
        let parametros=[];
        let listaContas = [];
        let totalRegistros = 0;
        let i=1;

        if(tipo.id && tipo.id !== '' && tipo.id !== '0'){
            sql += ` AND f.rec_id = $${i}`;
            parametros.push(tipo.id);
            i++;
        }
        if(tipo.cliente && tipo.cliente !== ''){
            // if(filtro.consulta && filtro.consulta === "equal"){
            //     sql += ` AND c.cli_nome = $${i}`;
            //     parametros.push(tipo.cliente);
            // } else {
            //     sql += ` AND c.cli_nome LIKE $${i}`;
            //     parametros.push(`%${tipo.cliente}%`);
            // }
            sql += ` AND c.cli_nome ILIKE $${i}`;
            parametros.push(`%${tipo.cliente}%`);
            i++;
        }
        if(tipo.data_vencimento !== undefined && tipo.data_vencimento != ''){
            sql += ` AND f.rec_data_vencimento = $${i}`;
            parametros.push(tipo.data_vencimento);
            i++;
        }
        if(tipo.status !== undefined && tipo.status != ''){
            sql += ` AND f.rec_status = $${i}`;
            parametros.push(tipo.status);
            i++;
        }
        if(tipo.ativo !== undefined && tipo.ativo != ''){
            sql += ` AND f.rec_ativo = $${i}`;
            parametros.push(tipo.ativo);
            i++;
        }
        sql += " ORDER BY rec_data_vencimento ASC";
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
            const clienteObj = new Cliente(registro.rec_cliente_id, "", "", "", "", "", "", "", "", "", "", "", "");
            const cliente = await clienteObj.consultar({}, conexao);

            const conta = new ContaReceber(registro.rec_id, cliente.lista[0], registro.rec_origem_tipo, registro.rec_valor, registro.rec_forma_pagamento, registro.rec_data_vencimento, registro.rec_data_pagamento, registro.rec_status, registro.rec_ativo, registro.rec_atualizado_em, registro.rec_criado_em);
            listaContas.push(conta);
        }
        return {
            lista: listaContas, 
            total: totalRegistros
        };
    }
}