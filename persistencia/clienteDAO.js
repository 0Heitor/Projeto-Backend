import Cliente from '../modelo/cliente.js';

export default class ClienteDAO{

    async gravar(cliente, conexao){
        if(cliente instanceof Cliente){
            const sql = "INSERT INTO clientes (cli_nome, cli_cpf_cnpj, cli_rg, cli_data_nascimento, cli_profissao, cli_local_trabalho, cli_telefone, cli_cep, cli_endereco, cli_ativo, cli_observacoes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING cli_id";
            const parametros = [cliente.nome, cliente.cpf_cnpj, cliente.rg, cliente.data_nascimento, cliente.profissao, cliente.local_trabalho, cliente.telefone, cliente.cep, cliente.endereco, cliente.ativo, cliente.observacoes];
            const retorno = await conexao.query(sql, parametros);
            cliente.id = retorno.rows[0].cli_id;
        }
    }

    async atualizar(cliente, conexao){
        if(cliente instanceof Cliente){
            const sql = "UPDATE clientes SET cli_nome = $1, cli_cpf_cnpj = $2, cli_rg = $3, cli_data_nascimento = $4, cli_profissao = $5, cli_local_trabalho = $6, cli_telefone = $7, cli_cep = $8, cli_endereco = $9, cli_ativo = $10, cli_observacoes = $11 WHERE cli_id = $12";
            const parametros = [cliente.nome, cliente.cpf_cnpj, cliente.rg, cliente.data_nascimento, cliente.profissao, cliente.local_trabalho, cliente.telefone, cliente.cep, cliente.endereco, cliente.ativo, cliente.observacoes, cliente.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(cliente, conexao){
        if(cliente instanceof Cliente){
            const sql = "DELETE FROM clientes WHERE cli_id = $1";
            const parametros = [cliente.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(cliente, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM clientes WHERE 1=1";
        let parametros=[];
        let listaClientes = [];
        let totalRegistros = 0;
        let i=1;

        if(cliente.id && cliente.id != ''){
            sql += ` AND cli_id = $${i}`;
            parametros.push(cliente.id);
            i++;
        }
        if(cliente.nome && cliente.nome != ''){
            sql += ` AND cli_nome LIKE $${i}`;
            parametros.push(`%${cliente.nome}%`);
            i++;
        }
        if(cliente.cpf_cnpj && cliente.cpf_cnpj != ''){
            sql += ` AND cli_cpf_cnpj = $${i}`;
            parametros.push(cliente.cpf_cnpj);
            i++;
        }
        if(cliente.rg && cliente.rg != ''){
            sql += ` AND cli_rg = $${i}`;
            parametros.push(cliente.rg);
            i++;
        }
        if(cliente.data_nascimento && cliente.data_nascimento != ''){
            sql += ` AND cli_data_nascimento = $${i}`;
            parametros.push(`%${cliente.data_nascimento}%`);
            i++;
        }
        if(cliente.profissao && cliente.profissao != ''){
            sql += ` AND cli_profissao LIKE $${i}`;
            parametros.push(`%${cliente.profissao}%`);
            i++;
        }
        if(cliente.local_trabalho && cliente.local_trabalho != ''){
            sql += ` AND cli_local_trabalho LIKE $${i}`;
            parametros.push(`%${cliente.local_trabalho}%`);
            i++;
        }
        if(cliente.telefone && cliente.telefone != ''){
            sql += ` AND cli_telefone = $${i}`;
            parametros.push(cliente.telefone);
            i++;
        }
        if(cliente.cep && cliente.cep != ''){
            sql += ` AND cli_cep = $${i}`;
            parametros.push(cliente.cep);
            i++;
        }
        if(cliente.endereco && cliente.endereco != ''){
            sql += ` AND cli_endereco LIKE $${i}`;
            parametros.push(`%${cliente.endereco}%`);
            i++;
        }
        if(cliente.ativo !== undefined && cliente.ativo != ''){
            sql += ` AND cli_ativo = $${i}`;
            parametros.push(cliente.ativo);
            i++;
        }
        if(cliente.observacoes && cliente.observacoes != ''){
            sql += ` AND cli_observacoes LIKE $${i}`;
            parametros.push(`%${cliente.observacoes}%`);
            i++;
        }
        sql += " ORDER BY cli_nome ASC";
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
            const cliente = new Cliente(registro.cli_id, registro.cli_nome, registro.cli_cpf_cnpj, registro.cli_rg, registro.cli_data_nascimento, registro.cli_profissao, registro.cli_local_trabalho, registro.cli_telefone, registro.cli_cep, registro.cli_endereco, registro.cli_ativo, registro.cli_observacoes, registro.cli_criado);
            listaClientes.push(cliente);
        }
        return{
            lista: listaClientes,
            total: totalRegistros
        };
    }
}