/* ==========================================
   HISTÓRICO DE ATIVIDADES
========================================== */

let historico = [

    {
        dataHora: "09/06/2026 08:12",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Sistema",
        acao: "Login",
        descricao: "Realizou login no sistema."
    },

    {
        dataHora: "09/06/2026 08:15",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Agenda",
        acao: "Cadastro",
        descricao: "Criou agendamento para Ana Clara Ribeiro."
    },

    {
        dataHora: "09/06/2026 08:20",
        profissional: "Lucas Martins",
        modulo: "Lista de Atendimento",
        acao: "Cadastro",
        descricao: "Adicionou paciente na lista de atendimento."
    },

    {
        dataHora: "09/06/2026 08:45",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Atendimento",
        acao: "Início",
        descricao: "Iniciou atendimento psicológico de Ana Clara Ribeiro."
    },

    {
        dataHora: "09/06/2026 09:31",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Atendimento",
        acao: "Finalização",
        descricao: "Finalizou atendimento psicológico de Ana Clara Ribeiro."
    },

    {
        dataHora: "09/06/2026 09:32",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Prontuário",
        acao: "Edição",
        descricao: "Atualizou evolução clínica do paciente."
    },

    {
        dataHora: "09/06/2026 09:34",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Prontuário",
        acao: "Impressão",
        descricao: "Prontuário de Ana Clara Ribeiro foi impresso."
    },

    {
        dataHora: "09/06/2026 09:36",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Atestado",
        acao: "Impressão",
        descricao: "Atestado psicológico emitido e impresso."
    },

    {
        dataHora: "09/06/2026 09:38",
        profissional: "Carlos Henrique",
        modulo: "Encaminhamento",
        acao: "Impressão",
        descricao: "Encaminhamento para psiquiatria impresso."
    },

    {
        dataHora: "09/06/2026 10:12",
        profissional: "Mariana Oliveira",
        modulo: "Colaboradores",
        acao: "Cadastro",
        descricao: "Cadastrou colaborador Fernanda Souza."
    },

    {
        dataHora: "09/06/2026 10:25",
        profissional: "Mariana Oliveira",
        modulo: "Alunos",
        acao: "Cadastro",
        descricao: "Cadastrou aluno João Pedro Santos."
    },

    {
        dataHora: "09/06/2026 10:30",
        profissional: "Mariana Oliveira",
        modulo: "Alunos",
        acao: "Edição",
        descricao: "Alterou supervisor do aluno João Pedro Santos."
    },

    {
        dataHora: "09/06/2026 11:05",
        profissional: "Lucas Martins",
        modulo: "Atividade Coletiva",
        acao: "Cadastro",
        descricao: "Registrou grupo terapêutico sobre ansiedade."
    },

    {
        dataHora: "09/06/2026 11:20",
        profissional: "Lucas Martins",
        modulo: "Atividade Coletiva",
        acao: "Edição",
        descricao: "Atualizou participantes da atividade coletiva."
    },

    {
        dataHora: "09/06/2026 12:00",
        profissional: "Mariana Oliveira",
        modulo: "Relatórios",
        acao: "Exportação",
        descricao: "Exportou relatório mensal em CSV."
    },

    {
        dataHora: "09/06/2026 12:04",
        profissional: "Mariana Oliveira",
        modulo: "Relatórios",
        acao: "Impressão",
        descricao: "Imprimiu relatório de produção."
    },

    {
        dataHora: "09/06/2026 13:15",
        profissional: "Fernanda Souza",
        modulo: "Pacientes",
        acao: "Cadastro",
        descricao: "Cadastrou paciente Gabriel Oliveira."
    },

    {
        dataHora: "09/06/2026 13:50",
        profissional: "Fernanda Souza",
        modulo: "Pacientes",
        acao: "Edição",
        descricao: "Atualizou endereço do paciente."
    },

    {
        dataHora: "09/06/2026 14:02",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Exames",
        acao: "Cadastro",
        descricao: "Solicitou exame psicológico complementar."
    },

    {
        dataHora: "09/06/2026 14:05",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Exames",
        acao: "Impressão",
        descricao: "Solicitação de exame impressa."
    },

    {
        dataHora: "09/06/2026 14:10",
        profissional: "Andressa de Sales Fernandes",
        modulo: "Prescrição",
        acao: "Impressão",
        descricao: "Orientações terapêuticas impressas."
    },

    {
        dataHora: "09/06/2026 15:30",
        profissional: "Carlos Henrique",
        modulo: "Agenda",
        acao: "Cancelamento",
        descricao: "Cancelou agendamento do paciente Pedro Lima."
    },

    {
        dataHora: "09/06/2026 16:10",
        profissional: "Mariana Oliveira",
        modulo: "Sistema",
        acao: "Logout",
        descricao: "Saiu do sistema."
    }

];

/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    carregarProfissionais();

    atualizarIndicadores();

    renderizarTabela(historico);

    renderizarTimeline(historico);

});

/* ==========================================
   PROFISSIONAIS
========================================== */

function carregarProfissionais(){

    const select =
        document.getElementById("filtroProfissional");

    const profissionais =
        [...new Set(
            historico.map(item => item.profissional)
        )];

    profissionais.forEach(nome => {

        select.innerHTML += `
            <option value="${nome}">
                ${nome}
            </option>
        `;

    });

}

/* ==========================================
   INDICADORES
========================================== */

function atualizarIndicadores(){

    document.getElementById("totalRegistros")
        .textContent = historico.length;

    document.getElementById("totalImpressoes")
        .textContent =
        historico.filter(
            item => item.acao === "Impressão"
        ).length;

    document.getElementById("totalExportacoes")
        .textContent =
        historico.filter(
            item => item.acao === "Exportação"
        ).length;

    document.getElementById("totalFinalizados")
        .textContent =
        historico.filter(
            item => item.acao === "Finalização"
        ).length;

}

/* ==========================================
   TABELA
========================================== */

function renderizarTabela(lista){

    const tbody =
        document.getElementById("tbodyHistorico");

    tbody.innerHTML = "";

    lista.forEach(item => {

        tbody.innerHTML += `
            <tr>

                <td>${item.dataHora}</td>

                <td>${item.profissional}</td>

                <td>${item.modulo}</td>

                <td>
                    <span class="
                        badge-acao
                        ${normalizarClasse(item.acao)}
                    ">
                        ${item.acao}
                    </span>
                </td>

                <td>${item.descricao}</td>

            </tr>
        `;

    });

    document.getElementById(
        "quantidadeResultados"
    ).textContent =
        `${lista.length} registros`;

}

/* ==========================================
   TIMELINE
========================================== */

function renderizarTimeline(lista){

    const timeline =
        document.getElementById(
            "timelineHistorico"
        );

    timeline.innerHTML = "";

    lista.slice().reverse().forEach(item => {

        timeline.innerHTML += `
            <div class="timeline-item">

                <div class="timeline-icon">
                    <i class="fa-solid fa-clock"></i>
                </div>

                <div class="timeline-content">

                    <strong>
                        ${item.profissional}
                    </strong>

                    <p>
                        ${item.descricao}
                    </p>

                    <span>
                        ${item.dataHora}
                        •
                        ${item.modulo}
                        •
                        ${item.acao}
                    </span>

                </div>

            </div>
        `;

    });

}

/* ==========================================
   FILTROS
========================================== */

function filtrarHistorico(){

    const profissional =
        document.getElementById(
            "filtroProfissional"
        ).value;

    const modulo =
        document.getElementById(
            "filtroModulo"
        ).value;

    const acao =
        document.getElementById(
            "filtroAcao"
        ).value;

    const texto =
        document.getElementById(
            "pesquisaHistorico"
        ).value.toLowerCase();

    const resultado =
        historico.filter(item => {

            return (

                (!profissional ||
                    item.profissional === profissional)

                &&

                (!modulo ||
                    item.modulo === modulo)

                &&

                (!acao ||
                    item.acao === acao)

                &&

                (!texto ||
                    item.descricao
                        .toLowerCase()
                        .includes(texto))

            );

        });

    renderizarTabela(resultado);

    renderizarTimeline(resultado);

}

/* ==========================================
   LIMPAR
========================================== */

function limparFiltros(){

    document.getElementById(
        "dataInicial"
    ).value = "";

    document.getElementById(
        "dataFinal"
    ).value = "";

    document.getElementById(
        "filtroProfissional"
    ).value = "";

    document.getElementById(
        "filtroModulo"
    ).value = "";

    document.getElementById(
        "filtroAcao"
    ).value = "";

    document.getElementById(
        "pesquisaHistorico"
    ).value = "";

    renderizarTabela(historico);

    renderizarTimeline(historico);

}

/* ==========================================
   AÇÕES
========================================== */

function atualizarHistorico(){

    renderizarTabela(historico);

    renderizarTimeline(historico);

}

function imprimirHistorico(){

    window.print();

}

function exportarCSV(){

    alert(
        "Exportação CSV será implementada."
    );

}

function normalizarClasse(texto){

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");

}