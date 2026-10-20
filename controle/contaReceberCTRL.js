import contaReceber from "../modelo/contaReceber.js";
import conectar from "../persistencia/conexao.js";

export default class ContaReceberCTRL{
    
    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const cliente = dados.cliente;
                const origem_tipo = dados.origem_tipo;
                const valor_total = dados.valor_total;
                const forma_pagamento = dados.forma_pagamento;
                const descricao = dados.descricao;
                const status = dados.status;
                const ativo = dados.ativo;
                if(cliente && origem_tipo && valor_total && forma_pagamento && descricao && status && ativo !== undefined){
                    const conta = new contaReceber(0, cliente, origem_tipo, valor_total, forma_pagamento, new Date().toISOString(), "", descricao, status, ativo, "", "");
                    await conexao.query('BEGIN');
                    try{
                        conta.gravar(conexao);//.then(()=>{
                        await conexao.query('COMMIT');
                        resposta.status(200).json({
                            "status":true,
                            "codigoGerado":conta.id,
                            "mensagem":"Conta a Receber incluída com sucesso !"
                        })
                    }catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao processar o Tipo de Caçamba: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para o Tipo de Caçamba !"
                    });
                }
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar um Tipo de Caçamba !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar o Tipo de Caçamba", error);
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
                const origem_tipo = dados.origem_tipo;
                const valor_total = dados.valor_total;
                const forma_pagamento = dados.forma_pagamento;
                const data_vencimento = dados.data_vencimento;
                const descricao = dados.descricao;
                // const data_pagamento = dados.data_pagamento;
                const status = dados.status;
                const ativo = dados.ativo;
                if(id && cliente && origem_tipo && valor_total && forma_pagamento && data_vencimento && descricao && status && ativo !== undefined){
                    const agora = new Date();
                    const offsetMs = agora.getTimezoneOffset() * 60000;
                    const dataHoraLocal = new Date(agora.getTime() - offsetMs);

                    const timestampParaPostgres = dataHoraLocal.toISOString().slice(0, 19).replace('T', ' ');
                    const conta = new contaReceber(id, cliente, origem_tipo, valor_total, forma_pagamento, data_vencimento, new Date().toISOString(), descricao, status, ativo, timestampParaPostgres, "");
                    
                    await conexao.query('BEGIN');
                    try{
                        conta.alterar(conexao);//.then(()=>{
                        await conexao.query('COMMIT');
                            resposta.status(200).json({
                            "status":true,
                            "codigoAlterado":conta.id,
                            "mensagem":"Conta alterada com sucesso !"
                        })
                    
                    }catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao processar a Conta: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para a Conta !"
                    });
                }
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT ou PATCH para alterar uma Conta !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar a Conta", error);
            throw error;
        }
        finally{conexao.release();}
    }

    /*async excluir(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "DELETE" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const id = dados.id;
                if(id){
                    const tipo = new tipoCacamba(id, "", 0, 0, "", "", "", "");
                    await conexao.query('BEGIN');
                    try{
                        tipo.excluir(conexao);//.then(()=>{
                        await conexao.query('COMMIT');
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Tipo de Caçamba excluída com sucesso !"
                        })
                        
                    }catch (erroInterno) {
                        await conexao.query('ROLLBACK');
                        console.error("Erro na transação:", erroInterno);
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao processar o Tipo de Caçamba: " + erroInterno.message
                        });
                    }
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o ID do Tipo de Caçamba a ser excluído !"
                    });
                }
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para excluir um Tipo de Caçamba !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir o Tipo de Caçamba", error);
            throw error;
        }
        finally{conexao.release();}
    }*/

    async consultar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const filtros = [ "limit", "offset", "consulta"];
                const dados = requisicao.body;
                const id = dados.id;
                const cliente = dados.nome;
                const data_vencimento = dados.data_vencimento;
                const status = dados.status;
                const ativo = dados.ativo;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(cliente || data_vencimento || status || ativo !== undefined){
                    const conta = new contaReceber(id, cliente, "", "", "", data_vencimento, "", "", status, ativo, "", "");
                    conta.consultar(filtroFinal, conexao).then((resultado)=>{
                        if(resultado){
                            resposta.status(200).json({
                                "status":true,
                                "mensagem":"Tipos de Caçambas consultado com sucesso !",
                                "listaFinanceiros": resultado.lista,
                                "totalRegistros": resultado.total
                            })
                        }
                        else{
                            resposta.status(404).json({
                                "status":false,
                                "mensagem":"Tipo de Caçamba não encontrada !"
                            })
                        }
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar o Tipo de Caçamba: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o ID do Tipo de Caçamba a ser consultado !"
                    });
                }
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo GET para consultar um Tipo de Caçamba !"
                });
            }
        }
        catch(error){
            console.error("Erro ao consultar o Tipo de Caçamba", error);
            throw error;
        }
        finally{conexao.release();}
    }
}