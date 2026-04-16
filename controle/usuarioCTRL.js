import Usuario from '../modelo/usuario.js';
import conectar from "../persistencia/conexao.js";
import { enviarEmailRecuperacao } from '../servicos/emailService.js';

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
                    const usuario = new Usuario(0, nome, email, senha, nivel, ativo, "" , "", "", "", 0);
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
                const ultimo_login = dados.ultimo_login ? dados.ultimo_login : "";
                const codigo_recuperacao = dados.codigo_recuperacao ? dados.codigo_recuperacao : "";
                const codigo_recuperacao_validade = dados.codigo_recuperacao_validade ? dados.codigo_recuperacao_validade : "";
                const tentativas_recuperacao = dados.tentativas_recuperacao !== undefined ? parseInt(dados.tentativas_recuperacao, 10) : 0;

                //Alteração dos dados do usuário, mantendo os campos que não foram enviados inalterados
                //Validação para permitir alterar apenas o que foi enviado, mantendo os outros campos inalterados
                
                if(id && nome && email && senha && nivel && ativo !== undefined){
                    const usuario = new Usuario(id, nome, email, senha, nivel, ativo, ultimo_login, "", codigo_recuperacao, codigo_recuperacao_validade, tentativas_recuperacao);
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
                else
                if(email && ultimo_login && ultimo_login !== undefined){
                    const usuario = new Usuario(0, "", email, "", "", "", ultimo_login, "", "", "", 0);
                    usuario.atualizarLogin(conexao).then(()=>{
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
                else
                if(email && senha){
                    const usuario = new Usuario(0, "", email, senha, "", "", "", "", "", "", 0);
                    usuario.atualizarSenha(conexao).then(() => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Senha do Usuario alterada com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao alterar a senha do usuario: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar a senha do Usuario !"
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
                    const usuario = new Usuario(id, "", "", "", "", "", "", "", "", "", 0);
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
                    const usuario = new Usuario(id, nome, email, senha, nivel, ativo, "", "", "", "", 0);
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
        } 
        catch(error){
            console.error("Erro ao consultar usuario", error);
            throw error;
        }
        finally{conexao.release();}
    }

    async consultarEmail(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const filtros = [ "limit", "offset", "consulta"];
                const email = dados.email;
                const senha = dados.senha;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(email && senha || email){
                    const usuario = new Usuario(0, "", email, senha, "", "", "", "", "", "", 0);
                    usuario.consultarEmail(filtroFinal, conexao).then((resultado) => {
                        const listaApenasEmails = resultado.lista.map(usu => {
                            return usu.toJSONEmail();
                        });
                        
                        resposta.status(200).json({
                            "status":true,
                            "encontrado": resultado.encontrado,
                            "mensagem": resultado.encontrado ? "Usuario consultado com sucesso !" : "Usuario não encontrado !",
                            "listaUsuarios": listaApenasEmails,
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
        } 
        catch(error){
            console.error("Erro ao consultar usuario", error);
            throw error;
        }
        finally{conexao.release();}
    }

    async recuperarSenha(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const filtros = [ "limit", "offset", "consulta"];
                const email = dados.email;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(email){
                    //Gerar um código de recuperação aleatório de 6 dígitos
                    //const codigoRecuperacao = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                    const usuario = new Usuario(0, "", email, "", "", "", "", "", "", "", 0);
                    usuario.consultarEmail(filtroFinal, conexao).then(async (resultado) => {
                        if(resultado.encontrado){
                            try{
                                
                                const codigoRecuperacao = await enviarEmailRecuperacao(email);
                                usuario.codigo_recuperacao = codigoRecuperacao;
                                usuario.codigo_recuperacao_validade = new Date(Date.now() + 5 * 60 * 1000).toISOString();
                                usuario.tentativas_recuperacao = 5;
                                usuario.atualizarCodigoRecuperacao(conexao).then(() => {
                                    resposta.status(200).json({
                                        "status":true,
                                        "mensagem":"Código de recuperação gerado e enviado para o email do usuário !"
                                    });
                                }).catch((erro) => {
                                    resposta.status(500).json({
                                        "status":false,
                                        "mensagem":"Erro ao atualizar o código de recuperação: "+erro.message
                                    });
                                });
                            } 
                            catch(error) {
                                resposta.status(500).json({
                                    "status":false,
                                    "mensagem":"Erro ao enviar o email de recuperação: "+error.message
                                });
                            }
                        }
                        else{
                            resposta.status(404).json({
                                "status":false,
                                "mensagem":"Usuario não encontrado para o email informado !"
                            });
                        }
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar o usuário: "+erro.message
                        });
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
                    "mensagem":"Por favor informe o metodo POST para recuperar a senha de um Usuario !"
                });
            }
        }
        catch(error){
            console.error("Erro ao recuperar senha", error);
            throw error;
        }
        finally{conexao.release();}
    }

    async validarCodigoRecuperacao(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const email = dados.email;
                const codigo_recuperacao = dados.codigo;
                if(email && codigo_recuperacao){
                    const usuario = new Usuario(0, "", email, "", "", "", "", "", codigo_recuperacao, "", 0);
                    usuario.validarCodigoRecuperacao(conexao).then((resultado) => {
                        const user = resultado.usuarioInstancia;
                        if(resultado.encontrado){
                            user.tentativas_recuperacao = 0;
                            user.codigo_recuperacao = null;
                            user.codigo_recuperacao_validade = null;
                            resposta.status(200).json({
                                "status":true,
                                "mensagem":"Código de recuperação válido !"
                            });
                        }
                        else{
                            
                            let mensagemErro = "Código inválido.";
                    
                            if (resultado.motivo === "tentativas_esgotadas") {
                                mensagemErro = "Tentativas esgotadas. Solicite um novo código por e-mail.";
                            } 
                            else 
                            if (resultado.motivo === "expirado") {
                                mensagemErro = "Este código expirou. Por favor, solicite um novo.";
                            } 
                            else 
                            if (resultado.motivo === "codigo_errado") {
                                // Diminuir tentativa apenas se o código estiver errado
                                user.tentativas_recuperacao -= 1;
                                mensagemErro = `Código incorreto! Você ainda tem ${user.tentativas_recuperacao} tentativas.`;
                            } 
                            else {
                                mensagemErro = "Usuário não encontrado.";
                            }

                            resposta.status(404).json({
                                "status": false,
                                "mensagem": mensagemErro,
                                "tentativas_restantes": user.tentativas_recuperacao//user ? user.tentativas_recuperacao : 0
                            });
                        }
                        user.atualizarCodigoRecuperacao(conexao);
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o email e o código de recuperação !"
                    });
                }

            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para validar o código de recuperação de um Usuario !"
                });
            }
        }
        catch(error){
            console.error("Erro ao validar código de recuperação", error);
            throw error;
        }
        finally{conexao.release();}
    }
}