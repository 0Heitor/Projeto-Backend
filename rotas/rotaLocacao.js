import {Router} from 'express';
import LocacaoCTRL from '../controle/locacaoCTRL.js';

const rotaLocacao = new Router();
const controleLocacao = new LocacaoCTRL();
rotaLocacao
.post("/consulta", controleLocacao.consultar)
.post("/", controleLocacao.gravar)
.put("/", controleLocacao.alterar)
.patch("/", controleLocacao.alterar)
.delete("/", controleLocacao.excluir);

export default rotaLocacao;