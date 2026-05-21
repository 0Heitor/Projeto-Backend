import {Router} from 'express';
import ItemCompraCTRL from '../controle/itemCompraCTRL.js';

const rotaItemCompra = new Router();
const controleItemCompra = new ItemCompraCTRL();
rotaItemCompra
.post("/consulta", controleItemCompra.consultar)
//.post("/", controleItemCompra.gravar)
//.put("/", controleItemCompra.alterar)
//.patch("/", controleItemCompra.alterar)
//.delete("/", controleItemCompra.excluir);

export default rotaItemCompra;