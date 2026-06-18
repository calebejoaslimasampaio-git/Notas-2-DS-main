let alunos = [];
API_URL = "http://localhost:3000";

async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/alunos`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        alunos = result;
        console.log(result); // Here is your SQLite data!

    } catch (error) {
        alunos = [];
        console.error('There was a problem with the fetch operation:', error);
    }
}

carregarAluno1();
window.addEventListener('DOMContentLoaded', fetchUsers);

async function carregarAluno1() {
    try {
        let response;

        response = await fetch(`${API_URL}/alunos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: "Aluno 1", matricula: "12345", serie: "1º Ano", turma: "Des. Sistemas" })
        });
    } catch (error) {
        console.error('Erro ao carregar aluno 1:', error);
    }
}

async function cadastro(){
    const nome = document.getElementById('nomeA').value;
    const email = document.getElementById('emailA').value;
    const matricula = document.getElementById('matriculaA').value;
    const senha = document.getElementById('senhaA').value;

    if (!nome || !email || !matricula || !senha) {
        alert('Preencha todos os campos, por favor!');
        return;
    }

    const existingAluno = alunos.find(aluno => aluno.matricula === matricula);

    try {
        let response;

        if (existingAluno) {
            response = await fetch(`${API_URL}/alunos/${existingAluno.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.error || 'Falha ao atualizar o aluno.');
            }

            alert('Aluno existente atualizado com sucesso!');
        } else {
            response = await fetch(`${API_URL}/alunos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email, matricula, senha })
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.error || 'Falha ao cadastrar o aluno.');
            }

            alert('Aluno cadastrado com sucesso!');
        }

        await fetchUsers();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert(error.message);
    }
}

function changeBimestre(bimestre) {
    const current = document.querySelector('.notas-bimestre-current');
    if (current) {
        current.classList.remove('notas-bimestre-current');
        current.classList.add('notas-bimestre');
    }

    const target = document.getElementById(`bim${bimestre}`);
    if (target) {
        target.classList.remove('notas-bimestre');
        target.classList.add('notas-bimestre-current');
    }
}




var dev_trabalhando = true;
function satisfacao() {
    if (dev_trabalhando === true) {
        scrum_master.feliz();
    } else if (dev_trabalhando === false){
        scrum_master.triste()
    };
};
function triste() {
    if (scrum_master.triste() === true) {
        die();
    };
}