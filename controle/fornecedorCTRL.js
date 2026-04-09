import Fornecedor from '../modelo/fornecedor.js';
import conectar from "../persistencia/conexao.js";

export default class FornecedorCTRL{
    
    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const codigo = dados.codigo;
                const nome_fantasia = dados.nome_fantasia;
                const cnpj = dados.cnpj;
                const telefone = dados.telefone;
                const uf = dados.uf;
                const cidade = dados.cidade;
                const bairro = dados.bairro;
                const endereco = dados.endereco;
                const ativo = dados.ativo;
                if(codigo && nome_fantasia && cnpj && telefone && uf && cidade && bairro && endereco && ativo !== undefined){
                    const fornecedor = new Fornecedor(0, codigo, nome_fantasia, cnpj, telefone, uf, cidade, bairro, endereco, ativo, "");
                    fornecedor.gravar().then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "codigoGerado":fornecedor.id,
                            "mensagem":"Fornecedor incluída com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao registrar o fornecedor: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para o Fornecedor !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar um Fornecedor !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar o fornecedor", error);
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
                const codigo = dados.codigo;
                const nome_fantasia = dados.nome_fantasia;
                const cnpj = dados.cnpj;
                const telefone = dados.telefone;
                const uf = dados.uf;
                const cidade = dados.cidade;
                const bairro = dados.bairro;
                const endereco = dados.endereco;
                const ativo = dados.ativo;
                if(id && codigo && nome_fantasia && cnpj && telefone && uf && cidade && bairro && endereco && ativo !== undefined){
                    const fornecedor = new Fornecedor(id, codigo, nome_fantasia, cnpj, telefone, uf, cidade, bairro, endereco, ativo, "");
                    fornecedor.alterar().then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Fornecedor alterada com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao alterar a fornecedor: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar o Fornecedor !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar um Fornecedor !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar o fornecedor", error);
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
                    const fornecedor = new Fornecedor(id, 0, "", "", "", "", "", "", "", "", "");
                    fornecedor.excluir().then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Fornecedor deletado com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao deletar o Fornecedor: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo do Fornecedor !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar um Fornecedor !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir o fornecedor", error);
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
                const codigo = dados.codigo;
                const nome_fantasia = dados.nome_fantasia;
                const cnpj = dados.cnpj;
                const telefone = dados.telefone;
                const uf = dados.uf;
                const cidade = dados.cidade;
                const bairro = dados.bairro;
                const endereco = dados.endereco;
                const ativo = dados.ativo;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(ativo !== undefined){
                    const fornecedor = new Fornecedor(id, codigo, nome_fantasia, cnpj, telefone, uf, cidade, bairro, endereco, ativo, "");
                    fornecedor.consultar(filtroFinal).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Fornecedor consultado com sucesso !",
                            "listaFornecedores": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar o fornecedor: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe alguma informação do Fornecedor !"
                    });
                }
            }
        }
        catch(error){
            console.error("Erro ao consultar o fornecedor", error);
            throw error;
        }
        finally{conexao.release();}
    }
}