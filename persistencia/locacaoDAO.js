import ItemCacamba from "../modelo/itemCacamba.js";
import Locacao from "../modelo/locacao.js";
import Cliente from "../modelo/cliente.js";

export default class LocacaoDAO{
    async gravar(locacao, conexao){
        if(locacao instanceof Locacao){
            const sql = "INSERT INTO locacoes (loc_cli_id, loc_data_entrega, loc_data_retirada_prevista, loc_endereco_entrega, loc_valor_total, loc_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING loc_id";
            const parametros = [locacao.cliente.id, locacao.data_entrega, locacao.data_retirada_prevista, locacao.endereco_entrega, locacao.valor_total, locacao.status];
            const retorno = await conexao.query(sql, parametros);
            locacao.id = retorno.rows[0].loc_id;
        }
    }

    async atualizar(locacao, conexao){
        if(locacao instanceof Locacao){
            const sql = "UPDATE locacoes SET loc_cli_id = $1, loc_data_entrega = $2, loc_data_retirada_prevista = $3, loc_data_retirada_real = $4, loc_endereco_entrega = $5, loc_valor_total = $6, loc_status = $7, loc_ativo = $8 WHERE loc_id = $9";
            const parametros = [locacao.cliente.id, locacao.data_entrega, locacao.data_retirada_prevista, locacao.data_retirada_real, locacao.endereco_entrega, locacao.valor_total, locacao.status, locacao.ativo, locacao.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(locacao, conexao){
        if(locacao instanceof Locacao){
            const sql = "DELETE FROM locacoes WHERE loc_id = $1";
            const parametros = [locacao.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(locacao, filtro, conexao){
        let sql = `
            SELECT 
                l.*, 
                c.*, 
                COUNT(*) OVER() as total_geral
            FROM locacoes l 
            INNER JOIN clientes c ON l.loc_cli_id = c.cli_id  
            WHERE 1=1`;
        //(SELECT json_agg(i.*) FROM itens_compra i WHERE i.itc_com_id = c.com_id) AS itens_compra
        let parametros=[];
        let listaLocacoes = [];
        let totalRegistros = 0;
        let i=1;

        if(locacao.id && locacao.id !== '' && locacao.id !== '0'){
            sql += ` AND l.loc_id = $${i}`;
            parametros.push(locacao.id);
            i++;
        }
        if(locacao.cliente && locacao.cliente.nome !== ''){
            sql += ` AND c.cli_nome LIKE $${i}`;
            parametros.push(`%${locacao.cliente.nome}%`);
            i++;
        }
        if(locacao.valor_total && locacao.valor_total !== ""){
            sql += ` AND l.loc_valor_total = $${i}`;
            parametros.push(locacao.valor_total);
            i++;
        }
        if(locacao.status && locacao.status !== ''){
            sql += ` AND l.loc_status = $${i}`;
            parametros.push(locacao.status);
            i++;
        }
        if(locacao.ativo !== undefined && locacao.ativo !== ''){
            sql += ` AND l.loc_ativo = $${i}`;
            parametros.push(locacao.ativo);
            i++;
        }
        if(locacao.data_compra && locacao.data_compra !== ""){
            sql += ` AND l.loc_data_compra::date = $${i}`;
            parametros.push(locacao.data_compra);
            i++;
        }
        if(locacao.criado_em && locacao.criado_em !== ""){
            sql += ` AND l.loc_criado_em::date = $${i}`;
            parametros.push(locacao.criado_em);
            i++;
        }
        if(locacao.atualizado_em && locacao.atualizado_em !== ""){
            sql += ` AND l.loc_atualizado_em::date = $${i}`;
            parametros.push(locacao.atualizado_em);
            i++;
        }
        sql += " ORDER BY l.loc_data_pedido DESC";
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
            //const usuario = new Usuario(registro.usu_id, registro.usu_nome, registro.usu_email, "", registro.usu_nivel, registro.usu_ativo, registro.usu_ultimo_login, registro.usu_criado_em, "", "", 0);
            const cliente = new Cliente(registro.cli_id, registro.cli_nome, registro.cli_cpf_cnpj, registro.cli_rg, registro.cli_data_nascimento, registro.cli_profissao, registro.cli_local_trabalho, registro.cli_telefone, registro.cli_cep, registro.cli_endereco, registro.cli_ativo, registro.cli_observacoes, registro.cli_criado_em);
            const itenscacamba = new ItemCacamba(0, {id: registro.loc_id}, {}, 0, "", "", "", "", "");
            const item = await itenscacamba.consultar({}, conexao);

            const locacao = new Locacao(registro.loc_id, cliente, item.lista, registro.loc_data_pedido, registro.loc_data_entrega, registro.loc_data_retirada_prevista, registro.loc_data_retirada_real, registro.loc_endereco_entrega, registro.loc_valor_total, registro.loc_status, registro.loc_ativo, registro.loc_atualizado_em, registro.loc_criado_em);
            listaLocacoes.push(locacao);
        }
        return{
            lista: listaLocacoes,
            total: totalRegistros
        };
    }
}