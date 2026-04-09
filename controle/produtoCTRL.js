import Produto from '../modelo/produto.js';
import conectar from "../persistencia/conexao.js";

export default class ProdutoCTRL{

    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const categoriasubgrupo = dados.categoriasubgrupo;
                const fornecedor = dados.fornecedor;
                const codigo = dados.codigo;
                const codigo_de_barras = dados.codigo_de_barras;
                const descricao = dados.descricao;
                const descricao_marca = dados.descricao_marca;
                const unidade_medida = dados.unidade_medida;
                const preco_custo = dados.preco_custo;
                const preco_venda = dados.preco_venda;
                const margem_lucro = dados.margem_lucro;
                const percentual_financeiro = dados.percentual_financeiro;
                const tributacao = dados.tributacao;
                const estoque = dados.estoque;
                const ativo = dados.ativo;

                if(categoriasubgrupo && fornecedor && codigo && codigo_de_barras && descricao && descricao_marca && unidade_medida && preco_custo && preco_venda && margem_lucro && percentual_financeiro && tributacao && estoque && ativo !== undefined){
                    const produto = new Produto(0, categoriasubgrupo, fornecedor, codigo, codigo_de_barras, descricao, descricao_marca, unidade_medida, preco_custo, preco_venda, margem_lucro, percentual_financeiro, tributacao, estoque, ativo, "", "");
                    produto.gravar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "codigoGerado":produto.id,
                            "mensagem":"Produto incluída com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao registrar o produto: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para o Produto !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar um Produto !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar o produto", error);
            throw error;
        }
        finally{conexao.release();}
    }

    async alterar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is('application/json')){
                const dados = requisicao.body;
                const id = dados.id;
                const categoriasubgrupo = dados.categoriasubgrupo;
                const fornecedor = dados.fornecedor;
                const codigo = dados.codigo;
                const codigo_de_barras = dados.codigo_de_barras;
                const descricao = dados.descricao;
                const descricao_marca = dados.descricao_marca;
                const unidade_medida = dados.unidade_medida;
                const preco_custo = dados.preco_custo;
                const preco_venda = dados.preco_venda;
                const margem_lucro = dados.margem_lucro;
                const percentual_financeiro = dados.percentual_financeiro;
                const tributacao = dados.tributacao;
                const estoque = dados.estoque;
                const ativo = dados.ativo;

                if(id && categoriasubgrupo && fornecedor && codigo && codigo_de_barras && descricao && descricao_marca && unidade_medida && preco_custo && preco_venda && margem_lucro && percentual_financeiro && tributacao && estoque && ativo !== undefined){
                    const produto = new Produto(0, categoriasubgrupo, fornecedor, codigo, codigo_de_barras, descricao, descricao_marca, unidade_medida, preco_custo, preco_venda, margem_lucro, percentual_financeiro, tributacao, estoque, ativo, new Date().toISOString(), "");
                    produto.alterar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Produto alterada com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao alterar o produto: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar o Produto !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar um Produto !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar o produto", error);
            throw error;    
        }
        finally{conexao.release();}
    }

    async excluir(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "DELETE" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const id = dados.id;
                if(id){
                    const produto = new Produto(id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                    produto.excluir(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Produto deletado com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao deletar o Produto: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo do Produto !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar um Produto !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir o produto", error);
            throw error;
        }
        finally{conexao.release();}
    }

    async consultar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const filtros = [ "limit", "offset", "consulta"];
                const id = dados.id;
                const categoriasubgrupo = dados.categoriasubgrupo;
                const fornecedor = dados.fornecedor;
                const codigo = dados.codigo;
                const codigo_de_barras = dados.codigo_de_barras;
                const descricao = dados.descricao;
                const descricao_marca = dados.descricao_marca;
                const unidade_medida = dados.unidade_medida;
                const preco_custo = dados.preco_custo;
                const preco_venda = dados.preco_venda;
                const margem_lucro = dados.margem_lucro;
                const percentual_financeiro = dados.percentual_financeiro;
                const tributacao = dados.tributacao;
                const estoque = dados.estoque;
                const ativo = dados.ativo;
                //const ultimo_login = dados.ultimo_login;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(id && categoriasubgrupo && fornecedor && codigo && codigo_de_barras && descricao && descricao_marca && unidade_medida && preco_custo && preco_venda && margem_lucro && percentual_financeiro && tributacao && estoque && ativo !== undefined){
                    const produto = new Produto(id, categoriasubgrupo, fornecedor, codigo, codigo_de_barras, descricao, descricao_marca, unidade_medida, preco_custo, preco_venda, margem_lucro, percentual_financeiro, tributacao, estoque, ativo, "", "");
                    produto.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Produto consultado com sucesso !",
                            "listaProdutos": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar o Produto: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo do Produto !"
                    });
                }
            }
        } 
        catch(error){
            console.error("Erro ao consultar o produto", error);
            throw error;
        }
        finally{conexao.release();}
    }
}