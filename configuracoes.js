/* ==========================================
   CONFIGURAÇÕES - PSISAÚDE
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSidebar();
    configurarDropdownUsuario();

    carregarConfiguracoes();
});

/* ==========================================
   ABAS
========================================== */

function abrirAbaConfig(nomeAba, botao) {
    const paineis = document.querySelectorAll(".painel-config");
    const botoes = document.querySelectorAll(".aba-config");

    paineis.forEach(painel => {
        painel.classList.remove("active");
    });

    botoes.forEach(btn => {
        btn.classList.remove("active");
    });

    const painelSelecionado = document.getElementById(`aba-${nomeAba}`);

    if (painelSelecionado) {
        painelSelecionado.classList.add("active");
    }

    if (botao) {
        botao.classList.add("active");
    }
}

/* ==========================================
   CONFIGURAÇÕES PADRÃO
========================================== */

const configuracoesPadrao = {
    usuarioNome: "Andressa de Sales Fernandes",
    usuarioCargo: "Administrador(a)",
    usuarioEmail: "andressa@psisaude.com",
    usuarioTelefone: "(18) 99999-0000",

    unidadeNome: "Centro Integrado PsiSaúde",
    unidadeCnes: "1234567",
    unidadeCnpj: "00.000.000/0001-00",
    unidadeTelefone: "(18) 99999-0000",
    unidadeEmail: "contato@psisaude.com",
    unidadeEndereco: "Rua Principal, 100 - Centro - Dracena/SP",

    agendaInicio: "07:00",
    agendaFim: "22:00",
    duracaoConsulta: "50 minutos",
    permitirEncaixe: true,
    mostrarFimSemana: false,
    agendaInicial: true,

    maxAlunosSupervisor: "5",
    validacaoSupervisor: "Obrigatória",

    tempoSessao: "30 minutos",
    temaSistema: "Claro",
    corPrincipal: "Verde Santa Casa",

    textoAtestado: "Atesto, para os devidos fins, que o(a) paciente compareceu a atendimento psicológico nesta unidade.",
    textoEncaminhamento: "Encaminho o(a) paciente para avaliação e continuidade do cuidado conforme necessidade identificada em atendimento psicológico.",
    textoDeclaracao: "Declaro que o(a) paciente esteve presente nesta unidade para atendimento/acompanhamento psicológico."
};

/* ==========================================
   CARREGAR
========================================== */

function carregarConfiguracoes() {
    const salvas =
        JSON.parse(localStorage.getItem("configuracoesPsiSaude")) ||
        configuracoesPadrao;

    preencherCampo("usuarioNome", salvas.usuarioNome);
    preencherCampo("usuarioCargo", salvas.usuarioCargo);
    preencherCampo("usuarioEmail", salvas.usuarioEmail);
    preencherCampo("usuarioTelefone", salvas.usuarioTelefone);

    preencherCampo("unidadeNome", salvas.unidadeNome);
    preencherCampo("unidadeCnes", salvas.unidadeCnes);
    preencherCampo("unidadeCnpj", salvas.unidadeCnpj);
    preencherCampo("unidadeTelefone", salvas.unidadeTelefone);
    preencherCampo("unidadeEmail", salvas.unidadeEmail);
    preencherCampo("unidadeEndereco", salvas.unidadeEndereco);

    preencherCampo("agendaInicio", salvas.agendaInicio);
    preencherCampo("agendaFim", salvas.agendaFim);
    preencherCampo("duracaoConsulta", salvas.duracaoConsulta);

    marcarCheckbox("permitirEncaixe", salvas.permitirEncaixe);
    marcarCheckbox("mostrarFimSemana", salvas.mostrarFimSemana);
    marcarCheckbox("agendaInicial", salvas.agendaInicial);

    preencherCampo("maxAlunosSupervisor", salvas.maxAlunosSupervisor);
    preencherCampo("validacaoSupervisor", salvas.validacaoSupervisor);

    preencherCampo("tempoSessao", salvas.tempoSessao);
    preencherCampo("temaSistema", salvas.temaSistema);
    preencherCampo("corPrincipal", salvas.corPrincipal);

    preencherCampo("textoAtestado", salvas.textoAtestado);
    preencherCampo("textoEncaminhamento", salvas.textoEncaminhamento);
    preencherCampo("textoDeclaracao", salvas.textoDeclaracao);
}

/* ==========================================
   SALVAR
========================================== */

function salvarConfiguracoes() {
    const configuracoes = {
        usuarioNome: pegarValor("usuarioNome"),
        usuarioCargo: pegarValor("usuarioCargo"),
        usuarioEmail: pegarValor("usuarioEmail"),
        usuarioTelefone: pegarValor("usuarioTelefone"),

        unidadeNome: pegarValor("unidadeNome"),
        unidadeCnes: pegarValor("unidadeCnes"),
        unidadeCnpj: pegarValor("unidadeCnpj"),
        unidadeTelefone: pegarValor("unidadeTelefone"),
        unidadeEmail: pegarValor("unidadeEmail"),
        unidadeEndereco: pegarValor("unidadeEndereco"),

        agendaInicio: pegarValor("agendaInicio"),
        agendaFim: pegarValor("agendaFim"),
        duracaoConsulta: pegarValor("duracaoConsulta"),

        permitirEncaixe: checkboxMarcado("permitirEncaixe"),
        mostrarFimSemana: checkboxMarcado("mostrarFimSemana"),
        agendaInicial: checkboxMarcado("agendaInicial"),

        maxAlunosSupervisor: pegarValor("maxAlunosSupervisor"),
        validacaoSupervisor: pegarValor("validacaoSupervisor"),

        tempoSessao: pegarValor("tempoSessao"),
        temaSistema: pegarValor("temaSistema"),
        corPrincipal: pegarValor("corPrincipal"),

        textoAtestado: pegarValor("textoAtestado"),
        textoEncaminhamento: pegarValor("textoEncaminhamento"),
        textoDeclaracao: pegarValor("textoDeclaracao"),

        atualizadoEm: new Date().toISOString(),
        atualizadoPor: localStorage.getItem("usuarioNome") || "Usuário"
    };

    localStorage.setItem(
        "configuracoesPsiSaude",
        JSON.stringify(configuracoes)
    );

    localStorage.setItem("usuarioNome", configuracoes.usuarioNome);
    localStorage.setItem("usuarioCargo", configuracoes.usuarioCargo);

    registrarHistoricoConfiguracao(
        "Sistema",
        "Edição",
        "Configurações do sistema foram atualizadas."
    );

    alert("Configurações salvas com sucesso!");

    carregarUsuario();
}

/* ==========================================
   RESTAURAR PADRÃO
========================================== */

function restaurarPadrao() {
    const confirmar = confirm(
        "Deseja restaurar as configurações padrão do sistema?"
    );

    if (!confirmar) return;

    localStorage.setItem(
        "configuracoesPsiSaude",
        JSON.stringify(configuracoesPadrao)
    );

    carregarConfiguracoes();

    registrarHistoricoConfiguracao(
        "Sistema",
        "Edição",
        "Configurações padrão foram restauradas."
    );

    alert("Configurações padrão restauradas com sucesso!");
}

/* ==========================================
   EXPORTAR CONFIGURAÇÕES
========================================== */

function exportarConfiguracoes() {
    const configuracoes =
        JSON.parse(localStorage.getItem("configuracoesPsiSaude")) ||
        configuracoesPadrao;

    const blob = new Blob(
        [JSON.stringify(configuracoes, null, 4)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "configuracoes_psisaude.json";
    link.click();

    URL.revokeObjectURL(url);

    registrarHistoricoConfiguracao(
        "Sistema",
        "Exportação",
        "Configurações do sistema foram exportadas."
    );
}

/* ==========================================
   ALTERAR SENHA
========================================== */

function abrirAlterarSenha() {
    const senhaAtual = prompt("Digite a senha atual:");

    if (senhaAtual === null) return;

    const novaSenha = prompt("Digite a nova senha:");

    if (novaSenha === null) return;

    if (novaSenha.length < 6) {
        alert("A nova senha deve ter pelo menos 6 caracteres.");
        return;
    }

    const confirmarSenha = prompt("Confirme a nova senha:");

    if (confirmarSenha !== novaSenha) {
        alert("As senhas não conferem.");
        return;
    }

    registrarHistoricoConfiguracao(
        "Sistema",
        "Edição",
        "Senha do usuário foi alterada."
    );

    alert("Senha alterada com sucesso!");
}

/* ==========================================
   HISTÓRICO
========================================== */

function registrarHistoricoConfiguracao(modulo, acao, descricao) {
    const historico =
        JSON.parse(localStorage.getItem("historicoPsiSaude")) || [];

    const agora = new Date();

    const registro = {
        dataHora: agora.toLocaleString("pt-BR"),
        profissional:
            localStorage.getItem("usuarioNome") ||
            "Andressa de Sales Fernandes",
        modulo,
        acao,
        descricao
    };

    historico.unshift(registro);

    localStorage.setItem(
        "historicoPsiSaude",
        JSON.stringify(historico)
    );
}

/* ==========================================
   AUXILIARES
========================================== */

function pegarValor(id) {
    const campo = document.getElementById(id);

    if (!campo) return "";

    return campo.value.trim();
}

function preencherCampo(id, valor) {
    const campo = document.getElementById(id);

    if (campo) {
        campo.value = valor || "";
    }
}

function checkboxMarcado(id) {
    const campo = document.getElementById(id);

    return campo ? campo.checked : false;
}

function marcarCheckbox(id, valor) {
    const campo = document.getElementById(id);

    if (campo) {
        campo.checked = Boolean(valor);
    }
}