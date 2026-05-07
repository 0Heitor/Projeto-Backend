import Fornecedor from '../modelo/fornecedor.js';

export default class FornecedorDAO{

    async gravar(fornecedor, conexao){
        if(fornecedor instanceof Fornecedor){
            const sql = "INSERT INTO fornecedores (for_codigo, for_nome_fantasia, for_cnpj, for_telefone, for_uf, for_cidade, for_bairro, for_endereco) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING for_id";
            const parametros = [fornecedor.codigo, fornecedor.nome_fantasia, fornecedor.cnpj, fornecedor.telefone, fornecedor.uf, fornecedor.cidade, fornecedor.bairro, fornecedor.endereco];
            const retorno = await conexao.query(sql, parametros);
            fornecedor.id = retorno.rows[0].for_id;
        }
    }

    async atualizar(fornecedor, conexao){
        if(fornecedor instanceof Fornecedor){
            const sql = "UPDATE fornecedores SET for_codigo = $1, for_nome_fantasia = $2, for_cnpj = $3, for_telefone = $4, for_uf = $5, for_cidade = $6, for_bairro = $7, for_endereco = $8, for_ativo = $9 WHERE for_id = $10";
            const parametros = [fornecedor.codigo, fornecedor.nome_fantasia, fornecedor.cnpj, fornecedor.telefone, fornecedor.uf, fornecedor.cidade, fornecedor.bairro, fornecedor.endereco, fornecedor.ativo, fornecedor.id];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(fornecedor, conexao){
        if(fornecedor instanceof Fornecedor){
            const sql = "DELETE FROM fornecedores WHERE for_id = $1";
            const parametros = [fornecedor.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(fornecedor, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM fornecedores WHERE 1=1";
        let parametros=[];
        let listaFornecedores = [];
        let totalRegistros = 0;
        let i=1;

        if(fornecedor.id && fornecedor.id != ''){
            sql += ` AND for_id = $${i}`;
            parametros.push(fornecedor.id);
            i++;
        }
        if(fornecedor.codigo && fornecedor.codigo != ''){
            sql += ` AND for_codigo LIKE $${i}`;
            parametros.push(`%${fornecedor.codigo}%`);
            i++;
        }
        if(fornecedor.nome_fantasia && fornecedor.nome_fantasia != ''){
            sql += ` AND for_nome_fantasia LIKE $${i}`;
            parametros.push(`%${fornecedor.nome_fantasia}%`);
            i++;
        }
        if(fornecedor.cnpj && fornecedor.cnpj != ''){
            if(filtro.consulta && filtro.consulta == 'OR')
                sql += ` OR for_cnpj LIKE $${i}`;
            else
                sql += ` AND for_cnpj LIKE $${i}`;
            parametros.push(`%${fornecedor.cnpj}%`);
            i++;
        }
        if(fornecedor.telefone && fornecedor.telefone != ''){
            sql += ` AND for_telefone = $${i}`;
            parametros.push(`%${fornecedor.telefone}%`);
            i++;
        }
        if(fornecedor.uf && fornecedor.uf != ''){
            sql += ` AND for_uf = $${i}`;
            parametros.push(fornecedor.uf);
            i++;
        }
        if(fornecedor.cidade && fornecedor.cidade != ''){
            sql += ` AND for_cidade = $${i}`;
            parametros.push(fornecedor.cidade);
            i++;
        }
        if(fornecedor.bairro && fornecedor.bairro != ''){
            sql += ` AND for_bairro = $${i}`;
            parametros.push(fornecedor.bairro);
            i++;
        }
        if(fornecedor.endereco && fornecedor.endereco != ''){
            sql += ` AND for_endereco LIKE $${i}`;
            parametros.push(fornecedor.endereco);
            i++;
        }
        if(fornecedor.ativo !== undefined && fornecedor.ativo !== ''){
            sql += ` AND for_ativo = $${i}`;
            parametros.push(fornecedor.ativo);
            i++;
        }
        if(fornecedor.criado){
            sql += ` AND for_criado_em::date = $${i}`;
            parametros.push(fornecedor.criado);
            i++;
        }
        sql += " ORDER BY for_nome_fantasia";
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
            const fornecedor = new Fornecedor(registro.for_id, registro.for_codigo, registro.for_nome_fantasia, registro.for_cnpj, registro.for_telefone, registro.for_uf, registro.for_cidade, registro.for_bairro, registro.for_endereco, registro.for_ativo, registro.for_criado_em);
            listaFornecedores.push(fornecedor);
        }
        return{
            lista: listaFornecedores,
            total: totalRegistros
        };
    }
}