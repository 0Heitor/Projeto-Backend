import {Router} from 'express';
import VendaCTRL from '../controle/vendaCTRL.js';

const rotaVenda = new Router();
const controleVenda = new VendaCTRL();
rotaVenda
.post("/consulta", controleVenda.consultar)
.post("/", controleVenda.gravar)
.put("/", controleVenda.alterar)
.patch("/", controleVenda.alterar)
.delete("/", controleVenda.excluir);

export default rotaVenda;