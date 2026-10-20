import Locacao from '../modelo/locacao.js';
import ItemCacamba from '../modelo/itemCacamba.js';
import Cacamba from '../modelo/cacamba.js';
import contaReceber from '../modelo/contaReceber.js';
import conectar from "../persistencia/conexao.js";

export default class LocacaoCTRL{
    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const cliente = dados.cliente;
                //const data_pedido = dados.data_pedido;
                const data_entrega = dados.data_entrega;
                const data_retirada_prevista = dados.data_retirada_prevista;
                //const data_retirada_real = dados.data_retirada_real;
                const endereco_entrega = dados.endereco_entrega;
                const valor_total = dados.valor_total;
                const status = dados.status;
                const ativo = dados.ativo;
                const itens = dados.itens;
                if(cliente && data_entrega && data_retirada_prevista && endereco_entrega && valor_total && status && ativo){
                    await conexao.query('BEGIN');
                    try{
                        const locacao = new Locacao(0, cliente, itens, data_entrega, data_entrega, data_retirada_prevista, "", endereco_entrega, valor_total, status, ativo, "", "");
                        await locacao.gravar(conexao);
                        const idLocacaoGerado = locacao.id;

                        for (const item of itens) {
                            const itemCacamba = new ItemCacamba(0, locacao, item.cacamba, parseFloat(item.quantidade), parseFloat(item.valor_unitario), item.data_retirada_real, item.status_item, item.ativo, "", "");
                            await itemCacamba.gravar(conexao);
                            const cacamba = new Cacamba(item.cacamba.id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                            await cacamba.atualizarEstado("ALUGADA", conexao);
                        }
                        await conexao.query('COMMIT');

                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": idLocacaoGerado,
                            "mensagem": "Locação e itens registrados com sucesso!"
                        });
                    } catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao processar itens da locação: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para a Locação !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar uma Locação !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar a locação", error);
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
                const cliente = dados.cliente;
                const data_pedido = dados.data_pedido;
                const data_entrega = dados.data_entrega;
                const data_retirada_prevista = dados.data_retirada_prevista;
                const data_retirada_real = dados.data_retirada_real;
                const endereco_entrega = dados.endereco_entrega;
                const valor_total = dados.valor_total;
                const status = dados.status;
                const status_conta = dados.status_conta;
                const ativo = dados.ativo;
                const ativo_conta = dados.ativo_conta;
                const itens = dados.itens;


                // const origem_tipo = dados.origem_tipo;
                const forma_pagamento = dados.forma_pagamento;
                const descricao = dados.descricao;
                const data_vencimento = dados.data_vencimento;
                if(id && cliente && data_pedido && data_entrega && data_retirada_prevista && /*data_retirada_real &&*/ endereco_entrega && valor_total && status && ativo !== undefined){
                    await conexao.query('BEGIN');
                    try{
                        const locacao = new Locacao(id, cliente, itens, data_pedido, data_entrega, data_retirada_prevista, /*data_retirada_real*/ new Date().toISOString(), endereco_entrega, valor_total, status, ativo, new Date().toISOString(), "");
                        await locacao.alterar(conexao);
                        //const idLocacaoGerado = locacao.id;

                        for (const item of itens) {
                            const itemBusca = new ItemCacamba(item.id, {}, {}, 0, "", "", "", ""/* atualizado_em */, "");
                            const itemAnterior = await itemBusca.consultar({id: item.id}, conexao);
                            const quantidadeAnterior = itemAnterior.lista.length > 0 ? itemAnterior.lista[0].quantidade : 0;
                            const itemCompra = new ItemCacamba(item.id, locacao, item.cacamba, parseFloat(item.valor_unitario), item.data_retirada_real, item.status_item, item.ativo, new Date().toISOString(), "");
                            await itemCompra.alterar(conexao);
                            // Atualiza o status da cacamba
                            const cacamba = new Cacamba(item.cacamba.id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                            await cacamba.atualizarEstado(item.status, conexao);
                        }
                        const conta = new contaReceber(0, cliente, "LOCAÇÃO", valor_total, forma_pagamento, data_vencimento, "", descricao, status_conta, ativo_conta, "", "");
                        conta.gravar(conexao);
                        await conexao.query('COMMIT');

                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Locação e itens atualizados com sucesso!"
                        });
                    } catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao processar itens da locação: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar a Locação !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar a Locação !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar a locação", error);
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
                            const itemCacamba = new ItemCacamba(item.id, {}, {}, 0, "", "", "", "", "");
                            await itemCacamba.excluir(conexao);
                            const cacamba = new Cacamba(item.cacamba.id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                            await cacamba.atualizarEstado(item.cacamba.status, conexao);
                        }

                        //const compra = new Compra(id, [], fornecedor, data_compra, valor_total, status, ativo,  new Date().toISOString(), "");
                        const locacao = new Locacao(id, {}, [], "", "", "", "", "", 0, "", "", "", "");
                        await locacao.excluir(conexao);
                        const idLocacaoGerado = locacao.id;

                        
                        await conexao.query('COMMIT');

                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Locação e itens deletados com sucesso!"
                        });
                    } catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao deletar itens da locação: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo da Locação !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar uma Locação !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir a Locação", error);
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
                const cliente = dados.cliente;
                //const usuario = dados.usuario;
                //const data_compra = dados.data_compra;
                //const valor_total = dados.valor_total;
                const status = dados.status;
                const itens = dados.itens;
                const ativo = dados.ativo;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(id || cliente || status || ativo !== undefined){
                    const locacao = new Locacao(id, cliente, itens, "", "", "", "", "", 0, status, ativo, "", "");
                    locacao.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Locação consultada com sucesso !",
                            "listaLocacoes": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar a Locação: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe alguma informação da Locação !"
                    });
                }
            }
        }
        catch(error){
            console.error("Erro ao consultar a Locação", error);
            throw error;
        }
        finally{conexao.release();}
    }
}