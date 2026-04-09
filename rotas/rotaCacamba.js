import {Router} from 'express';
import CacambaCTRL from '../controle/cacambaCTRL.js';

const rotaCacamba = new Router();
const controleCacamba = new CacambaCTRL();
rotaCacamba
.post("/consulta", controleCacamba.consultar)
.post("/", controleCacamba.gravar)
.put("/", controleCacamba.alterar)
.patch("/", controleCacamba.alterar)
.delete("/", controleCacamba.excluir);

export default rotaCacamba;