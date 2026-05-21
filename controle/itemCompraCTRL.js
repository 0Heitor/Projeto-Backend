import ItemCompra from '../modelo/itemCompra.js';
import conectar from "../persistencia/conexao.js";

export default class ItemCompraCTRL{
    async consultar(requisicao, resposta){
        const conexao = await conectar();
        try{
            resposta.type("application/json");
            if(requisicao.method === "POST" && requisicao.is('application/json')){
                const dados = requisicao.body;
                const filtros = [ "limit", "offset", "consulta"];
                const id = dados.id;
                const compra = dados.compra;
                const produto = dados.produto;
                const quantidade = dados.quantidade;
                const valor_unitario = dados.valor_unitario;
                const ativo = dados.ativo;
                let filtroFinal = {};
                for(const i in filtros){
                    if(filtros[i] == "limit" || filtros[i] == "offset")
                        filtroFinal[filtros[i]] = parseInt(dados[filtros[i]], 10);// || 0;
                    else
                        filtroFinal[filtros[i]] = dados[filtros[i]];
                }
                if(compra || produto /*|| quantidade !== undefined || valor_unitario !== undefined*/ || ativo !== undefined){
                    const itemcompra = new ItemCompra(id, compra, produto, 0, 0, ativo, "", "");
                    itemcompra.consultar(filtroFinal, conexao).then((resultado) => {
                        resposta.status(200).json({
                            "status":true,
                            "mensagem":"Item da Compra consultado com sucesso !",
                            "listaItensCompra": resultado.lista,
                            "totalRegistros": resultado.total
                        })
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status":false,
                            "mensagem":"Erro ao consultar o Item da Compra: "+erro.message
                        })
                    });
                }
                else{
                    resposta.status(400).json({
                        "status":false,
                        "mensagem":"Por favor informe o nome do Item da Compra !"
                    });
                }
            }
        } 
        catch(error){
            console.error("Erro ao consultar o Item da Compra", error);
            throw error;
        }
        finally{conexao.release();}
    }   
}