// ==========================================
// VISUALIZAR COLABORADOR
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    carregarColaborador();
});

const colaboradores = [
    {
        id: 1,
        nome: "Andressa de Sales Fernandes",
        cpf: "123.456.789-10",
        nascimento: "12/05/1995",
        sexo: "Feminino",
        cargoFuncao: "Psicólogo",
        registroClasse: "CRP 06/123456",
        especialidade: "Psicologia Clínica",
        admissao: "10/01/2024",
        supervisorResponsavel: "-",
        email: "andressa@psisaude.com",
        telefone: "(11) 99999-1111",
        cep: "17900-000",
        endereco: "Rua das Acácias, 100",
        bairro: "Centro",
        cidade: "Dracena/SP",
        usuario: "andressa.sales",
        perfil: "Administrador(a)",
        status: "Ativo",
        ultimoAcesso: "09/06/2026 às 20:10",
        observacoes: "Profissional responsável por atendimentos psicológicos e supervisão de alunos."
    },
    {
        id: 2,
        nome: "Mariana Oliveira",
        cpf: "222.333.444-55",
        nascimento: "18/02/1988",
        sexo: "Feminino",
        cargoFuncao: "Gerente da unidade",
        registroClasse: "-",
        especialidade: "Gestão da Unidade",
        admissao: "01/03/2024",
        supervisorResponsavel: "-",
        email: "mariana.oliveira@psisaude.com",
        telefone: "(11) 99999-2222",
        cep: "17900-000",
        endereco: "Rua das Palmeiras, 245",
        bairro: "Centro",
        cidade: "Dracena/SP",
        usuario: "mariana.oliveira",
        perfil: "Administrador(a)",
        status: "Ativo",
        ultimoAcesso: "09/06/2026 às 19:45",
        observacoes: "Gerente responsável pela organização administrativa da unidade."
    },
    {
        id: 3,
        nome: "Carlos Henrique",
        cpf: "333.444.555-66",
        nascimento: "22/09/1985",
        sexo: "Masculino",
        cargoFuncao: "Médico",
        registroClasse: "CRM 123456",
        especialidade: "Psiquiatria",
        admissao: "15/04/2024",
        supervisorResponsavel: "Mariana Oliveira",
        email: "carlos.henrique@psisaude.com",
        telefone: "(11) 99999-3333",
        cep: "17900-000",
        endereco: "Rua São Paulo, 300",
        bairro: "Centro",
        cidade: "Dracena/SP",
        usuario: "carlos.henrique",
        perfil: "Profissional",
        status: "Ativo",
        ultimoAcesso: "09/06/2026 às 18:20",
        observacoes: "Médico vinculado à equipe de saúde mental."
    },
    {
        id: 4,
        nome: "Fernanda Souza",
        cpf: "444.555.666-77",
        nascimento: "30/11/1990",
        sexo: "Feminino",
        cargoFuncao: "Enfermeiro",
        registroClasse: "COREN 987654",
        especialidade: "Enfermagem em Saúde Mental",
        admissao: "20/05/2024",
        supervisorResponsavel: "Mariana Oliveira",
        email: "fernanda.souza@psisaude.com",
        telefone: "(11) 99999-4444",
        cep: "17900-000",
        endereco: "Rua Brasil, 400",
        bairro: "Jardim América",
        cidade: "Dracena/SP",
        usuario: "fernanda.souza",
        perfil: "Profissional",
        status: "Ativo",
        ultimoAcesso: "09/06/2026 às 17:30",
        observacoes: "Enfermeira responsável pelo apoio assistencial da equipe."
    },
    {
        id: 5,
        nome: "Lucas Martins",
        cpf: "555.666.777-88",
        nascimento: "08/07/1998",
        sexo: "Masculino",
        cargoFuncao: "Técnico de psicologia",
        registroClasse: "RTP 445566",
        especialidade: "Apoio em Psicologia",
        admissao: "05/06/2024",
        supervisorResponsavel: "Andressa de Sales Fernandes",
        email: "lucas.martins@psisaude.com",
        telefone: "(11) 99999-5555",
        cep: "17900-000",
        endereco: "Rua Minas Gerais, 500",
        bairro: "Centro",
        cidade: "Dracena/SP",
        usuario: "lucas.martins",
        perfil: "Técnico",
        status: "Ativo",
        ultimoAcesso: "09/06/2026 às 16:50",
        observacoes: "Técnico vinculado à equipe de psicologia."
    },
    {
        id: 6,
        nome: "Patrícia Lima",
        cpf: "666.777.888-99",
        nascimento: "25/03/1993",
        sexo: "Feminino",
        cargoFuncao: "Recepcionista",
        registroClasse: "-",
        especialidade: "-",
        admissao: "11/02/2024",
        supervisorResponsavel: "Mariana Oliveira",
        email: "patricia.lima@psisaude.com",
        telefone: "(11) 99999-6666",
        cep: "17900-000",
        endereco: "Rua Bahia, 600",
        bairro: "Centro",
        cidade: "Dracena/SP",
        usuario: "patricia.lima",
        perfil: "Recepção",
        status: "Inativo",
        ultimoAcesso: "02/06/2026 às 13:15",
        observacoes: "Colaboradora vinculada à recepção da unidade."
    },
    {
        id: 7,
        nome: "João Pedro Santos",
        cpf: "777.888.999-00",
        nascimento: "04/04/2002",
        sexo: "Masculino",
        cargoFuncao: "Aluno",
        registroClasse: "-",
        especialidade: "Psicologia",
        admissao: "01/02/2026",
        supervisorResponsavel: "Andressa de Sales Fernandes",
        email: "joao.santos@aluno.com",
        telefone: "(18) 99711-1111",
        cep: "17900-000",
        endereco: "Rua das Flores, 700",
        bairro: "Centro",
        cidade: "Dracena/SP",
        usuario: "joao.santos",
        perfil: "Aluno observador",
        status: "Ativo",
        ultimoAcesso: "09/06/2026 às 10:00",
        observacoes: "Aluno vinculado à supervisão em psicologia."
    },
    {
        id: 8,
        nome: "Maria Eduarda Lima",
        cpf: "888.999.000-11",
        nascimento: "19/08/2001",
        sexo: "Feminino",
        cargoFuncao: "Estagiária",
        registroClasse: "-",
        especialidade: "Psicologia",
        admissao: "01/02/2026",
        supervisorResponsavel: "Andressa de Sales Fernandes",
        email: "maria.lima@aluno.com",
        telefone: "(18) 99722-2222",
        cep: "17900-000",
        endereco: "Rua Paraná, 800",
        bairro: "Centro",
        cidade: "Dracena/SP",
        usuario: "maria.lima",
        perfil: "Estagiário",
        status: "Ativo",
        ultimoAcesso: "09/06/2026 às 09:40",
        observacoes: "Estagiária vinculada à equipe de psicologia."
    },
    {
        id: 9,
        nome: "Gabriel Oliveira",
        cpf: "999.000.111-22",
        nascimento: "10/10/2003",
        sexo: "Masculino",
        cargoFuncao: "Aluno técnico",
        registroClasse: "-",
        especialidade: "Psicologia",
        admissao: "01/03/2026",
        supervisorResponsavel: "Lucas Martins",
        email: "gabriel.oliveira@aluno.com",
        telefone: "(18) 99733-3333",
        cep: "17900-000",
        endereco: "Rua Amazonas, 900",
        bairro: "Centro",
        cidade: "Dracena/SP",
        usuario: "gabriel.oliveira",
        perfil: "Aluno técnico",
        status: "Ativo",
        ultimoAcesso: "08/06/2026 às 15:20",
        observacoes: "Aluno técnico vinculado à supervisão de Lucas Martins."
    }
];

function carregarColaborador() {
    const idSelecionado = Number(localStorage.getItem("colaboradorSelecionado"));

    const colaborador =
        colaboradores.find(item => item.id === idSelecionado) ||
        colaboradores[0];

    const quantidadeAlunos = colaboradores.filter(item =>
        ehAluno(item) &&
        item.supervisorResponsavel === colaborador.nome
    ).length;

    document.getElementById("nomeColaborador").textContent = colaborador.nome;
    document.getElementById("cargoColaborador").textContent = colaborador.cargoFuncao;
    document.getElementById("statusColaborador").textContent = colaborador.status;
    document.getElementById("registroColaborador").textContent = colaborador.registroClasse || "Não se aplica";
    document.getElementById("emailColaborador").textContent = colaborador.email;
    document.getElementById("telefoneColaborador").textContent = colaborador.telefone;

    preencherCampo("dadoNome", colaborador.nome);
    preencherCampo("dadoCpf", colaborador.cpf);
    preencherCampo("dadoNascimento", colaborador.nascimento);
    preencherCampo("dadoSexo", colaborador.sexo);

    preencherCampo("dadoCargo", colaborador.cargoFuncao);
    preencherCampo("dadoRegistro", colaborador.registroClasse || "Não se aplica");
    preencherCampo("dadoEspecialidade", colaborador.especialidade || "Não se aplica");
    preencherCampo("dadoAdmissao", colaborador.admissao);

    preencherCampo("dadoSupervisor", colaborador.supervisorResponsavel || "-");
    preencherCampo("dadoQuantidadeAlunos", ehAluno(colaborador) ? "-" : quantidadeAlunos);

    preencherCampo("dadoCep", colaborador.cep);
    preencherCampo("dadoEndereco", colaborador.endereco);
    preencherCampo("dadoBairro", colaborador.bairro);
    preencherCampo("dadoCidade", colaborador.cidade);

    preencherCampo("dadoUsuario", colaborador.usuario);
    preencherCampo("dadoPerfil", colaborador.perfil);
    preencherCampo("dadoStatus", colaborador.status);
    preencherCampo("dadoUltimoAcesso", colaborador.ultimoAcesso);

    preencherCampo("observacoesColaborador", colaborador.observacoes);
}

function ehAluno(colaborador) {
    const cargo = colaborador.cargoFuncao || "";

    return (
        cargo === "Aluno" ||
        cargo === "Aluno técnico" ||
        cargo.includes("Estagi")
    );
}

function preencherCampo(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

function editarColaborador() {
    window.location.href = "adicionar-colaborador.html";
}

function inativarColaborador() {
    const confirmar = confirm("Deseja realmente inativar este colaborador?");

    if (confirmar) {
        alert("Colaborador inativado com sucesso!");
    }
}