import {Router} from 'express';
import CategoriaSubGrupoCTRL from '../controle/categoriaSubGrupoCTRL.js';

const rotaCategoriaSubGrupo = new Router();
const controleCategoriaSubGrupo = new CategoriaSubGrupoCTRL();
rotaCategoriaSubGrupo
.post("/consulta", controleCategoriaSubGrupo.consultar)
.post("/", controleCategoriaSubGrupo.gravar)
.put("/", controleCategoriaSubGrupo.alterar)
.patch("/", controleCategoriaSubGrupo.alterar)
.delete("/", controleCategoriaSubGrupo.excluir);

export default rotaCategoriaSubGrupo;