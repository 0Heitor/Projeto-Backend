import {Router} from 'express';
import ProdutoCTRL from '../controle/produtoCTRL.js';

const rotaProduto = new Router();
const controleProduto = new ProdutoCTRL();
rotaProduto
.post("/consulta", controleProduto.consultar)
.post("/", controleProduto.gravar)
.put("/", controleProduto.alterar)
.patch("/", controleProduto.alterar)
.delete("/", controleProduto.excluir);

export default rotaProduto;