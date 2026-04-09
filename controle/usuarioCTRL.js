import Usuario from '../modelo/usuario.js';
import conectar from "../persistencia/conexao.js";

export default class UsuarioCTRL{
    
    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const nome = dados.nome;
                const email = dados.email;
                const senha = dados.senha;
                const nivel = dados.nivel;
                const ativo = dados.ativo;
                if(nome && email && senha && nivel && ativo !== undefined){
                    const usuario = new Usuario(0, nome, email, senha, nivel, ativo, new Date().toISOString() , "");
                    usuario.gravar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "codigoGerado":usuario.id,
                            "mensagem":"Usuario incluída com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao registrar o usuario: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para o Usuário !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar um Usuário !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar usuario", error);
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
                const email = dados.email;
                const senha = dados.senha;
                const nivel = dados.nivel;
                const ativo = dados.ativo;
                //const criado = dados.criado;
                if(id && nome && email && senha && nivel && ativo !== undefined){
                    const usuario = new Usuario(id, nome, email, senha, nivel, ativo, new Date().toISOString(), "");
                    usuario.alterar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Usuario alterada com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao alterar a usuario: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar o Usuario !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar um Usuario !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar usuario", error);
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
                    const usuario = new Usuario(id, "", "", "", "", "", "", "");
                    usuario.excluir(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Usuario deletado com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao deletar o Usuario: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo do Usuario !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar um Usuario !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir usuario", error);
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
                const nome = dados.nome;
                const email = dados.email;
                const senha = dados.senha;
                const nivel = dados.nivel;
                const ativo = dados.ativo;
                //const ultimo_login = dados.ultimo_login;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(email || ativo !== undefined){
                    const usuario = new Usuario(id, nome, email, senha, nivel, ativo, "", "");
                    usuario.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Usuario consultado com sucesso !",
                            "listaUsuarios": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar o usuario: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o email do Usuario !"
                    });
                }
            }
            /*else
            if(requisicao.method === "GET"){
                const camposPedidos = requisicao.query;
                //const dados = requisicao.body;
                let filtroFinal = {};
                let count = 0;

                for(const campo in camposPedidos){
                    const valorNoBody = camposPedidos.usuario ? camposPedidos.usuario[campo] : undefined;

                    if(valorNoBody !== undefined){
                        filtroFinal[campo] = valorNoBody;
                        count++;
                    }
                }

                if(count > 0){
                    console.log(count);
                    const usuario = new Usuario(0, "", "", "", "", "", "", "");
                    usuario.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Usuario consultado com sucesso !",
                            "listaUsuarios": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar o usuario: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o email do Usuario !"
                    });
                }
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para buscar um Usuario !"
                });
            }*/
        } 
        catch(error){
            console.error("Erro ao consultar usuario", error);
            throw error;
        }
        finally{conexao.release();}
    }
}