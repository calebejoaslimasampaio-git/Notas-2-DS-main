const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir o envio de JSON nas requisições
app.use(express.json());

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
    const query = `
        CREATE TABLE IF NOT EXISTS alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            matricula TEXT UNIQUE NOT NULL,
            escola TEXT NOT NULL,
            serie TEXT NOT NULL
        )
    `;
    
    db.run(query, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err.message);
        } else {
            console.log('Tabela "alunos" verificada/criada com sucesso.');
        }
    });
}

// -------------------------------------------------------------------------
// Rotas da API (CRUD Exemplo)
// -------------------------------------------------------------------------

// 1. Criar Usuário (POST)
app.post('/usuarios', (req, res) => {
    const { nome, matricula, escola, serie } = req.body;
    
    if (!nome || !matricula || !escola || !serie) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
    }

    const query = `INSERT INTO usuarios (nome, matricula, escola, serie) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [nome, email], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            nome,
            matricula,
            escola,
            serie
        });
    });
});

// 2. Listar Todos os Usuários (GET)
app.get('/usuarios', (req, res) => {
    const query = `SELECT * FROM usuarios`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 3. Buscar Usuário por ID (GET)
app.get('/usuarios/:id', (req, res) => {
    const query = `SELECT * FROM usuarios WHERE id = ?`;
    
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json(row);
    });
});

// 4. Deletar Usuário (DELETE)
app.delete('/usuarios/:id', (req, res) => {
    const query = `DELETE FROM usuarios WHERE id = ?`;
    
    db.run(query, [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json({ message: 'Usuário deletado com sucesso.', rowsAffected: this.changes });
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