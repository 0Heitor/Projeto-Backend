import Compra from '../modelo/compra.js';
import ItemCompra from '../modelo/itemCompra.js';
import Produto from '../modelo/produto.js';
import conectar from "../persistencia/conexao.js";

export default class CompraCTRL{
    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const fornecedor = dados.fornecedor;
                const valor_total = dados.valor_total;
                const status = dados.status;
                const ativo = dados.ativo;
                const itens = dados.itens;
                if(fornecedor && valor_total && ativo){
                    await conexao.query('BEGIN');
                    try{
                        const compra = new Compra(0, [], fornecedor, "", valor_total, "", ativo, "", "");
                        await compra.gravar(conexao);
                        const idCompraGerado = compra.id;

                        for (const item of itens) {
                            const itemCompra = new ItemCompra(0, compra, item.produto, parseFloat(item.quantidade), parseFloat(item.valor_unitario), item.ativo, "", "");
                            await itemCompra.gravar(conexao);
                            const produto = new Produto(item.produto.id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                            await produto.atualizarEstoque(conexao, parseFloat(item.quantidade));
                        }
                        await conexao.query('COMMIT');

                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": idCompraGerado,
                            "mensagem": "Compra e itens registrados com sucesso!"
                        });
                    } catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao processar itens da compra: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para a Compra !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar uma Compra !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar a compra", error);
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
                const fornecedor = dados.fornecedor;
                const data_compra = dados.data_compra;
                const valor_total = dados.valor_total;
                const status = dados.status;
                const ativo = dados.ativo;
                const itens = dados.itens;
                if(id && fornecedor && data_compra && valor_total && status && ativo !== undefined){
                    await conexao.query('BEGIN');
                    try{
                        const compra = new Compra(id, itens, fornecedor, data_compra, valor_total, status, ativo,  new Date().toISOString(), "");
                        await compra.alterar(conexao);
                        //const idCompraGerado = compra.id;

                        for (const item of itens) {
                            const itemBusca = new ItemCompra(item.id, {}, {}, 0, "", "", "", "");
                            const itemAnterior = await itemBusca.consultar({id: item.id}, conexao);
                            const quantidadeAnterior = itemAnterior.lista.length > 0 ? itemAnterior.lista[0].quantidade : 0;
                            const itemCompra = new ItemCompra(item.id, compra, item.produto, parseFloat(item.quantidade), parseFloat(item.valor_unitario), item.ativo,  new Date().toISOString(), "");
                            await itemCompra.alterar(conexao);
                            const produto = new Produto(item.produto.id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                            let quantidadeEstoque = item.quantidade - quantidadeAnterior;
                            await produto.atualizarEstoque(conexao, quantidadeEstoque);
                        }
                        await conexao.query('COMMIT');

                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Compra e itens atualizados com sucesso!"
                        });
                    } catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao processar itens da compra: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar a Compra !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar a Compra !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar a compra", error);
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
                const itens = dados.itens;
                if(id){

                    await conexao.query('BEGIN');
                    try{

                        for (const item of itens) {
                            const itemCompra = new ItemCompra(item.id, {}, {}, 0, "", "", "", "");
                            await itemCompra.excluir(conexao);
                            const produto = new Produto(item.produto.id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                            await produto.atualizarEstoque(conexao, item.quantidade * -1);
                        }

                        //const compra = new Compra(id, [], fornecedor, data_compra, valor_total, status, ativo,  new Date().toISOString(), "");
                        const compra = new Compra(id, [], {}, "", 0, "", "",  new Date().toISOString(), "");
                        await compra.excluir(conexao);
                        const idCompraGerado = compra.id;

                        
                        await conexao.query('COMMIT');

                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Compra e itens deletados com sucesso!"
                        });
                    } catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao deletar itens da compra: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo da Compra !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar uma Compra !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir a Compra", error);
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
                const fornecedor = dados.fornecedor;
                //const usuario = dados.usuario;
                const data_compra = dados.data_compra;
                //const valor_total = dados.valor_total;
                //const status = dados.status;
                const itens = dados.itens;
                const ativo = dados.ativo;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(id || fornecedor || data_compra || ativo !== undefined){
                    const compra = new Compra(id, itens, fornecedor/*, usuario*/, data_compra, 0, "", ativo, "", "");
                    compra.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Compra consultado com sucesso !",
                            "listaCompras": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar a Compra: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe alguma informação da Compra !"
                    });
                }
            }
        }
        catch(error){
            console.error("Erro ao consultar a Compra", error);
            throw error;
        }
        finally{conexao.release();}
    }

    async consultarPorItemCompra(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const filtros = [ "limit", "offset", "consulta"];
                const id = dados.id;
                /*const compra = dados.compra;
                const produto = dados.produto;
                const data_compra = dados.data_compra;
                const criado_em = dados.criado_em;
                const atualizado_em = dados.atualizado_em;*/
                const ativo = dados.ativo;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(id || fornecedor || data_compra || ativo !== undefined){
                    const compra = new Compra(id, {}, [], "", 0, "", ativo, "", "");
                    compra.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Compra consultado com sucesso !",
                            "listaCompras": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar a Compra: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe alguma informação da Compra !"
                    });
                }
            }
        }
        catch(error){
            console.error("Erro ao consultar a Compra", error);
            throw error;
        }
        finally{conexao.release();}
    }
}