import Produto from '../modelo/produto.js';
import Fornecedor from '../modelo/fornecedor.js';
import Categoriasubgrupo from '../modelo/categoriasubgrupo.js';

export default class ProdutoDAO{

    async gravar(produto, conexao){
        if(produto instanceof Produto){
            const sql = "INSERT INTO produtos (prod_sub_id, prod_fornecedor_id, prod_codigo_interno, prod_codigo_barras, prod_descricao, prod_descricao_marca, prod_unidade_medida, prod_custo, prod_preco_venda, prod_percentual_financeiro, prod_tributacao, prod_ativo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING prod_id";
            const parametros = [produto.categoriasubgrupo.id, produto.fornecedor.id, produto.codigo, produto.codigo_de_barras, produto.descricao, produto.descricao_marca, produto.unidade_medida, produto.preco_custo, produto.preco_venda, produto.percentual_financeiro, produto.tributacao, produto.ativo];
            const retorno = await conexao.query(sql, parametros);
            produto.id = retorno.rows[0].prod_id;
        }
    }

    async atualizar(produto, conexao){
        if(produto instanceof Produto){
            const sql = "UPDATE produtos SET prod_sub_id = $1, prod_fornecedor_id = $2, prod_codigo_interno = $3, prod_codigo_barras = $4, prod_descricao = $5, prod_descricao_marca = $6, prod_unidade_medida = $7, prod_custo = $8, prod_preco_venda = $9, prod_percentual_financeiro = $10, prod_tributacao = $11, prod_estoque = $12, prod_estoque_minimo = $13, prod_ativo = $14, prod_atualizado_em = $15 WHERE prod_id = $16";
            const parametros = [produto.categoriasubgrupo.id, produto.fornecedor.id, produto.codigo, produto.codigo_de_barras, produto.descricao, produto.descricao_marca, produto.unidade_medida, produto.preco_custo, produto.preco_venda, produto.percentual_financeiro, produto.tributacao, produto.estoque, produto.estoque_minimo, produto.ativo, produto.atualizado, produto.id];
            await conexao.query(sql, parametros);
        }
    }

    async atualizarEstoque(produto, quantidade, conexao){
        if(produto instanceof Produto){
            const sql = "UPDATE produtos SET prod_estoque = prod_estoque + $1, prod_atualizado_em = CURRENT_TIMESTAMP WHERE prod_id = $2 AND (prod_estoque + $1) >= 0";
            const parametros = [quantidade, produto.id];
            /*const resultado = */await conexao.query(sql, parametros);
            //return{atualizado: resultado.rowCount === 0};
        }
    }

    async excluir(produto, conexao){
        if(produto instanceof Produto){
            const sql = "DELETE FROM produtos WHERE prod_id = $1";
            const parametros = [produto.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(produto, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM produtos WHERE 1=1";
        let parametros=[];
        let listaProdutos = [];
        let totalRegistros = 0;
        let i=1;

        if (produto.id && produto.id !== '') {
            sql += ` AND prod_id = $${i}`;
            parametros.push(produto.id);
            i++;
        }
        if (produto.codigo && produto.codigo !== '') {
            sql += ` AND prod_codigo_interno = $${i}`;
            parametros.push(produto.codigo);
            i++;
        }
        if (produto.descricao && produto.descricao !== '') {
            sql += ` AND prod_descricao LIKE $${i}`;
            parametros.push(`%${produto.descricao}%`);
            i++;
        }
        if (produto.codigo_barras && produto.codigo_barras !== '') {
            sql += ` AND prod_codigo_barras = $${i}`;
            parametros.push(produto.codigo_barras);
            i++;
        }
        if (produto.fornecedor.id && produto.fornecedor.id !== '') {
            sql += ` AND prod_fornecedor_id = $${i}`;
            parametros.push(produto.fornecedor.id);
            i++;
        }
        if (produto.ativo !== undefined && produto.ativo !== '') {
            sql += ` AND prod_ativo = $${i}`;
            parametros.push(produto.ativo);
            i++;
        }
        if (filtro.apenas_estoque_baixo === true) {
            sql += ` AND prod_estoque <= prod_estoque_minimo`;
        }

        sql += " ORDER BY prod_codigo_interno ASC";
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
            const categoriasubgrupo = new Categoriasubgrupo(registro.prod_sub_id, "", "", "", "", "", "", "");
            const subgrupo = await categoriasubgrupo.consultar(categoriasubgrupo , conexao);
            const fornecedor = new Fornecedor(registro.prod_fornecedor_id, "", "", "", "", "", "", "", "", "", "");
            const forn = await fornecedor.consultar(fornecedor, conexao);
            const produto = new Produto(registro.prod_id, subgrupo.lista[0], forn.lista[0], registro.prod_codigo_interno, registro.prod_codigo_barras, registro.prod_descricao, registro.prod_descricao_marca, registro.prod_unidade_medida, parseFloat(registro.prod_custo), parseFloat(registro.prod_preco_venda), parseFloat(registro.prod_percentual_financeiro), registro.prod_tributacao, parseFloat(registro.prod_estoque), parseFloat(registro.prod_estoque_minimo), registro.prod_ativo, registro.prod_atualizado_em, registro.prod_criado_em);
            listaProdutos.push(produto);
        }
        return{
            lista: listaProdutos,
            total: totalRegistros
        };
    }
}