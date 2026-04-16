import cors from 'cors';
import express from "express";
import ViteExpress from "vite-express";
import rotaUsuario from "./rotas/rotaUsuario.js"
import rotaCliente from "./rotas/rotaCliente.js"
import rotaFornecedor from "./rotas/rotaFornecedor.js"
import rotaCacamba from "./rotas/rotaCacamba.js"
import rotaTipoCacamba from "./rotas/rotaTipoCacamba.js"
/*import rotaProduto from "./rotas/rotaProduto.js"
import rotaCategoriaGrupo from "./rotas/rotaCategoriaGrupo.js"
import rotaCategoriaSubGrupo from "./rotas/rotaCategoriaSubGrupo.js"
*/

const host = process.env.HOST;
const porta = process.env.PORT;// || 3000;

const app = express();

app.use(cors({
    origin:'*'
}));

app.use(express.json());
app.use("/api/usuarios", rotaUsuario);
app.use("/api/clientes", rotaCliente);
app.use("/api/fornecedores", rotaFornecedor);
app.use("/api/cacambas", rotaCacamba);
app.use("/api/cacambas/tipos", rotaTipoCacamba);
//app.use("/api/produtos", rotaProduto);
//app.use("/api/categorias/grupo", rotaCategoriaGrupo);
//app.use("/api/categorias/subgrupo", rotaCategoriaSubGrupo);

//const servidorHTTP = ViteExpress.listen(app, process.env.PORT, () => {});
app.listen(porta, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${porta}`);
});