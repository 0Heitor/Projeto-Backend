import {Router} from 'express';
import CompraCTRL from '../controle/compraCTRL.js';

const rotaCompra = new Router();
const controleCompra = new CompraCTRL();
rotaCompra
.post("/consulta", controleCompra.consultar)
.post("/", controleCompra.gravar)
.put("/", controleCompra.alterar)
.patch("/", controleCompra.alterar)
.delete("/", controleCompra.excluir);

export default rotaCompra;