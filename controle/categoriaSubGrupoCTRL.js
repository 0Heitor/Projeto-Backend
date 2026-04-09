import Categoriasubgrupo from '../modelo/categoriasubgrupo.js';
import conectar from "../persistencia/conexao.js";

export default class CategoriaSubGrupoCTRL{

    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const categoriagrupo = dados.categoriagrupo;
                const nome = dados.nome;
                const ncm_padrao = dados.ncm_padrao;
                const localizacao = dados.localizacao;
                const ativo = dados.ativo;

                if(categoriagrupo && nome && ncm_padrao && localizacao && ativo !== undefined){
                    const categoriasubgrupo = new Categoriasubgrupo(0, nome, ncm_padrao, localizacao, ativo, "", "", categoriagrupo);
                    categoriasubgrupo.gravar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "codigoGerado":categoriasubgrupo.id,
                            "mensagem":"Categoria Sub-Grupo incluída com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao registrar a Categoria Sub-Grupo: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para a Categoria Sub-Grupo !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar uma Categoria Sub-Grupo !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar a Categoria Sub-Grupo", error);
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
                const categoriagrupo = dados.categoriagrupo;
                const nome = dados.nome;
                const ncm_padrao = dados.ncm_padrao;
                const localizacao = dados.localizacao;
                const ativo = dados.ativo;
                if(id && categoriagrupo && nome && ncm_padrao && localizacao && ativo !== undefined){
                    const categoriasubgrupo = new Categoriasubgrupo(0, nome, ncm_padrao, localizacao, ativo, new Date().toISOString(), "", categoriagrupo);
                    categoriasubgrupo.alterar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Categoria Sub-Grupo alterada com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao alterar a Categoria Sub-Grupo: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar a Categoria Sub-Grupo !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar uma Categoria Sub-Grupo !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar a Categoria Sub-Grupo", error);
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
                    const categoriasubgrupo = new Categoriasubgrupo(id, "", "", "", "", "", "", {});
                    categoriasubgrupo.excluir(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Categoria Sub-Grupo deletado com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao deletar a Categoria Sub-Grupo: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo da Categoria Sub-Grupo !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar uma Categoria Sub-Grupo !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir a Categoria Sub-Grupo", error);
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
                const categoriagrupo = dados.categoriagrupo;
                const nome = dados.nome;
                const ncm_padrao = dados.ncm_padrao;
                const localizacao = dados.localizacao;
                const ativo = dados.ativo;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(ativo !== undefined){
                    const categoriasubgrupo = new Categoriasubgrupo(id, nome, ncm_padrao, localizacao, ativo, "", "", categoriagrupo);
                    categoriasubgrupo.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Categoria Sub-Grupo consultado com sucesso !",
                            "listaCategoriasSubGrupo": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar a Categoria Sub-Grupo: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o nome do Categoria Sub-Grupo !"
                    });
                }
            }
        } 
        catch(error){
            console.error("Erro ao consultar a Categoria Sub-Grupo", error);
            throw error;
        }
        finally{conexao.release();}
    }   
}