import {Router} from 'express';
import UsuarioCTRL from '../controle/usuarioCTRL.js';

const rotaUsuario = new Router();
const controleUsuario = new UsuarioCTRL();
rotaUsuario
.post("/consulta", controleUsuario.consultar)
.post("/", controleUsuario.gravar)
.put("/", controleUsuario.alterar)
.patch("/", controleUsuario.alterar)
.delete("/", controleUsuario.excluir);

export default rotaUsuario;