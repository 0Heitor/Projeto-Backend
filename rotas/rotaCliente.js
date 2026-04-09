import {Router} from 'express';
import ClienteCTRL from '../controle/clienteCTRL.js';

const rotaCliente = new Router();
const controleCliente = new ClienteCTRL();
rotaCliente
.post("/consulta", controleCliente.consultar)
.post("/", controleCliente.gravar)
.put("/", controleCliente.alterar)
.patch("/", controleCliente.alterar)
.delete("/", controleCliente.excluir);

export default rotaCliente;