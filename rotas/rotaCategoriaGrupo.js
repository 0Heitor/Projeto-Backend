import {Router} from 'express';
import CategoriaGrupoCTRL from '../controle/categoriaGrupoCTRL.js';

const rotaCategoriaGrupo = new Router();
const controleCategoriaGrupo = new CategoriaGrupoCTRL();
rotaCategoriaGrupo
.post("/consulta", controleCategoriaGrupo.consultar)
.post("/", controleCategoriaGrupo.gravar)
.put("/", controleCategoriaGrupo.alterar)
.patch("/", controleCategoriaGrupo.alterar)
.delete("/", controleCategoriaGrupo.excluir);

export default rotaCategoriaGrupo;