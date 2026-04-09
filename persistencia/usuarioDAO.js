import Usuario from '../modelo/usuario.js';

export default class UsuarioDAO{

    async gravar(usuario, conexao){
        if(usuario instanceof Usuario){
            const sql = "INSERT INTO usuarios (usu_nome, usu_email, usu_senha, usu_nivel, usu_ativo, usu_ultimo_login) VALUES ($1, $2, $3, $4, $5, $6) RETURNING usu_id";
            const parametros = [usuario.nome, usuario.email, usuario.senha, usuario.nivel, usuario.ativo, usuario.ultimo_login];
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
            const usuario = new Usuario(registro.usu_id, registro.usu_nome, registro.usu_email, registro.usu_senha, registro.usu_nivel, registro.usu_ativo, registro.usu_ultimo_login, registro.usu_criado_em);
            listaUsuarios.push(usuario);
        }
        return{
            lista: listaUsuarios,
            total: totalRegistros
        };
    }
}

/*

import Usuario from '../modelo/usuario.js';
import conectar from "./conexao.js";

export default class UsuarioDAO{

    async gravar(usuario, conexao){
        if(usuario instanceof Usuario){
            //const conexao = await conectar();
            try{
                //, usu_ultimo_login, usu_criado_em
                const sql = "INSERT INTO usuarios (usu_nome, usu_email, usu_senha, usu_nivel, usu_ativo, usu_ultimo_login) VALUES ($1, $2, $3, $4, $5, $6) RETURNING usu_id";
                const parametros = [usuario.nome, usuario.email, usuario.senha, usuario.nivel, usuario.ativo, usuario.ultimo_login];//, usuario.criado];
                const retorno = await conexao.query(sql, parametros);
                usuario.id = retorno.rows[0].usu_id;
            } 
            catch(erro){
                console.error("Erro ao gravar usuario:", erro);
                throw erro;
            }
            finally{
                conexao.release();
            }
        }
    }

    async atualizar(usuario, conexao){
        if(usuario instanceof Usuario){
            //const conexao = await conectar();
            try{
                //usu_criado_em = $7
                const sql = "UPDATE usuarios SET usu_nome = $1, usu_email = $2, usu_senha = $3, usu_nivel = $4, usu_ativo = $5, usu_ultimo_login = $6 WHERE usu_id = $7";
                const parametros = [usuario.nome, usuario.email, usuario.senha, usuario.nivel, usuario.ativo, usuario.ultimo_login, usuario.id];//, usuario.criado

                await conexao.query(sql, parametros);
            } 
            catch(erro){
                console.error("Erro ao atualizar usuário:", erro);
                throw erro;
            } 
            finally{
                conexao.release();
            }
        }
    }

    async excluir(usuario, conexao){
        if(usuario instanceof Usuario){
            //const conexao = await conectar();
            try{
                const sql = "DELETE FROM usuarios WHERE usu_id = $1";
                const parametros = [usuario.id];
                
                await conexao.query(sql, parametros);
            } 
            catch(erro){
                console.error("Erro ao excluir usuário:", erro);
                throw erro;
            } 
            finally{
                conexao.release();
            }
        }
    }

    async consultar(filtro, conexao){
        let sql="SELECT *, COUNT(*) OVER() as total_geral FROM usuarios WHERE 1=1";
        let parametros=[];
        let i=1;

        if(filtro.id && filtro.id !== ''){
            sql += ` AND usu_id = $${i}`;
            parametros.push(filtro.id);
            i++;
        }
        if(filtro.nome && filtro.nome !== ''){
            sql += ` AND usu_nome LIKE $${i}`;
            parametros.push(`%${filtro.nome}%`);
            i++;
        }
        if(filtro.email && filtro.email !== ''){
            if(filtro.consulta && filtro.consulta == "equal"){
                sql += ` AND usu_email = $${i}`;
                parametros.push(filtro.email);
            }
            else{
                sql += ` AND usu_email LIKE $${i}`;
                parametros.push(`%${filtro.email}%`);
            }
            i++;
        }
        if(filtro.senha && filtro.senha !== ''){
            sql += ` AND usu_senha = $${i}`;
            parametros.push(`%${filtro.senha}%`);
            i++;
        }
        if(filtro.nivel && filtro.nivel !== ''){
            sql += ` AND usu_nivel LIKE $${i}`;
            parametros.push(`%${filtro.nivel}%`);
            i++;
        }
        if(filtro.ativo !== undefined && filtro.ativo != ''){
            sql += ` AND usu_ativo = $${i}`;
            parametros.push(filtro.ativo);
            i++;
        }
        if(filtro.ultimo_login){
            sql += ` AND usu_ultimo_login >= $${i}`;
            parametros.push(filtro.ultimo_login);
            i++;
        }
        if(filtro.criado){
            sql += ` AND usu_criado_em::date = $${i}`;
            parametros.push(filtro.criado);
            i++;
        }
        sql += " ORDER BY usu_nome ASC";
        sql += ` LIMIT $${i} OFFSET $${i + 1}`;

        parametros.push(parseInt(filtro.limit));
        parametros.push(parseInt(filtro.offset));

        //const conexao = await conectar();
        let listaUsuarios = [];
        let totalRegistros = 0;
        try{
            const resultado = await conexao.query(sql, parametros);
            const registros = resultado.rows;
            totalRegistros = registros.length > 0 ? parseInt(registros[0].total_geral) : 0;
            for(const registro of registros){
                const usuario = new Usuario(registro.usu_id, registro.usu_nome, registro.usu_email, registro.usu_senha, registro.usu_nivel, registro.usu_ativo, registro.usu_ultimo_login, registro.usu_criado_em);
                listaUsuarios.push(usuario);
            }
        } 
        catch(erro) {
            console.error("Erro na consulta:", erro);
            throw erro;
        }
        finally{
            conexao.release();
        }
        return{
            lista: listaUsuarios,
            total: totalRegistros
        };
    }
}


*/