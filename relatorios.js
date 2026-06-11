/* ==========================================
   RELATÓRIOS - PSISAÚDE
========================================== */

let registrosRelatorio = [
    {
        id: 1,
        data: "2026-06-01",
        tipo: "Atendimento psicológico",
        pacienteGrupo: "Ana Clara Ribeiro",
        profissional: "Andressa de Sales Fernandes",
        status: "Realizado",
        descricao: "Consulta individual com foco em ansiedade e estratégias de enfrentamento."
    },
    {
        id: 2,
        data: "2026-06-02",
        tipo: "Atendimento psicológico",
        pacienteGrupo: "Bruno Henrique Souza",
        profissional: "Andressa de Sales Fernandes",
        status: "Realizado",
        descricao: "Evolução de acompanhamento psicoterapêutico."
    },
    {
        id: 3,
        data: "2026-06-03",
        tipo: "Atividade coletiva",
        pacienteGrupo: "Grupo terapêutico",
        profissional: "Andressa de Sales Fernandes",
        status: "Realizado",
        descricao: "Grupo terapêutico sobre ansiedade com 12 participantes."
    },
    {
        id: 4,
        data: "2026-06-04",
        tipo: "Lista de atendimento",
        pacienteGrupo: "Carolina Martins",
        profissional: "Lucas Martins",
        status: "Agendado",
        descricao: "Paciente aguardando atendimento psicológico."
    },
    {
        id: 5,
        data: "2026-06-05",
        tipo: "Atividade coletiva",
        pacienteGrupo: "Roda de conversa escolar",
        profissional: "Mariana Oliveira",
        status: "Realizado",
        descricao: "Roda de conversa sobre saúde mental na escola."
    },
    {
        id: 6,
        data: "2026-06-06",
        tipo: "Encaminhamento",
        pacienteGrupo: "Daniel Pereira",
        profissional: "Carlos Henrique",
        status: "Realizado",
        descricao: "Encaminhamento para avaliação psiquiátrica."
    },
    {
        id: 7,
        data: "2026-06-07",
        tipo: "Documento emitido",
        pacienteGrupo: "Eduarda Lima",
        profissional: "Andressa de Sales Fernandes",
        status: "Realizado",
        descricao: "Declaração de comparecimento emitida."
    },
    {
        id: 8,
        data: "2026-06-08",
        tipo: "Atendimento psicológico",
        pacienteGrupo: "Felipe Santos",
        profissional: "Andressa de Sales Fernandes",
        status: "Falta",
        descricao: "Paciente não compareceu ao atendimento agendado."
    },
    {
        id: 9,
        data: "2026-06-09",
        tipo: "Supervisão de alunos",
        pacienteGrupo: "João Pedro Santos e Maria Eduarda Lima",
        profissional: "Andressa de Sales Fernandes",
        status: "Realizado",
        descricao: "Supervisão de casos e discussão de condutas."
    },
    {
        id: 10,
        data: "2026-06-10",
        tipo: "Atendimento psicológico",
        pacienteGrupo: "Gabriel Almeida",
        profissional: "Lucas Martins",
        status: "Cancelado",
        descricao: "Atendimento cancelado pela unidade."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSidebar();
    configurarDropdownUsuario();

    carregarDadosExtras();
    gerarRelatorio();
});

/* ==========================================
   DADOS EXTRAS
========================================== */

function carregarDadosExtras() {
    const atividadesSalvas =
        JSON.parse(localStorage.getItem("atividadesColetivasPsiSaude")) || [];

    atividadesSalvas.forEach(atividade => {
        registrosRelatorio.push({
            id: Date.now() + Math.random(),
            data: atividade.data,
            tipo: "Atividade coletiva",
            pacienteGrupo: atividade.tema || atividade.tipo,
            profissional: atividade.responsavel,
            status: atividade.status === "Realizada" ? "Realizado" : atividade.status,
            descricao: `${atividade.tipo} - ${atividade.participantes} participante(s).`
        });
    });

    const colaboradores = [
        {
            nome: "Andressa de Sales Fernandes",
            cargoFuncao: "Psicólogo",
            supervisorResponsavel: "-"
        },
        {
            nome: "Mariana Oliveira",
            cargoFuncao: "Gerente da unidade",
            supervisorResponsavel: "-"
        },
        {
            nome: "Carlos Henrique",
            cargoFuncao: "Médico",
            supervisorResponsavel: "Mariana Oliveira"
        },
        {
            nome: "Fernanda Souza",
            cargoFuncao: "Enfermeiro",
            supervisorResponsavel: "Mariana Oliveira"
        },
        {
            nome: "Lucas Martins",
            cargoFuncao: "Técnico de psicologia",
            supervisorResponsavel: "Andressa de Sales Fernandes"
        },
        {
            nome: "Patrícia Lima",
            cargoFuncao: "Recepcionista",
            supervisorResponsavel: "Mariana Oliveira"
        },
        {
            nome: "João Pedro Santos",
            cargoFuncao: "Aluno",
            supervisorResponsavel: "Andressa de Sales Fernandes"
        },
        {
            nome: "Maria Eduarda Lima",
            cargoFuncao: "Estagiária",
            supervisorResponsavel: "Andressa de Sales Fernandes"
        },
        {
            nome: "Gabriel Oliveira",
            cargoFuncao: "Aluno técnico",
            supervisorResponsavel: "Lucas Martins"
        }
    ];

    localStorage.setItem("colaboradoresRelatorioPsiSaude", JSON.stringify(colaboradores));
}

/* ==========================================
   GERAR RELATÓRIO
========================================== */

function gerarRelatorio() {
    const dataInicial = pegarValor("dataInicial");
    const dataFinal = pegarValor("dataFinal");
    const profissional = pegarValor("filtroProfissional");
    const tipoRelatorio = pegarValor("tipoRelatorio");
    const status = pegarValor("filtroStatus");

    let resultado = registrosRelatorio.filter(registro => {
        const dentroPeriodo =
            (!dataInicial || registro.data >= dataInicial) &&
            (!dataFinal || registro.data <= dataFinal);

        const correspondeProfissional =
            !profissional || registro.profissional === profissional;

        const correspondeTipo =
            !tipoRelatorio ||
            tipoRelatorio === "Geral" ||
            registro.tipo === tipoRelatorio ||
            registro.tipo.toLowerCase().includes(tipoRelatorio.toLowerCase());

        const correspondeStatus =
            !status || registro.status === status;

        return (
            dentroPeriodo &&
            correspondeProfissional &&
            correspondeTipo &&
            correspondeStatus
        );
    });

    atualizarIndicadores(resultado);
    renderizarGrafico(resultado);
    renderizarResumo(resultado);
    renderizarTabela(resultado);
}

/* ==========================================
   INDICADORES
========================================== */

function atualizarIndicadores(lista) {
    const colaboradores =
        JSON.parse(localStorage.getItem("colaboradoresRelatorioPsiSaude")) || [];

    const totalAtendimentos = lista.filter(item =>
        item.tipo === "Atendimento psicológico"
    ).length;

    const totalLista = lista.filter(item =>
        item.tipo === "Lista de atendimento"
    ).length;

    const totalAtividades = lista.filter(item =>
        item.tipo === "Atividade coletiva"
    ).length;

    const totalAlunos = colaboradores.filter(item =>
        ehAluno(item)
    ).length;

    setTexto("totalAtendimentos", totalAtendimentos);
    setTexto("totalLista", totalLista);
    setTexto("totalAtividades", totalAtividades);
    setTexto("totalAlunos", totalAlunos);
}

/* ==========================================
   GRÁFICO
========================================== */

function renderizarGrafico(lista) {
    const grafico = document.getElementById("graficoBarras");

    if (!grafico) return;

    const meses = [
        { mes: "Jan", valor: 12 },
        { mes: "Fev", valor: 18 },
        { mes: "Mar", valor: 22 },
        { mes: "Abr", valor: 19 },
        { mes: "Mai", valor: 25 },
        { mes: "Jun", valor: lista.length || 10 }
    ];

    const maior = Math.max(...meses.map(item => item.valor), 1);

    grafico.innerHTML = meses.map(item => {
        const altura = (item.valor / maior) * 210;

        return `
            <div class="barra-item">
                <span class="barra-valor">${item.valor}</span>
                <div class="barra" style="height:${altura}px"></div>
                <span class="barra-label">${item.mes}</span>
            </div>
        `;
    }).join("");
}

/* ==========================================
   RESUMO
========================================== */

function renderizarResumo(lista) {
    const resumo = document.getElementById("resumoPeriodo");

    if (!resumo) return;

    const realizados = lista.filter(item => item.status === "Realizado").length;
    const faltas = lista.filter(item => item.status === "Falta").length;
    const cancelados = lista.filter(item => item.status === "Cancelado").length;
    const agendados = lista.filter(item => item.status === "Agendado").length;

    resumo.innerHTML = `
        <div class="resumo-item">
            <strong>${realizados} realizado(s)</strong>
            <span>Atendimentos, documentos, encaminhamentos ou atividades concluídas.</span>
        </div>

        <div class="resumo-item">
            <strong>${agendados} agendado(s)</strong>
            <span>Registros previstos ou aguardando execução.</span>
        </div>

        <div class="resumo-item">
            <strong>${faltas} falta(s)</strong>
            <span>Pacientes que não compareceram ao atendimento.</span>
        </div>

        <div class="resumo-item">
            <strong>${cancelados} cancelado(s)</strong>
            <span>Atendimentos ou ações canceladas no período.</span>
        </div>
    `;
}

/* ==========================================
   TABELA
========================================== */

function renderizarTabela(lista) {
    const tabela = document.getElementById("tabelaRelatorios");
    const listaVazia = document.getElementById("listaVazia");

    if (!tabela || !listaVazia) return;

    tabela.innerHTML = "";

    if (lista.length === 0) {
        listaVazia.classList.remove("hidden");
        return;
    }

    listaVazia.classList.add("hidden");

    lista.forEach(registro => {
        tabela.innerHTML += `
            <tr>
                <td>${formatarData(registro.data)}</td>
                <td>${registro.tipo}</td>
                <td>${registro.pacienteGrupo}</td>
                <td>${abreviarNome(registro.profissional)}</td>
                <td>
                    <span class="badge ${classeStatus(registro.status)}">
                        ${registro.status}
                    </span>
                </td>
                <td>${registro.descricao}</td>
            </tr>
        `;
    });
}

/* ==========================================
   IMPRIMIR / EXPORTAR
========================================== */

function imprimirRelatorio() {
    window.print();
}

function exportarCSV() {
    const linhas = [
        ["Data", "Tipo", "Paciente/Grupo", "Profissional", "Status", "Descrição"]
    ];

    document.querySelectorAll("#tabelaRelatorios tr").forEach(tr => {
        const colunas = Array.from(tr.querySelectorAll("td")).map(td =>
            td.innerText.replace(/\n/g, " ").trim()
        );

        if (colunas.length) {
            linhas.push(colunas);
        }
    });

    const csv = linhas
        .map(linha => linha.map(campo => `"${campo}"`).join(";"))
        .join("\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio_psisaude.csv";
    link.click();

    URL.revokeObjectURL(url);
}

/* ==========================================
   AUXILIARES
========================================== */

function pegarValor(id) {
    const campo = document.getElementById(id);

    if (!campo) return "";

    return campo.value.trim();
}

function setTexto(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

function formatarData(data) {
    if (!data) return "-";

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function classeStatus(status) {
    if (status === "Realizado") return "realizado";
    if (status === "Agendado") return "agendado";
    if (status === "Cancelado") return "cancelado";
    if (status === "Falta") return "falta";

    return "";
}

function abreviarNome(nome) {
    if (!nome) return "-";

    const ignorar = ["de", "da", "do", "dos", "das"];
    const partes = nome.trim().split(" ");

    if (partes.length === 1) return nome;

    let indice = partes.length - 1;

    while (
        indice > 0 &&
        ignorar.includes(partes[indice].toLowerCase())
    ) {
        indice--;
    }

    return `${partes[0]} ${partes[indice].charAt(0)}.`;
}

function ehAluno(colaborador) {
    const cargo = colaborador.cargoFuncao || "";

    return (
        cargo === "Aluno" ||
        cargo === "Aluno técnico" ||
        cargo.includes("Estagi")
    );
}