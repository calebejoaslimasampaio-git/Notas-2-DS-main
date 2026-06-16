const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir o envio de JSON nas requisições, liberando o B.D a aceitar as requisições de qualquer site
app.use(express.json());
app.use(cors());

// -------------------------------------------------------------------------
// Configuração e Conexão do Banco de Dados
// -------------------------------------------------------------------------
// Cria ou abre o arquivo 'database.sqlite' na raiz do projeto
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado com sucesso ao banco de dados SQLite.');
        inicializarBanco();
    }
});

// Função para criar as tabelas iniciais, se não existirem
function inicializarBanco() {
    const alunos = `
        CREATE TABLE IF NOT EXISTS alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            matricula TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            serie TEXT NOT NULL,
            turma TEXT NOT NULL,
            senha text
        )
    `;
    db.run(alunos, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err.message);
        } else {
            console.log('Tabela "alunos" verificada/criada com sucesso.');
        }
    });
    const notas =   `
        CREATE TABLE IF NOT EXISTS notas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluno_matricula TEXT NOT NULL,
            materia TEXT NOT NULL,
            bimestre INTERGER NOT NULL,
            nota_parcial REAL DEFAULT 0,
            nota_bimestral REAL DEFAULT 0,
            nota_qualitativa REAL DEFAULT 0,
            FOREIGN KEY (aluno_matricula) REFERENCES alunos(matricula)
        )
    `;
    
    db.run(notas, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err.message);
        } else {
            console.log('Tabela "notas" verificada/criada com sucesso.');
        }
    });
}

// -------------------------------------------------------------------------
// Rotas da API (CRUD Exemplo)
// -------------------------------------------------------------------------

// 1. Criar Usuário (POST)
app.post('/alunos', (req, res) => {
    const { nome, matricula, email, serie, senha } = req.body;
    
    if (!nome || !matricula || !email || !serie || !senha) {
        return res.status(400).json({ error: 'Todos os campos Nome, matricula, email, série e senha são obrigatórios.' });
    }

    const query = `INSERT INTO alunos (nome, matricula, email, serie, senha) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [nome, matricula, email, serie, senha], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            nome,
            matricula,
            email,
            serie,
            senha
        });
    });
});

// 2. Listar Todos os alunos (GET)
app.get('/alunos', (req, res) => {
    const query = `SELECT * FROM alunos`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 3. Buscar aluno por ID (GET)
app.get('/alunos/:id', (req, res) => {
    const query = `SELECT * FROM alunos WHERE id = ?`;
    
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }
        res.json(row);
    });
});

// 4. Deletar Aluno (DELETE)
app.delete('/alunos/:id', (req, res) => {
    const query = `DELETE FROM alunos WHERE id = ?`;
    
    db.run(query, [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }
        res.json({ message: 'Aluno deletado com sucesso.', rowsAffected: this.changes });
    });
});

// 5. Atualizar Aluno (PATCH)
app.patch('/alunos/:id', (req, res) => {
    const { email, senha } = req.body;

    if (!email && !senha) {
        return res.status(400).json({ error: 'Informe pelo menos email ou senha para atualizar.' });
    }

    const updates = [];
    const values = [];

    if (email) {
        updates.push('email = ?');
        values.push(email);
    }
    if (senha) {
        updates.push('senha = ?');
        values.push(senha);
    }

    values.push(req.params.id);

    const query = `UPDATE alunos SET ${updates.join(', ')} WHERE id = ?`;

    db.run(query, values, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }
        res.json({ message: 'Aluno atualizado com sucesso.', rowsAffected: this.changes });
    });
});

// -------------------------------------------------------------------------
// Inicialização do Servidor
// -------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

// Fechar a conexão do banco de dados quando o app for encerrado
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conexão com o SQLite encerrada.');
        process.exit(0);
    });
});
