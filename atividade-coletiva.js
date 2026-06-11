/* ==========================================
   ATIVIDADE COLETIVA - PSISAÚDE
========================================== */

let atividades = [
    {
        id: 1,
        data: "2026-06-03",
        turno: "Manhã",
        tipo: "Grupo terapêutico",
        tema: "Ansiedade",
        responsavel: "Andressa de Sales Fernandes",
        profissionais: "Lucas Martins",
        local: "Sala de grupo",
        participantes: 12,
        status: "Realizada",
        publicoAlvo: "Adultos",
        programa: "Saúde mental",
        inep: "",
        instituicao: "",
        recursos: ["Dinâmica de grupo", "Escuta qualificada", "Técnicas de relaxamento"],
        participantesIdentificados: [
            { nome: "Ana Clara Ribeiro", vinculo: "Paciente" },
            { nome: "João Pedro Santos", vinculo: "Aluno" }
        ],
        descricao: "Grupo terapêutico com foco em manejo de ansiedade, identificação de pensamentos automáticos e técnicas de respiração.",
        observacoes: "Participantes demonstraram boa adesão. Programado novo encontro para continuidade do tema."
    },
    {
        id: 2,
        data: "2026-06-05",
        turno: "Tarde",
        tipo: "Roda de conversa",
        tema: "Saúde mental na escola",
        responsavel: "Mariana Oliveira",
        profissionais: "Andressa de Sales Fernandes",
        local: "Escola Municipal Jardim das Flores",
        participantes: 28,
        status: "Realizada",
        publicoAlvo: "Adolescentes",
        programa: "PSE - Programa Saúde na Escola",
        inep: "35000000",
        instituicao: "Escola Municipal Jardim das Flores",
        recursos: ["Roda de conversa", "Material educativo", "Orientações psicológicas"],
        participantesIdentificados: [],
        descricao: "Roda de conversa sobre saúde mental, emoções, convivência escolar e procura por ajuda.",
        observacoes: "Equipe escolar solicitou nova atividade sobre prevenção ao bullying."
    },
    {
        id: 3,
        data: "2026-06-12",
        turno: "Noite",
        tipo: "Psicoeducação",
        tema: "Prevenção ao suicídio",
        responsavel: "Carlos Henrique",
        profissionais: "Andressa de Sales Fernandes, Fernanda Souza",
        local: "Auditório da unidade",
        participantes: 20,
        status: "Planejada",
        publicoAlvo: "Familiares",
        programa: "Prevenção e promoção da saúde",
        inep: "",
        instituicao: "",
        recursos: ["Material educativo", "Orientações psicológicas"],
        participantesIdentificados: [],
        descricao: "Atividade planejada para orientar familiares sobre sinais de alerta, rede de apoio e busca por atendimento.",
        observacoes: "Preparar material informativo para entrega aos participantes."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSidebar();
    configurarDropdownUsuario();

    carregarAtividadesSalvas();
    renderizarAtividades(atividades);
});

/* ==========================================
   LOCALSTORAGE
========================================== */

function carregarAtividadesSalvas() {
    const salvas = JSON.parse(localStorage.getItem("atividadesColetivasPsiSaude")) || [];

    if (salvas.length > 0) {
        atividades = salvas;
        return;
    }

    localStorage.setItem("atividadesColetivasPsiSaude", JSON.stringify(atividades));
}

/* ==========================================
   RENDERIZAÇÃO
========================================== */

function renderizarAtividades(lista) {
    const tabela = document.getElementById("tabelaAtividades");
    const listaVazia = document.getElementById("listaVazia");
    const total = document.getElementById("totalAtividades");

    if (!tabela || !listaVazia || !total) return;

    tabela.innerHTML = "";
    total.innerText = `${lista.length} atividade(s)`;

    if (lista.length === 0) {
        listaVazia.classList.remove("hidden");
        return;
    }

    listaVazia.classList.add("hidden");

    lista.forEach(atividade => {
        tabela.innerHTML += `
            <tr>
                <td>${formatarData(atividade.data)}</td>
                <td>${atividade.tipo}</td>
                <td>${atividade.tema}</td>
                <td>${abreviarNome(atividade.responsavel)}</td>
                <td>${atividade.local || "-"}</td>
                <td>${atividade.participantes}</td>
                <td>
                    <span class="badge ${classeStatus(atividade.status)}">
                        ${atividade.status}
                    </span>
                </td>
                <td>
                    <div class="acoes">
                        <button onclick="visualizarAtividade(${atividade.id})" title="Visualizar">
                            <i class="fa-solid fa-eye"></i>
                        </button>

                        <button onclick="editarAtividade(${atividade.id})" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button onclick="excluirAtividade(${atividade.id})" title="Excluir">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

/* ==========================================
   FILTROS
========================================== */

function filtrarAtividades() {
    const busca = pegarValor("campoBusca").toLowerCase();
    const tipo = pegarValor("filtroTipo");
    const status = pegarValor("filtroStatus");

    const resultado = atividades.filter(atividade => {
        const correspondeBusca =
            atividade.tema.toLowerCase().includes(busca) ||
            atividade.responsavel.toLowerCase().includes(busca) ||
            atividade.local.toLowerCase().includes(busca) ||
            atividade.tipo.toLowerCase().includes(busca);

        const correspondeTipo =
            !tipo || atividade.tipo === tipo;

        const correspondeStatus =
            !status || atividade.status === status;

        return correspondeBusca && correspondeTipo && correspondeStatus;
    });

    renderizarAtividades(resultado);
}

/* ==========================================
   MODAL
========================================== */

function abrirModalAtividade() {
    const modal = document.getElementById("modalAtividade");
    const form = document.getElementById("formAtividade");

    if (form) form.reset();

    limparParticipantes();

    if (modal) {
        modal.classList.remove("hidden");
    }
}

function fecharModalAtividade() {
    const modal = document.getElementById("modalAtividade");

    if (modal) {
        modal.classList.add("hidden");
    }
}

/* ==========================================
   PARTICIPANTES
========================================== */

function adicionarParticipante(nome = "", vinculo = "") {
    const lista = document.getElementById("listaParticipantes");

    if (!lista) return;

    const id = Date.now();

    lista.innerHTML += `
        <div class="participante-item" id="participante-${id}">
            <input type="text" class="participante-nome" placeholder="Nome do participante" value="${nome}">
            
            <select class="participante-vinculo">
                <option value="">Vínculo</option>
                <option ${vinculo === "Paciente" ? "selected" : ""}>Paciente</option>
                <option ${vinculo === "Familiar" ? "selected" : ""}>Familiar</option>
                <option ${vinculo === "Aluno" ? "selected" : ""}>Aluno</option>
                <option ${vinculo === "Profissional" ? "selected" : ""}>Profissional</option>
                <option ${vinculo === "Comunidade" ? "selected" : ""}>Comunidade</option>
            </select>

            <button type="button" onclick="removerParticipante('${id}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
}

function removerParticipante(id) {
    const item = document.getElementById(`participante-${id}`);

    if (item) {
        item.remove();
    }
}

function limparParticipantes() {
    const lista = document.getElementById("listaParticipantes");

    if (lista) {
        lista.innerHTML = "";
    }
}

function coletarParticipantes() {
    const itens = document.querySelectorAll(".participante-item");
    const participantes = [];

    itens.forEach(item => {
        const nome = item.querySelector(".participante-nome")?.value.trim();
        const vinculo = item.querySelector(".participante-vinculo")?.value.trim();

        if (nome) {
            participantes.push({
                nome,
                vinculo: vinculo || "Não informado"
            });
        }
    });

    return participantes;
}

/* ==========================================
   SALVAR
========================================== */

function salvarAtividade() {
    const atividade = {
        id: Date.now(),

        data: pegarValor("dataAtividade"),
        turno: pegarValor("turnoAtividade"),
        status: pegarValor("statusAtividade"),
        tipo: pegarValor("tipoAtividade"),
        tema: pegarValor("temaAtividade"),
        participantes: Number(pegarValor("numeroParticipantes")) || 0,
        responsavel: pegarValor("responsavelAtividade"),
        profissionais: pegarValor("profissionaisEnvolvidos"),
        local: pegarValor("localAtividade"),

        publicoAlvo: pegarValor("publicoAlvo"),
        programa: pegarValor("programaEstrategia"),
        inep: pegarValor("inepEscola"),
        instituicao: pegarValor("instituicaoParceira"),

        recursos: coletarRecursos(),
        participantesIdentificados: coletarParticipantes(),

        descricao: pegarValor("descricaoAtividade"),
        observacoes: pegarValor("observacoesAtividade"),

        criadoEm: new Date().toISOString(),
        criadoPor: localStorage.getItem("usuarioNome") || "Usuário"
    };

    if (!atividade.data) {
        alert("Informe a data da atividade.");
        return;
    }

    if (!atividade.turno) {
        alert("Selecione o turno da atividade.");
        return;
    }

    if (!atividade.tipo) {
        alert("Selecione o tipo da atividade.");
        return;
    }

    if (!atividade.tema) {
        alert("Selecione o tema principal.");
        return;
    }

    if (!atividade.responsavel) {
        alert("Selecione o responsável principal.");
        return;
    }

    atividades.unshift(atividade);

    localStorage.setItem("atividadesColetivasPsiSaude", JSON.stringify(atividades));

    renderizarAtividades(atividades);
    fecharModalAtividade();

    alert("Atividade coletiva salva com sucesso!");
}

function coletarRecursos() {
    const selecionados = [];

    document
        .querySelectorAll(".checkbox-grid input[type='checkbox']:checked")
        .forEach(item => selecionados.push(item.value));

    return selecionados;
}

/* ==========================================
   AÇÕES
========================================== */

function visualizarAtividade(id) {
    const atividade = atividades.find(item => item.id === id);

    if (!atividade) return;

    alert(
        `ATIVIDADE COLETIVA\n\n` +
        `Data: ${formatarData(atividade.data)}\n` +
        `Turno: ${atividade.turno}\n` +
        `Tipo: ${atividade.tipo}\n` +
        `Tema: ${atividade.tema}\n` +
        `Responsável: ${atividade.responsavel}\n` +
        `Participantes: ${atividade.participantes}\n` +
        `Local: ${atividade.local || "-"}\n\n` +
        `Descrição:\n${atividade.descricao || "-"}\n\n` +
        `Observações:\n${atividade.observacoes || "-"}`
    );
}

function editarAtividade(id) {
    const atividade = atividades.find(item => item.id === id);

    if (!atividade) return;

    abrirModalAtividade();

    preencherCampo("dataAtividade", atividade.data);
    preencherCampo("turnoAtividade", atividade.turno);
    preencherCampo("statusAtividade", atividade.status);
    preencherCampo("tipoAtividade", atividade.tipo);
    preencherCampo("temaAtividade", atividade.tema);
    preencherCampo("numeroParticipantes", atividade.participantes);
    preencherCampo("responsavelAtividade", atividade.responsavel);
    preencherCampo("profissionaisEnvolvidos", atividade.profissionais);
    preencherCampo("localAtividade", atividade.local);

    preencherCampo("publicoAlvo", atividade.publicoAlvo);
    preencherCampo("programaEstrategia", atividade.programa);
    preencherCampo("inepEscola", atividade.inep);
    preencherCampo("instituicaoParceira", atividade.instituicao);

    preencherCampo("descricaoAtividade", atividade.descricao);
    preencherCampo("observacoesAtividade", atividade.observacoes);

    limparParticipantes();

    (atividade.participantesIdentificados || []).forEach(p => {
        adicionarParticipante(p.nome, p.vinculo);
    });

    atividades = atividades.filter(item => item.id !== id);

    localStorage.setItem("atividadesColetivasPsiSaude", JSON.stringify(atividades));
}

function excluirAtividade(id) {
    const atividade = atividades.find(item => item.id === id);

    if (!atividade) return;

    const confirmar = confirm(`Deseja excluir a atividade "${atividade.tema}"?`);

    if (!confirmar) return;

    atividades = atividades.filter(item => item.id !== id);

    localStorage.setItem("atividadesColetivasPsiSaude", JSON.stringify(atividades));

    renderizarAtividades(atividades);
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

function formatarData(data) {
    if (!data) return "-";

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function classeStatus(status) {
    if (status === "Realizada") return "realizada";
    if (status === "Planejada") return "planejada";
    if (status === "Cancelada") return "cancelada";

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