const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir o envio de JSON nas requisições e liberar o CORS
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// -------------------------------------------------------------------------
// Configuração e Conexão do Banco de Dados
// -------------------------------------------------------------------------
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
    const queryAlunos = `
        CREATE TABLE IF NOT EXISTS alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            matricula TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            serie TEXT NOT NULL,
            turma TEXT NOT NULL,
            senha TEXT
        )
    `;

    const queryNotas = `
        CREATE TABLE IF NOT EXISTS notas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluno_matricula TEXT NOT NULL,
            materia TEXT NOT NULL,
            bimestre INTEGER NOT NULL,
            nota_parcial REAL DEFAULT 0,
            nota_bimestral REAL DEFAULT 0,
            nota_qualitativa REAL DEFAULT 0,
            FOREIGN KEY (aluno_matricula) REFERENCES alunos(matricula)
        )
    `;

    db.run(queryAlunos, (err) => {
        if (err) {
            console.error('Erro ao criar tabela alunos:', err.message);
        } else {
            console.log('Tabela "alunos" verificada/criada com sucesso.');
            
            db.run(queryNotas, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela notas:', err.message);
                } else {
                    console.log('Tabela "notas" verificada/criada com sucesso.');
                    alimentarDadosDosDevs();
                }
            });
        }
    });
}

function alimentarDadosDosDevs() {
    const sqlAlunos = `INSERT OR IGNORE INTO alunos (matricula, nome, serie, turma) VALUES (?, ?, ?, ?)`;
    
    db.run(sqlAlunos, ['3782655', 'ADRIEL ALVES DA SILVA', '2º', 'A']);
    db.run(sqlAlunos, ['3722975', 'ADRYAN MARIANO DOS SANTOS', '2º', 'A']);
    db.run(sqlAlunos, ['5165690', 'ALANA SARA COSTA SILVA', '2º', 'A']);
    db.run(sqlAlunos, ['3761480', 'ALEJANDRO RAYNAN DE LIMA SILVA', '2º', 'A']);
    db.run(sqlAlunos, ['3523576', 'ALESSANDRA LIMA DOS SANTOS', '2º', 'A']);
    db.run(sqlAlunos, ['3749299', 'ANNA ESTHER LIMA DE SOUZA', '2º', 'A']);
    db.run(sqlAlunos, ['3739233', 'CALEBE JOAS LIMA SAMPAIO', '2º', 'A']);
    db.run(sqlAlunos, ['5311318', 'DEBORA VIANA DE QUEIROZ', '2º', 'A']);
    db.run(sqlAlunos, ['5164361', 'ELLEN NOGUEIRA LIMA', '2º', 'A']);
    db.run(sqlAlunos, ['5130871', 'EMILY MARIA OLIVEIRA SILVA', '2º', 'A']);
    db.run(sqlAlunos, ['4915098', 'ENZO ADRIEL GOMES DA SILVA', '2º', 'A']);
    db.run(sqlAlunos, ['4695967', 'EVELINE AMBROSIO SOUZA', '2º', 'A']);
    db.run(sqlAlunos, ['3554613', 'EVELYN ARAUJO BEZERRA', '2º', 'A']);
    db.run(sqlAlunos, ['3812062', 'FABRICIO GOMES PEREIRA', '2º', 'A']);
    db.run(sqlAlunos, ['5416950', 'FELIPE MORAIS DE FREITAS', '2º', 'A']);
    db.run(sqlAlunos, ['5418347', 'FILIPE GABRIEL DIAS RODRIGUES', '2º', 'A']);
    db.run(sqlAlunos, ['4711308', 'GUSTAVO DOS SANTOS LIMA', '2º', 'A']);
    db.run(sqlAlunos, ['4709416', 'IAGO GIOVANNI OLIVEIRA SANTOS', '2º', 'A']);
    db.run(sqlAlunos, ['4547993', 'IOHANNA JULIA DA SILVA NOGUEIRA', '2º', 'A']);
    db.run(sqlAlunos, ['5411389', 'ISAAC GOYANA BARRETO', '2º', 'A']);

   
    const sqlNotas = `INSERT INTO notas (aluno_matricula, materia, bimestre, nota_parcial, nota_bimestral, nota_qualitativa) 
                      SELECT ?, ?, ?, ?, ?, ? WHERE NOT EXISTS 
                      (SELECT 1 FROM notas WHERE aluno_matricula = ? AND materia = ? AND bimestre = ?)`;
    
    // Função auxiliar para inserir notas sem duplicar ao reiniciar o servidor
    function cadastrarNota(matr, mat, bim, p, b, q) {
        db.run(sqlNotas, [matr, mat, bim, p, b, q, matr, mat, bim]);
    }

    // Notas - Adryan Mariano (Bimestre 1)
    cadastrarNota('3722975', 'Matemática', 1, 7.5, 8.0, 2.0);
    cadastrarNota('3722975', 'História', 1, 9.0, 7.0, 1.5);
    cadastrarNota('3722975', 'Geografia', 1, 5.0, 6.5, 1.0);
    cadastrarNota('3722975', 'Sociologia', 1, 7.5, 8.0, 2.0);
    cadastrarNota('3722975', 'Biologia', 1, 9.0, 7.0, 1.5);
    cadastrarNota('3722975', 'Progamação Web', 1, 5.0, 6.5, 1.0);

    // Notas - Adryan Mariano (Bimestre 2)
    cadastrarNota('3722975', 'Matemática', 2, 7.5, 8.0, 2.0);
    cadastrarNota('3722975', 'História', 2, 9.0, 7.0, 1.5);
    cadastrarNota('3722975', 'Geografia', 2, 5.0, 6.5, 1.0);
    cadastrarNota('3722975', 'Sociologia', 2, 7.5, 8.0, 2.0);
    cadastrarNota('3722975', 'Biologia', 2, 9.0, 7.0, 1.5);
    cadastrarNota('3722975', 'Progamação Web', 2, 5.0, 6.5, 1.0);

    // Notas - Adryan Mariano (Bimestre 3)
    cadastrarNota('3722975', 'Matemática', 3, 7.5, 8.0, 2.0);
    cadastrarNota('3722975', 'História', 3, 9.0, 7.0, 1.5);
    cadastrarNota('3722975', 'Geografia', 3, 5.0, 6.5, 1.0);
    cadastrarNota('3722975', 'Sociologia', 3, 7.5, 8.0, 2.0);
    cadastrarNota('3722975', 'Biologia', 3, 9.0, 7.0, 1.5);
    cadastrarNota('3722975', 'Progamação Web', 3, 5.0, 6.5, 1.0);

    // Notas - Adryan Mariano (Bimestre 4)
    cadastrarNota('3722975', 'Matemática', 4, 7.5, 8.0, 2.0);
    cadastrarNota('3722975', 'História', 4, 9.0, 7.0, 1.5);
    cadastrarNota('3722975', 'Geografia', 4, 5.0, 6.5, 1.0);
    cadastrarNota('3722975', 'Sociologia', 4, 7.5, 8.0, 2.0);
    cadastrarNota('3722975', 'Biologia', 4, 9.0, 7.0, 1.5);
    cadastrarNota('3722975', 'Progamação Web', 4, 5.0, 6.5, 1.0);

    console.log('Banco de dados alimentado manualmente pelos Devs.');
}

// -------------------------------------------------------------------------
// Rotas da API (Fluxo do Aluno no Site)
// -------------------------------------------------------------------------

app.post('/api/cadastro', (req, res) => {
    const { matricula, nome, email, serie, turma, senha } = req.body;

    if (!matricula || !nome || !email || !serie || !turma || !senha) {
        return res.status(400).json({ error: 'Todos os campos (Matrícula, Nome, Email, Série, Turma e Senha) são obrigatórios.' });
    }

    db.get('SELECT * FROM alunos WHERE matricula = ?', [matricula], (err, aluno) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!aluno) return res.status(400).json({ error: 'Matrícula não encontrada no sistema escolar.' });
        
        if (aluno.nome.toLowerCase() !== nome.toLowerCase()) {
            return res.status(400).json({ error: 'O nome informado não coincide com o desta matrícula.' });
        }

        if (aluno.senha) return res.status(400).json({ error: 'Este aluno já possui uma conta ativa.' });

        const sqlUpdate = `UPDATE alunos SET email = ?, serie = ?, turma = ?, senha = ? WHERE matricula = ?`;
        db.run(sqlUpdate, [email, serie, turma, senha, matricula], (err) => {
            if (err) return res.status(400).json({ error: 'Erro ao salvar: E-mail já cadastrado por outro usuário.' });
            res.json({ message: 'Conta criada com sucesso! Prossiga para o Login.' });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { identificador, senha } = req.body;

    if (!identificador || !senha) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const sqlLogin = `SELECT * FROM alunos WHERE (matricula = ? OR email = ?) AND senha = ?`;
    
    db.get(sqlLogin, [identificador, identificador, senha], (err, aluno) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!aluno) return res.status(401).json({ error: 'Credenciais incorretas ou conta ainda não cadastrada.' });

        const sqlNotas = `SELECT materia, bimestre, nota_parcial, nota_bimestral, nota_qualitativa FROM notas WHERE aluno_matricula = ?`;
        
        db.all(sqlNotas, [aluno.matricula], (err, notas) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: 'Login realizado com sucesso!',
                aluno: {
                    nome: aluno.nome,
                    matricula: aluno.matricula,
                    serie: aluno.serie,
                    turma: aluno.turma,
                    boletim: notas 
                }
            });
        });
    });
});

// -------------------------------------------------------------------------
// Inicialização do Servidor
// -------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conexão com o SQLite encerrada.');
        process.exit(0);
    });
});
