import tipoCacamba from "../modelo/tipoCacamba.js";
import conectar from "../persistencia/conexao.js";

export default class TipoCacambaCTRL{
    
    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const nome = dados.nome;
                const volume = dados.volume;
                const preco = dados.preco;
                const descricao = dados.descricao;
                const ativo = dados.ativo;
                if(nome && volume && preco && descricao && ativo !== undefined){
                    const tipo = new tipoCacamba(0, nome, volume, preco, descricao, ativo, "", "");
                    tipo.gravar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "codigoGerado":tipo.id,
                            "mensagem":"Tipo de Caçamba incluída com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao registrar o Tipo de Caçamba: "+erro.message
                        })
                    });
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
                const nome = dados.nome;
                const volume = dados.volume;
                const preco = dados.preco;
                const descricao = dados.descricao;
                const ativo = dados.ativo;
                if(id && nome && volume && preco && descricao && ativo !== undefined){
                    const tipo = new tipoCacamba(id, nome, volume, preco, descricao, ativo, new Date().toISOString(), "");
                    tipo.alterar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "codigoAlterado":tipo.id,
                            "mensagem":"Tipo de Caçamba alterada com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao alterar o Tipo de Caçamba: "+erro.message
                        })
                    });
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
                    "mensagem":"Por favor informe o metodo PUT ou PATCH para alterar um Tipo de Caçamba !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar o Tipo de Caçamba", error);
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
                    const tipo = new tipoCacamba(id, "", 0, 0, "", "", "", "");
                    tipo.excluir(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Tipo de Caçamba excluída com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao excluir o Tipo de Caçamba: "+erro.message
                        })
                    });
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
    }

    async consultar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const filtros = [ "limit", "offset", "consulta"];
                const dados = requisicao.body;
                const id = dados.id;
                const nome = dados.nome;
                const volume = dados.volume;
                const preco = dados.preco;
                const ativo = dados.ativo;
                const descricao = dados.descricao;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(nome || volume || descricao || ativo !== undefined){
                    const tipo = new tipoCacamba(id, nome, volume, preco, descricao, ativo, "", "");
                    tipo.consultar(filtroFinal, conexao).then((resultado)=>{
                        if(resultado){
                            resposta.status(200).json({
                                "status":true,
                                "mensagem":"Tipos de Caçambas consultado com sucesso !",
                                "listaTiposCacambas": resultado.lista,
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