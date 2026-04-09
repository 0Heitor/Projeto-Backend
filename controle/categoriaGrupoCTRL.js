import Categoriagrupo from '../modelo/categoriagrupo.js';
import conectar from "../persistencia/conexao.js";

export default class CategoriaGrupoCTRL{

    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const nome = dados.nome;
                const margem_lucro = dados.margem_lucro;
                const comissao_padrao = dados.comissao_padrao;
                const ativo = dados.ativo;
                if(nome && margem_lucro && comissao_padrao && ativo !== undefined){
                    const categoriagrupo = new Categoriagrupo(0, nome, margem_lucro, comissao_padrao, ativo, "", "");
                    categoriagrupo.gravar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "codigoGerado":categoriagrupo.id,
                            "mensagem":"Categoria Grupo incluída com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao registrar a Categoria Grupo: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para a Categoria Grupo !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar uma Categoria Grupo !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar a Categoria Grupo", error);
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
                const margem_lucro = dados.margem_lucro;
                const comissao_padrao = dados.comissao_padrao;
                const ativo = dados.ativo;
                if(id && nome && margem_lucro && comissao_padrao && ativo !== undefined){
                    const categoriagrupo = new Categoriagrupo(id, nome, margem_lucro, comissao_padrao, ativo, new Date().toISOString(), "");
                    categoriagrupo.alterar(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Categoria Grupo alterada com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao alterar a Categoria Grupo: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar a Categoria Grupo !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar uma Categoria Grupo !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar a Categoria Grupo", error);
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
                    const categoriagrupo = new Categoriagrupo(id, "", "", "", "", "", "");
                    categoriagrupo.excluir(conexao).then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Categoria Grupo deletado com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao deletar a Categoria Grupo: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo da Categoria Grupo !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar uma Categoria Grupo !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir a Categoria Grupo", error);
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
                const margem_lucro = dados.margem_lucro;
                const comissao_padrao = dados.comissao_padrao;
                const ativo = dados.ativo;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(ativo !== undefined){
                    const categoriagrupo = new Categoriagrupo(id, nome, margem_lucro, comissao_padrao, ativo, "", "");
                    categoriagrupo.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Categoria Grupo consultado com sucesso !",
                            "listaCategoriasGrupo": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar a Categoria Grupo: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o nome da Categoria Grupo !"
                    });
                }
            }
        } 
        catch(error){
            console.error("Erro ao consultar a Categoria Grupo", error);
            throw error;
        }
        finally{conexao.release();}
    }
}