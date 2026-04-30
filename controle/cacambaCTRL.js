import Cacamba from '../modelo/cacamba.js';
import conectar from "../persistencia/conexao.js";

export default class CacambaCTRL{
    
    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const tipoCacamba = dados.tipoCacamba;
                const numero = dados.numero;
                //const tamanho = dados.tamanho;
                const status = dados.status;
                const modelo = dados.modelo;
                const endereco_atual = dados.endereco_atual;
                //const ultima_revisao = dados.ultima_revisao;
                const ativo = dados.ativo;
                if(tipoCacamba && numero /*&& tamanho*/ && status && modelo && endereco_atual && ativo !== undefined){
                    const cacamba = new Cacamba(0, tipoCacamba, numero/*, tamanho*/, status, modelo, endereco_atual,/*ultima_revisao*/ "", ativo, "", "");
                    cacamba.gravar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "codigoGerado":cacamba.id,
                            "mensagem":"Caçamba incluída com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao registrar a Caçamba: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para a Caçamba !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar uma Caçamba !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar a Caçamba", error);
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
                const tipoCacamba = dados.tipoCacamba;
                const numero = dados.numero;
                //const tamanho = dados.tamanho;
                const status = dados.status;
                const modelo = dados.modelo;
                const endereco_atual = dados.endereco_atual;
                const ultima_revisao = (dados.ultima_revisao && dados.ultima_revisao !== "") ? dados.ultima_revisao : null;
                const ativo = dados.ativo;
                if(id && tipoCacamba && numero /*&& tamanho*/ && status && modelo && endereco_atual && ultima_revisao !== undefined && ativo !== undefined){
                    const cacamba = new Cacamba(id, tipoCacamba, numero/*, tamanho*/, status, modelo, endereco_atual, ultima_revisao, ativo, new Date().toISOString(), "");
                    cacamba.alterar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Caçamba alterada com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao alterar a Caçamba: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar a Caçamba !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar uma Caçamba !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar a Caçamba", error);
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
                    const cacamba = new Cacamba(id, {}, "", "", "", "", "", "", "", "");
                    cacamba.excluir(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Caçamba deletado com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao deletar a Caçamba: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo da Caçamba !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar uma Caçamba !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir a Caçamba", error);
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
                const tipoCacamba = dados.tipoCacamba;
                const numero = dados.numero;
                //const tamanho = dados.tamanho;
                const status = dados.status;
                const modelo = dados.modelo;
                const endereco_atual = dados.endereco_atual;
                //const ultima_revisao = dados.ultima_revisao;
                const ativo = dados.ativo;
                //const atualizada_em = dados.atualizada_em;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(numero || ativo !== undefined){
                    const cacamba = new Cacamba(id, {}, numero/*, tamanho*/, status, modelo, endereco_atual , "", ativo, "", "");
                    cacamba.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Caçamba consultado com sucesso !",
                            "listaCacambas": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar a Caçamba: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o numero da Caçamba !"
                    });
                }
            }
        } 
        catch(error){
            console.error("Erro ao consultar a Caçamba", error);
            throw error;
        }
        finally{conexao.release();}
    }
}