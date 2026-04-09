import Cliente from '../modelo/cliente.js';
import conectar from "../persistencia/conexao.js";

export default class ClienteCTRL{
    
    async gravar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const nome = dados.nome;
                const cpf_cnpj = dados.cpf_cnpj;
                const rg = dados.rg;
                const data_nascimento = dados.data_nascimento;
                const profissao = dados.profissao;
                const local_trabalho = dados.local_trabalho;
                const telefone = dados.telefone;
                const cep = dados.cep;
                const endereco = dados.endereco;
                const ativo = dados.ativo;
                const observacoes = dados.observacoes;
                if(nome && cpf_cnpj && rg && data_nascimento && profissao && local_trabalho && telefone && cep && endereco && ativo !== undefined && observacoes){
                    const cliente = new Cliente(0, nome, cpf_cnpj, rg, data_nascimento, profissao, local_trabalho, telefone, cep, endereco, ativo, observacoes, "");
                    cliente.gravar().then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "codigoGerado":cliente.id,
                            "mensagem":"Cliente incluída com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao registrar o cliente: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe as informações necessárias para o Cliente !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo POST para cadastrar um Cliente !"
                });
            }
        }
        catch(error){
            console.error("Erro ao gravar o cliente", error);
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
                const cpf_cnpj = dados.cpf_cnpj;
                const rg = dados.rg;
                const data_nascimento = dados.data_nascimento;
                const profissao = dados.profissao;
                const local_trabalho = dados.local_trabalho;
                const telefone = dados.telefone;
                const cep = dados.cep;
                const endereco = dados.endereco;
                const ativo = dados.ativo;
                const observacoes = dados.observacoes;
                if(id && nome && cpf_cnpj && rg && data_nascimento && profissao && local_trabalho && telefone && cep && endereco && ativo !== undefined && observacoes){
                    const cliente = new Cliente(id, nome, cpf_cnpj, rg, data_nascimento, profissao, local_trabalho, telefone, cep, endereco, ativo, observacoes, "");
                    cliente.alterar().then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Cliente alterada com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao alterar o cliente: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe os dados necessários para alterar o Cliente !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo PUT para alterar um Cliente !"
                });
            }
        }
        catch(error){
            console.error("Erro ao alterar o cliente", error);
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
                    const cliente = new Cliente(id, "", "", "", "", "", "", "", "", "", "", "", "");
                    cliente.excluir().then(()=>{
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Cliente deletado com sucesso !"
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao deletar o Cliente: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o codigo do Cliente !"
                    });
                }  
            }
            else{
                resposta.status(400).json({
                    "status":false,
                    "mensagem":"Por favor informe o metodo DELETE para deletar um Cliente !"
                });
            }
        }
        catch(error){
            console.error("Erro ao excluir o cliente", error);
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
                const cpf_cnpj = dados.cpf_cnpj;
                const rg = dados.rg;
                const data_nascimento = dados.data_nascimento;
                const profissao = dados.profissao;
                const local_trabalho = dados.local_trabalho;
                const telefone = dados.telefone;
                const cep = dados.cep;
                const endereco = dados.endereco;
                const ativo = dados.ativo;
                const observacoes = dados.observacoes;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(ativo !== undefined){
                    const cliente = new Cliente(id, nome, cpf_cnpj, rg, data_nascimento, profissao, local_trabalho, telefone, cep, endereco, ativo, observacoes, "");
                    cliente.consultar(filtroFinal).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Cliente consultado com sucesso !",
                            "listaClientes": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar o cliente: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe alguma informação do Cliente !"
                    });
                }
            }
        }
        catch(error){
            console.error("Erro ao consultar o cliente", error);
            throw error;
        }
        finally{conexao.release();}
    }
}