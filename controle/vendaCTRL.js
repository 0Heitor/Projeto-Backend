import Venda from '../modelo/venda.js';
import ItemVenda from '../modelo/itemVenda.js';
import Produto from '../modelo/produto.js';
import contaReceber from '../modelo/contaReceber.js';
import conectar from "../persistencia/conexao.js";

export default class VendaCTRL{
    //Arrumar ao atualizar o Estoque dentro do for
    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const cliente = dados.cliente;
                const usuario = dados.usuario;
                const total = dados.total;
                const forma_pagamento = dados.forma_pagamento;
                const descricao = dados.descricao;
                const data_vencimento = dados.data_vencimento;
                const status_conta = dados.status_conta;
                const ativo_conta = dados.ativo_conta;

                const status = dados.status;
                const ativo = dados.ativo;
                const itens = dados.itens;
                if(cliente && usuario && total && forma_pagamento && descricao && data_vencimento && status_conta && ativo_conta && status && ativo){
                    await conexao.query('BEGIN');
                    try{
                        const venda = new Venda(0, [], cliente, usuario, total, forma_pagamento, status, "", "");
                        if(status_conta == "PAGO")
                            venda.status = "PAGO";
                        await venda.gravar(conexao);
                        const idVendaGerado = venda.id;

                        for (const item of itens) {
                            const itemVenda = new ItemVenda(0, venda, item.produto, parseFloat(item.quantidade), item.ativo, "", "");
                            await itemVenda.gravar(conexao);
                            const produto = new Produto(item.produto.id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                            await produto.atualizarEstoque(conexao, parseFloat(item.quantidade * -1));
                        }
                        let conta;
                        if(status_conta == "PAGO")
                            conta = new contaReceber(0, cliente, "VENDA", total, forma_pagamento, data_vencimento, new Date().toISOString(), descricao, status_conta, ativo_conta, "", "");
                        else
                            conta = new contaReceber(0, cliente, "VENDA", total, forma_pagamento, data_vencimento, null, descricao, status_conta, ativo_conta, "", "");
                        conta.gravar(conexao);
                        await conexao.query('COMMIT');

                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": idVendaGerado,
                            "mensagem": "Venda e itens registrados com sucesso!"
                        });
                    } catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao processar itens da venda: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para a Venda !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar uma Venda !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar a venda", error);
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
                const usuario = dados.usuario;
                const total = dados.total;
                const forma_pagamento = dados.forma_pagamento;
                const descricao = dados.descricao;
                const data_vencimento = dados.data_vencimento;
                const status_conta = dados.status_conta;
                const ativo_conta = dados.ativo_conta;
                const status = dados.status;
                const ativo = dados.ativo;
                const itens = dados.itens;
                if(id && cliente && usuario && total && forma_pagamento && descricao &&data_vencimento && status_conta && ativo_conta && status && ativo !== undefined){
                    await conexao.query('BEGIN');
                    try{
                        const venda = new Venda(id, itens, cliente, usuario, total, forma_pagamento, status_conta, ativo, new Date().toISOString(), "");
                        await venda.alterar(conexao);
                        //const idVendaGerado = venda.id;

                        for (const item of itens) {
                            const itemBusca = new ItemVenda(item.id, {}, {}, 0, "", "", "");
                            const itemAnterior = await itemBusca.consultar({id: item.id}, conexao);
                            const quantidadeAnterior = itemAnterior.lista.length > 0 ? itemAnterior.lista[0].quantidade : 0;
                            const itemVenda = new ItemVenda(item.id, venda, item.produto, parseFloat(item.quantidade), item.ativo, new Date().toISOString(), "");
                            await itemVenda.alterar(conexao);
                            const produto = new Produto(item.produto.id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                            let quantidadeEstoque = item.quantidade - quantidadeAnterior;
                            await produto.atualizarEstoque(conexao, quantidadeEstoque);
                        }
                        let conta;
                        // Arrumar estar parte de alterar, possível alteração no banco de dados no acrescimo de uma coluna 
                        if(status_conta == "PAGO")
                            conta = new contaReceber(0, cliente, "VENDA", total, forma_pagamento, data_vencimento, new Date().toISOString(), descricao, status_conta, ativo_conta, "", "");
                        else
                            conta = new contaReceber(0, cliente, "VENDA", total, forma_pagamento, data_vencimento, null, descricao, status_conta, ativo_conta, "", "");
                        conta.gravar(conexao);
                        await conexao.query('COMMIT');

                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Venda e itens atualizados com sucesso!"
                        });
                    } catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao processar itens da venda: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar a Venda !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar a Venda !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar a venda", error);
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
                            const itemVenda = new ItemVenda(item.id, {}, {}, 0, "", "", "");
                            await itemVenda.excluir(conexao);
                            const produto = new Produto(item.produto.id, {}, {}, "", "", "", "", "", 0, 0, 0, 0, 0, 0, "", "", "");
                            await produto.atualizarEstoque(conexao, parseFloat(item.quantidade * 1) * 2);
                        }

                        //const compra = new Compra(id, [], fornecedor, data_compra, valor_total, status, ativo,  new Date().toISOString(), "");
                        const venda = new Venda(id, [], {}, "", 0, "", "",  new Date().toISOString(), "");
                        await venda.excluir(conexao);
                        const idVendaGerado = venda.id;

                        
                        await conexao.query('COMMIT');

                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Venda e itens deletados com sucesso!"
                        });
                    } catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao deletar itens da venda: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo da Venda !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar uma Venda !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir a Venda", error);
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
                const usuario = dados.usuario;
                const total = dados.total;
                const forma_pagamento = dados.forma_pagamento;
                const status = dados.status;
                const ativo = dados.ativo;
                const itens = dados.itens;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(id || cliente || usuario || ativo !== undefined){
                    const venda = new Venda(id, itens, cliente, usuario, total, forma_pagamento, status, ativo, "", "");
                    venda.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Venda consultada com sucesso !",
                            "listaVendas": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar a Venda: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe alguma informação da Venda !"
                    });
                }
            }
        }
        catch(error){
            console.error("Erro ao consultar a Venda", error);
            throw error;
        }
        finally{conexao.release();}
    }
}