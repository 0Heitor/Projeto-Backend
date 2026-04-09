import Cliente from '../modelo/cliente.js';

export default class ClienteDAO{

    async gravar(cliente){
        if(cliente instanceof Cliente){
            const sql = "INSERT INTO clientes (cli_nome, cli_cpf_cnpj, cli_rg, cli_data_nascimento, cli_profissao, cli_local_trabalho, cli_telefone, cli_cep, cli_endereco, cli_ativo, cli_observacoes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING cli_id";
            const parametros = [cliente.nome, cliente.cpf_cnpj, cliente.rg, cliente.data_nascimento, cliente.profissao, cliente.local_trabalho, cliente.telefone, cliente.cep, cliente.endereco, cliente.ativo, cliente.observacoes];
            const retorno = await conexao.query(sql, parametros);
            cliente.id = retorno.rows[0].cli_id;
        }
    }

    async atualizar(cliente){
        if(cliente instanceof Cliente){
            const sql = "UPDATE clientes SET cli_nome = $1, cli_cpf_cnpj = $2, cli_rg = $3, cli_data_nascimento = $4, cli_profissao = $5, cli_local_trabalho = $6, cli_telefone = $7, cli_cep = $8, cli_endereco = $9, cli_ativo = $10, cli_observacoes = $11 WHERE cli_id = $12";
            const parametros = [cliente.nome, cliente.cpf_cnpj, cliente.rg, cliente.data_nascimento, cliente.profissao, cliente.local_trabalho, cliente.telefone, cliente.cep, cliente.endereco, cliente.ativo, cliente.observacoes, usuario.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(cliente){
        if(cliente instanceof Cliente){
            const sql = "DELETE FROM clientes WHERE cli_id = $1";
            const parametros = [cliente.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(usuario, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM clientes WHERE 1=1";
        let parametros=[];
        let listaClientes = [];
        let totalRegistros = 0;
        let i=1;

        if(filtro.id){
            sql += ` AND cli_id = $${i}`;
            parametros.push(filtro.id);
            i++;
        }
        if(filtro.nome){
            sql += ` AND cli_nome LIKE $${i}`;
            parametros.push(`%${filtro.nome}%`);
            i++;
        }
        if(filtro.cpf_cnpj){
            sql += ` AND cli_cpf_cnpj = $${i}`;
            parametros.push(`%${filtro.cpf_cnpj}%`);
            i++;
        }
        if(filtro.rg){
            sql += ` AND cli_rg = $${i}`;
            parametros.push(`%${filtro.rg}%`);
            i++;
        }
        if(filtro.data_nascimento){
            sql += ` AND cli_data_nascimento = $${i}`;
            parametros.push(`%${filtro.data_nascimento}%`);
            i++;
        }
        if(filtro.profissao){
            sql += ` AND cli_profissao LIKE $${i}`;
            parametros.push(`%${filtro.profissao}%`);
            i++;
        }
        if(filtro.local_trabalho){
            sql += ` AND cli_local_trabalho LIKE $${i}`;
            parametros.push(`%${filtro.local_trabalho}%`);
            i++;
        }
        if(filtro.telefone){
            sql += ` AND cli_telefone = $${i}`;
            parametros.push(`%${filtro.telefone}%`);
            i++;
        }
        if(filtro.cep){
            sql += ` AND cli_cep = $${i}`;
            parametros.push(`%${filtro.cep}%`);
            i++;
        }
        if(filtro.endereco){
            sql += ` AND cli_endereco LIKE $${i}`;
            parametros.push(`%${filtro.endereco}%`);
            i++;
        }
        if(filtro.ativo !== undefined){
            sql += ` AND cli_ativo = $${i}`;
            parametros.push(filtro.ativo);
            i++;
        }
        if(filtro.observacoes){
            sql += ` AND cli_observacoes LIKE $${i}`;
            parametros.push(filtro.observacoes);
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