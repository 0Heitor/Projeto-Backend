import {Router} from 'express';
import UsuarioCTRL from '../controle/usuarioCTRL.js';

const rotaUsuario = new Router();
const controleUsuario = new UsuarioCTRL();
rotaUsuario
.post("/consulta", controleUsuario.consultar)
.post("/consultaEmail", controleUsuario.consultarEmail)
.post("/recuperar-senha", controleUsuario.recuperarSenha)
.post("/validar-codigo-recuperacao", controleUsuario.validarCodigoRecuperacao)
.post("/", controleUsuario.gravar)
.put("/", controleUsuario.alterar)
.patch("/", controleUsuario.alterar)
.delete("/", controleUsuario.excluir);

export default rotaUsuario;