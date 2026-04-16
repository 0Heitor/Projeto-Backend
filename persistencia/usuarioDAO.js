import Usuario from '../modelo/usuario.js';

export default class UsuarioDAO{

    async gravar(usuario, conexao){
        if(usuario instanceof Usuario){
            const sql = "INSERT INTO usuarios (usu_nome, usu_email, usu_senha, usu_nivel, usu_ativo) VALUES ($1, $2, $3, $4, $5) RETURNING usu_id";
            const parametros = [usuario.nome, usuario.email, usuario.senha, usuario.nivel, usuario.ativo];
            const retorno = await conexao.query(sql, parametros);
            usuario.id = retorno.rows[0].usu_id;
        }
    }

    async atualizar(usuario, conexao){
        if(usuario instanceof Usuario){
            const sql = "UPDATE usuarios SET usu_nome = $1, usu_email = $2, usu_senha = $3, usu_nivel = $4, usu_ativo = $5, usu_ultimo_login = $6 WHERE usu_id = $7";
            const parametros = [usuario.nome, usuario.email, usuario.senha, usuario.nivel, usuario.ativo, usuario.ultimo_login, usuario.id];
            await conexao.query(sql, parametros);
        }
    }

    async atualizarCodigoRecuperacao(usuario, conexao){
        if(usuario instanceof Usuario){
            const sql = "UPDATE usuarios SET usu_codigo_recuperacao = $1, usu_codigo_recuperacao_validade = $2, usu_tentativas_recuperacao = $3 WHERE usu_email = $4";
            const parametros = [usuario.codigo_recuperacao, usuario.codigo_recuperacao_validade, usuario.tentativas_recuperacao, usuario.email];
            await conexao.query(sql, parametros);
        }
    }

    async atualizarLogin(usuario, conexao){
        if(usuario instanceof Usuario){
            const sql = "UPDATE usuarios SET usu_ultimo_login = $1 WHERE usu_email = $2";
            const parametros = [usuario.ultimo_login, usuario.email];
            await conexao.query(sql, parametros);
        }
    }

    async atualizarSenha(usuario, conexao){
        if(usuario instanceof Usuario){
            const sql = "UPDATE usuarios SET usu_senha = $1 WHERE usu_email = $2";
            const parametros = [usuario.senha, usuario.email];
            await conexao.query(sql, parametros);
        }
    }

    async excluir(usuario, conexao){
        if(usuario instanceof Usuario){
            const sql = "DELETE FROM usuarios WHERE usu_id = $1";
            const parametros = [usuario.id];
            await conexao.query(sql, parametros);
        }
    }

    async consultar(usuario, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM usuarios WHERE 1=1";
        let parametros=[];
        let listaUsuarios = [];
        let totalRegistros = 0;
        let i=1;

        if(usuario.id && usuario.id !== ''){
            sql += ` AND usu_id = $${i}`;
            parametros.push(usuario.id);
            i++;
        }
        if(usuario.nome && usuario.nome !== ''){
            sql += ` AND usu_nome LIKE $${i}`;
            parametros.push(`%${usuario.nome}%`);
            i++;
        }
        if(usuario.email && usuario.email !== ''){
            if(filtro.consulta && filtro.consulta == "equal"){
                sql += ` AND usu_email = $${i}`;
                parametros.push(usuario.email);
            }
            else{
                sql += ` AND usu_email LIKE $${i}`;
                parametros.push(`%${usuario.email}%`);
            }
            i++;
        }
        if(usuario.senha && usuario.senha !== ''){
            sql += ` AND usu_senha = $${i}`;
            parametros.push(`%${usuario.senha}%`);
            i++;
        }
        if(usuario.nivel && usuario.nivel !== ''){
            sql += ` AND usu_nivel LIKE $${i}`;
            parametros.push(`%${usuario.nivel}%`);
            i++;
        }
        if(usuario.ativo !== undefined && usuario.ativo != ''){
            sql += ` AND usu_ativo = $${i}`;
            parametros.push(usuario.ativo);
            i++;
        }
        if(usuario.ultimo_login && usuario.ultimo_login != ""){
            sql += ` AND usu_ultimo_login >= $${i}`;
            parametros.push(filtro.ultimo_login);
            i++;
        }
        if(usuario.criado && usuario.criado != ""){
            sql += ` AND usu_criado_em::date = $${i}`;
            parametros.push(filtro.criado);
            i++;
        }
        sql += " ORDER BY usu_nome ASC";
        if(filtro.limit && filtro.limit != ""){
            sql += ` LIMIT $${i}`;
            parametros.push(parseInt(filtro.limit));
            i++;
        }
        if(filtro.offset && filtro.offset != ""){
            sql += ` OFFSET $${i}`
            parametros.push(parseInt(filtro.offset));
        }

        const resultado = await conexao.query(sql, parametros);
        const registros = resultado.rows;
        totalRegistros = registros.length > 0 ? parseInt(registros[0].total_geral) : 0;
        for(const registro of registros){
            const usuario = new Usuario(registro.usu_id, registro.usu_nome, registro.usu_email, registro.usu_senha, registro.usu_nivel, registro.usu_ativo, registro.usu_ultimo_login, registro.usu_criado_em, "", "", 0);
            listaUsuarios.push(usuario);
        }
        return{
            lista: listaUsuarios,
            total: totalRegistros
        };
    }

    async consultarEmail(usuario, filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM usuarios WHERE 1=1";
        let parametros=[];
        let listaUsuarios = [];
        let totalRegistros = 0;
        let i=1;

        if(usuario.email && usuario.email !== ''){
            sql += ` AND usu_email = $${i}`;
            parametros.push(usuario.email);
            i++;
        }
        if(usuario.senha && usuario.senha !== ''){
            sql += ` AND usu_senha = $${i}`;
            parametros.push(usuario.senha);
            i++;
        }
        sql += " AND usu_ativo = true";
        sql += " ORDER BY usu_nome ASC";

        const resultado = await conexao.query(sql, parametros);
        const registros = resultado.rows;
        totalRegistros = registros.length > 0 ? parseInt(registros[0].total_geral) : 0;
        for(const registro of registros){
            const usuario = new Usuario(registro.usu_id, registro.usu_nome, registro.usu_email, registro.usu_senha, registro.usu_nivel, registro.usu_ativo, registro.usu_ultimo_login, registro.usu_criado_em, "", "", 0);
            listaUsuarios.push(usuario);
        }
        return{
            lista: listaUsuarios,
            total: totalRegistros,
            encontrado: totalRegistros == 1 
        };
    }

    async validarCodigoRecuperacao(usuario, conexao){
        const sql = "SELECT * FROM usuarios WHERE usu_email = $1";
        const resultado = await conexao.query(sql, [usuario.email]);
        
        if (resultado.rows.length === 0) {
            return { encontrado: false, motivo: "usuario_nao_encontrado" };
        }

        const registro = resultado.rows[0];
        const userDB = new Usuario(
            registro.usu_id, registro.usu_nome, registro.usu_email, 
            registro.usu_senha, registro.usu_nivel, registro.usu_ativo, 
            registro.usu_ultimo_login, registro.usu_criado_em, 
            registro.usu_codigo_recuperacao, registro.usu_codigo_recuperacao_validade, 
            registro.usu_tentativas_recuperacao
        );

        const agora = new Date();
        const validade = new Date(userDB.codigo_recuperacao_validade);

        // Verificações lógicas
        const tentativasEsgotadas = userDB.tentativas_recuperacao < 0;
        const codigoIncorreto = userDB.codigo_recuperacao !== usuario.codigo_recuperacao;
        const expirado = validade < agora;

        return {
            encontrado: !codigoIncorreto && !expirado && !tentativasEsgotadas,
            usuarioInstancia: userDB,
            motivo: tentativasEsgotadas ? "tentativas_esgotadas" : 
                    expirado ? "expirado" : 
                    codigoIncorreto ? "codigo_errado" : null
        };
        
        /*let sql="SELECT *, COUNT(*) OVER() as total_geral FROM usuarios WHERE 1=1";
        let parametros=[];
        let listaUsuarios = [];
        let totalRegistros = 0;
        let i=1;

        if(usuario.email && usuario.email !== ''){
            sql += ` AND usu_email = $${i}`;
            parametros.push(usuario.email);
            i++;
        }
        if(usuario.codigo_recuperacao && usuario.codigo_recuperacao !== ''){
            sql += ` AND usu_codigo_recuperacao = $${i}`;
            parametros.push(usuario.codigo_recuperacao);
            i++;
        }
        sql += " AND usu_codigo_recuperacao_validade >= NOW()";
        sql += " AND usu_tentativas_recuperacao > 0";
        sql += " ORDER BY usu_nome ASC";

        const resultado = await conexao.query(sql, parametros);
        const registros = resultado.rows;
        totalRegistros = registros.length > 0 ? parseInt(registros[0].total_geral) : 0;
        for(const registro of registros){
            const usuario = new Usuario(registro.usu_id, registro.usu_nome, registro.usu_email, registro.usu_senha, registro.usu_nivel, registro.usu_ativo, registro.usu_ultimo_login, registro.usu_criado_em, registro.usu_codigo_recuperacao, registro.usu_codigo_recuperacao_validade, registro.usu_tentativas_recuperacao);
            listaUsuarios.push(usuario);
        }
        return{
            lista: listaUsuarios,
            total: totalRegistros,
            encontrado: totalRegistros == 1,
            expirado: totalRegistros == 1 ? listaUsuarios[0].codigo_recuperacao_validade < new Date() : false,
        };*/
    }
}