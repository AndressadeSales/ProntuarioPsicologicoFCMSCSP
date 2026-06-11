/* ==========================================
   ADICIONAR ALUNO
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSidebar();
    configurarDropdownUsuario();
});

/* ==========================================
   SALVAR ALUNO
========================================== */

function salvarAluno() {

    const aluno = {
        id: Date.now(),

        nome: pegarValor("nomeAluno"),
        cpf: pegarValor("cpfAluno"),
        dataNascimento: pegarValor("dataNascimentoAluno"),
        sexo: pegarValor("sexoAluno"),
        telefone: pegarValor("telefoneAluno"),
        email: pegarValor("emailAluno"),

        tipoVinculo: pegarValor("tipoAluno"),
        curso: pegarValor("cursoAluno"),
        instituicao: pegarValor("instituicaoAluno"),
        periodo: pegarValor("periodoAluno"),
        matricula: pegarValor("matriculaAluno"),
        dataInicio: pegarValor("dataInicioAluno"),
        dataFim: pegarValor("dataFimAluno"),
        cargaHoraria: pegarValor("cargaHorariaAluno"),

        supervisor: pegarValor("supervisorAluno"),
        setor: pegarValor("setorAluno"),
        atividades: pegarValor("atividadesAluno"),

        cep: pegarValor("cepAluno"),
        endereco: pegarValor("enderecoAluno"),
        bairro: pegarValor("bairroAluno"),
        cidade: pegarValor("cidadeAluno"),
        uf: pegarValor("ufAluno"),

        usuario: pegarValor("usuarioAluno"),
        perfil: pegarValor("perfilAluno"),
        status: pegarValor("statusAluno") || "Ativo",

        observacoes: pegarValor("observacoesAluno"),

        criadoEm: new Date().toISOString()
    };

    if (!aluno.nome) {
        alert("Preencha o nome completo do aluno.");
        return;
    }

    if (!aluno.cpf) {
        alert("Preencha o CPF do aluno.");
        return;
    }

    if (!aluno.tipoVinculo) {
        alert("Selecione o tipo de vínculo do aluno.");
        return;
    }

    let alunos = JSON.parse(localStorage.getItem("alunosPsiSaude")) || [];

    alunos.push(aluno);

    localStorage.setItem("alunosPsiSaude", JSON.stringify(alunos));
    localStorage.setItem("alunoSelecionado", JSON.stringify(aluno));

    alert("Aluno cadastrado com sucesso!");

    document.getElementById("formAluno").reset();
}

/* ==========================================
   FUNÇÕES AUXILIARES
========================================== */

function pegarValor(id) {
    const campo = document.getElementById(id);

    if (!campo) {
        return "";
    }

    return campo.value.trim();
}