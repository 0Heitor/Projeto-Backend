import {Router} from 'express';
import ContaReceberCTRL from '../controle/contaReceberCTRL.js';

const rotaContaReceber = new Router();
const controleContaReceber = new ContaReceberCTRL();
rotaContaReceber
.post("/consulta", controleContaReceber.consultar)
//.post("/", controleContaReceber.gravar)
.put("/", controleContaReceber.alterar)
.patch("/", controleContaReceber.alterar)
//.delete("/", controleContaReceber.excluir);

export default rotaContaReceber;