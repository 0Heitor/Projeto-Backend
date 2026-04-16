import {Router} from 'express';
import TipoCacambaCTRL from '../controle/tipoCacambaCTRL.js';

const rotaTipoCacamba = new Router();
const controleTipoCacamba = new TipoCacambaCTRL();
rotaTipoCacamba
.post("/consulta", controleTipoCacamba.consultar)
.post("/", controleTipoCacamba.gravar)
.put("/", controleTipoCacamba.alterar)
.patch("/", controleTipoCacamba.alterar)
.delete("/", controleTipoCacamba.excluir);

export default rotaTipoCacamba;