const pacientes = [
    {
        nome: "Viridiana Silva",
        idade: "33 anos",
        horaChegada: "11:51",
        horarioAgendado: "13:20",
        tipo: "Agendado",
        profissional: "Igor Gomes",
        status: "Aguardando atendimento",
        cpf: "123.456.789-00",
        cns: "700000000000034",
        meu: true,
        dataAtendimento: "30/05/2026"
    },
    {
        nome: "Ana Beatriz",
        idade: "52 anos",
        horaChegada: "15:46",
        horarioAgendado: "16:00",
        tipo: "Consulta online",
        profissional: "Andressa de Sales Fernandes",
        status: "Aguardando atendimento",
        cpf: "987.654.321-00",
        cns: "700000000000111",
        meu: true,
        dataAtendimento: "30/05/2026"
    },
    {
        nome: "Joana Souza",
        idade: "84 anos",
        horaChegada: "15:47",
        horarioAgendado: "16:30",
        tipo: "Consulta entre profissionais",
        profissional: "Eduardo",
        status: "Em atendimento",
        cpf: "111.222.333-44",
        cns: "700000000000222",
        meu: false,
        dataAtendimento: "30/05/2026"
    }
];

let listaFiltrada = [...pacientes];
let ordenacaoAtual = "chegada-crescente";
let pacienteDeclaracao = null;

let tipoCalendarioAberto = null;

let mesFiltroInicial = new Date().getMonth();
let anoFiltroInicial = new Date().getFullYear();

let mesFiltroFinal = new Date().getMonth();
let anoFiltroFinal = new Date().getFullYear();


function toggleAdicionarPaciente() {
    const area = document.getElementById("areaAdicionarPaciente");
    const icone = document.getElementById("iconeAdd");

    if (!area || !icone) return;

    area.classList.toggle("hidden");
    icone.classList.toggle("fa-chevron-down");
    icone.classList.toggle("fa-chevron-up");
}

function buscarPacienteAdicionar() {
    const termo = document.getElementById("buscaAdicionar").value.toLowerCase();
    const resultado = document.getElementById("resultadoBusca");

    resultado.innerHTML = "";

    if (termo.trim() === "") {
        resultado.style.display = "none";
        return;
    }

    const encontrados = pacientes.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        p.cpf.includes(termo) ||
        p.cns.includes(termo)
    );

    if (encontrados.length === 0) {
        resultado.innerHTML = `
            <div class="resultado-item">
                Nenhum paciente encontrado.
            </div>
        `;
    } else {
        encontrados.forEach(p => {
            resultado.innerHTML += `
                <div class="resultado-item">
                    <strong>${p.nome}</strong><br>
                    CPF ${p.cpf} &nbsp; CNS ${p.cns}<br>
                    <small>${p.idade}</small>
                </div>
            `;
        });
    }

    resultado.style.display = "block";
}

function toggleFiltros() {
    const filtros = document.getElementById("filtrosBox");

    if (filtros) {
        filtros.classList.toggle("hidden");
    }
}

function aplicarFiltros() {
    filtrarLista();

    const filtros = document.getElementById("filtrosBox");

    if (filtros) {
        filtros.classList.add("hidden");
    }
}

function toggleOrdenacao() {
    const menu = document.getElementById("menuOrdenacao");

    if (menu) {
        menu.classList.toggle("hidden");
    }
}

function ordenarPor(tipo) {
    ordenacaoAtual = tipo;

    localStorage.setItem("listaOrdenacao", tipo);

    const textos = {
        "chegada-crescente": "Ordem de chegada crescente",
        "chegada-decrescente": "Ordem de chegada decrescente",
        "nome-az": "Nome do paciente (A → Z)",
        "nome-za": "Nome do paciente (Z → A)",
        "profissional-az": "Profissional (A → Z)",
        "profissional-za": "Profissional (Z → A)",
        "status": "Status"
    };

    const btnOrdenar = document.getElementById("btnOrdenar");

    if (btnOrdenar) {
        btnOrdenar.innerHTML =
            `${textos[tipo]} <i class="fa-solid fa-chevron-down"></i>`;
    }

    const menuOrdenacao = document.getElementById("menuOrdenacao");

    if (menuOrdenacao) {
        menuOrdenacao.classList.add("hidden");
    }

    filtrarLista();
}

function filtrarLista() {
    const pesquisa = document.getElementById("campoPesquisa").value.toLowerCase();
    const somenteMeus = document.getElementById("meusAtendimentos").checked;
    const profissionalFiltro = document.getElementById("filtroProfissional")?.value.toLowerCase() || "";

    const checks = document.querySelectorAll("#filtrosBox input[type='checkbox']");
    const selecionados = Array.from(checks)
        .filter(c => c.checked)
        .map(c => c.value);

    const statusPossiveis = [
        "Aguardando atendimento",
        "Em atendimento",
        "Atendimento realizado",
        "Não aguardou"
    ];

    const tiposPossiveis = [
        "Agendado",
        "Consulta online",
        "Consulta entre profissionais"
    ];

    const statusSelecionados = selecionados.filter(item => statusPossiveis.includes(item));
    const tiposSelecionados = selecionados.filter(item => tiposPossiveis.includes(item));

    const dataInicial = document.getElementById("dataInicial")?.value || "";
    const dataFinal = document.getElementById("dataFinal")?.value || "";

    listaFiltrada = pacientes.filter(paciente => {
        const batePesquisa =
            pesquisa === "" ||
            paciente.nome.toLowerCase().includes(pesquisa) ||
            paciente.cpf.includes(pesquisa) ||
            paciente.cns.includes(pesquisa);

        const bateMeu = !somenteMeus || paciente.meu;

        const bateStatus =
            statusSelecionados.length === 0 ||
            statusSelecionados.includes(paciente.status);

        const bateTipo =
            tiposSelecionados.length === 0 ||
            tiposSelecionados.includes(paciente.tipo);

        const bateProfissional =
            profissionalFiltro === "" ||
            paciente.profissional.toLowerCase().includes(profissionalFiltro);

        const batePeriodo = verificarPeriodo(
            paciente.dataAtendimento,
            dataInicial,
            dataFinal
        );

        return batePesquisa && bateMeu && bateStatus && bateTipo && bateProfissional && batePeriodo;
    });

    salvarPreferenciasLista();
    ordenarLista();
    renderizarLista();
    atualizarResumoFiltros();
    
    const filtros = document.getElementById("filtrosBox");

    if (filtros) {
        filtros.classList.add("hidden");
    }
}

function verificarPeriodo(dataPaciente, dataInicial, dataFinal) {
    if (!dataInicial && !dataFinal) return true;

    const data = converterDataBR(dataPaciente);
    const inicio = dataInicial ? converterDataBR(dataInicial) : null;
    const fim = dataFinal ? converterDataBR(dataFinal) : null;

    if (inicio && data < inicio) return false;
    if (fim && data > fim) return false;

    return true;
}

function converterDataBR(data) {
    const partes = data.split("/");

    return new Date(
        Number(partes[2]),
        Number(partes[1]) - 1,
        Number(partes[0])
    );
}

function salvarPreferenciasLista() {
    const preferencias = {
        pesquisa: document.getElementById("campoPesquisa")?.value || "",
        somenteMeus: document.getElementById("meusAtendimentos")?.checked || false,
        profissional: document.getElementById("filtroProfissional")?.value || "",
        dataInicial: document.getElementById("dataInicial")?.value || "",
        dataFinal: document.getElementById("dataFinal")?.value || "",
        statusTipos: Array.from(
            document.querySelectorAll("#filtrosBox input[type='checkbox']")
        ).map(check => ({
            value: check.value,
            checked: check.checked
        }))
    };

    localStorage.setItem("listaAtendimentoPreferencias", JSON.stringify(preferencias));
}

function carregarPreferenciasLista() {
    const salvas = localStorage.getItem("listaAtendimentoPreferencias");

    if (!salvas) return;

    const preferencias = JSON.parse(salvas);

    const campoPesquisa = document.getElementById("campoPesquisa");
    const meusAtendimentos = document.getElementById("meusAtendimentos");
    const filtroProfissional = document.getElementById("filtroProfissional");
    const dataInicial = document.getElementById("dataInicial");
    const dataFinal = document.getElementById("dataFinal");

    if (campoPesquisa) campoPesquisa.value = preferencias.pesquisa || "";
    if (meusAtendimentos) meusAtendimentos.checked = preferencias.somenteMeus || false;
    if (filtroProfissional) filtroProfissional.value = preferencias.profissional || "";
    if (dataInicial) dataInicial.value = preferencias.dataInicial || "";
    if (dataFinal) dataFinal.value = preferencias.dataFinal || "";

    if (preferencias.statusTipos) {
        preferencias.statusTipos.forEach(item => {
            const check = document.querySelector(
                `#filtrosBox input[type='checkbox'][value="${item.value}"]`
            );

            if (check) {
                check.checked = item.checked;
            }
        });
    }
}

function voltarPadrao() {
    document.getElementById("campoPesquisa").value = "";
    document.getElementById("meusAtendimentos").checked = false;
    document.getElementById("filtroProfissional").value = "";

    const dataInicial = document.getElementById("dataInicial");
    const dataFinal = document.getElementById("dataFinal");

    if (dataInicial) dataInicial.value = "";
    if (dataFinal) dataFinal.value = "";

    document.querySelectorAll("#filtrosBox input[type='checkbox']").forEach(check => {
        check.checked = false;
    });

    ordenacaoAtual = "chegada-crescente";

    const btnOrdenar = document.getElementById("btnOrdenar");

    if (btnOrdenar) {
        btnOrdenar.innerHTML =
            `Ordem de chegada crescente <i class="fa-solid fa-chevron-down"></i>`;
    }

    localStorage.removeItem("listaAtendimentoPreferencias");
    localStorage.setItem("listaOrdenacao", "chegada-crescente");

    listaFiltrada = [...pacientes];

    ordenarLista();
    renderizarLista();
    atualizarResumoFiltrosPadrao();
}

function atualizarResumoFiltrosPadrao() {
    const resumo = document.getElementById("resumoFiltros");

    if (!resumo) return;

    resumo.innerHTML = `
        <strong>Status do atendimento:</strong> Todos |
        <strong>Período:</strong> Todos |
        <strong>Tipo de serviço:</strong> Todos
    `;
}

function atualizarResumoFiltros() {
    const resumo = document.getElementById("resumoFiltros");

    if (!resumo) return;

    const checks = document.querySelectorAll("#filtrosBox input[type='checkbox']");
    const selecionados = Array.from(checks)
        .filter(check => check.checked)
        .map(check => check.value);

    const statusSelecionados = selecionados.filter(item =>
        ["Aguardando atendimento", "Em atendimento", "Atendimento realizado", "Não aguardou"].includes(item)
    );

    const tiposSelecionados = selecionados.filter(item =>
        ["Agendado", "Consulta online", "Consulta entre profissionais"].includes(item)
    );

    const dataInicial = document.getElementById("dataInicial").value;
    const dataFinal = document.getElementById("dataFinal").value;

    let periodo = "Todos";

    if (dataInicial && dataFinal) {
        periodo = `${dataInicial} até ${dataFinal}`;
    } else if (dataInicial) {
        periodo = `A partir de ${dataInicial}`;
    } else if (dataFinal) {
        periodo = `Até ${dataFinal}`;
    }

    resumo.innerHTML = `
        <strong>Status do atendimento:</strong> ${statusSelecionados.length ? statusSelecionados.join(", ") : "Todos"} |
        <strong>Período:</strong> ${periodo} |
        <strong>Tipo de serviço:</strong> ${tiposSelecionados.length ? tiposSelecionados.join(", ") : "Todos"}
    `;
}

function ordenarLista() {
    listaFiltrada.sort((a, b) => {
        if (ordenacaoAtual === "chegada-crescente") {
            return a.horaChegada.localeCompare(b.horaChegada);
        }

        if (ordenacaoAtual === "chegada-decrescente") {
            return b.horaChegada.localeCompare(a.horaChegada);
        }

        if (ordenacaoAtual === "nome-az") {
            return a.nome.localeCompare(b.nome);
        }

        if (ordenacaoAtual === "nome-za") {
            return b.nome.localeCompare(a.nome);
        }

        if (ordenacaoAtual === "profissional-az") {
            return a.profissional.localeCompare(b.profissional);
        }

        if (ordenacaoAtual === "profissional-za") {
            return b.profissional.localeCompare(a.profissional);
        }

        if (ordenacaoAtual === "status") {
            return a.status.localeCompare(b.status);
        }

        return 0;
    });
}

function corStatus(status) {
    if (status === "Aguardando atendimento") return "verde";
    if (status === "Em atendimento") return "roxo";
    if (status === "Atendimento realizado") return "azul";
    if (status === "Não aguardou") return "cinza";
    return "verde";
}

function renderizarLista() {
    const lista = document.getElementById("listaAtendimentos");
    const total = document.getElementById("totalResultados");

    if (!lista || !total) return;

    lista.innerHTML = "";

    listaFiltrada.forEach((paciente, index) => {
        lista.innerHTML += `
            <div class="item-atendimento">
                <div class="barra-status ${corStatus(paciente.status)}"></div>

                <div class="info-hora">
                    <strong>${paciente.horaChegada}</strong>
                    <span>${paciente.status}</span>
                </div>

                <div class="info-paciente">
                    <strong>${paciente.nome}</strong>
                    <span>${paciente.idade}</span>
                </div>

                <div class="area-agendamento">
                    <div class="tipo-servico">
                        <i class="fa-solid fa-calendar-days"></i>
                        ${paciente.horarioAgendado} | ${paciente.tipo}
                    </div>

                    <div class="profissional">
                        ${paciente.profissional}
                    </div>
                </div>

                <div class="acoes">
                    <button onclick="visualizarProntuario(${index})" title="Visualizar prontuário">
                        <i class="fa-solid fa-file-medical"></i>
                    </button>

                    <button onclick="iniciarAtendimento(${index})" title="Iniciar atendimento">
                        <i class="fa-solid fa-play"></i>
                    </button>

                    <button onclick="toggleMenuAcoes(${index})" title="Mais opções">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    <div class="menu-acoes hidden" id="menuAcoes${index}">
                        <div onclick="iniciarAtendimento(${index})">
                            <i class="fa-solid fa-play"></i> Iniciar atendimento
                        </div>

                        <div onclick="pacienteNaoAguardou(${index})">
                            <i class="fa-solid fa-user-xmark"></i> Paciente não aguardou
                        </div>

                        <div onclick="abrirDeclaracao(${index})">
                            <i class="fa-solid fa-file-lines"></i> Gerar declaração de comparecimento
                        </div>

                        <div onclick="visualizarProntuario(${index})">
                            <i class="fa-solid fa-file-medical"></i> Visualizar prontuário
                        </div>

                        <div onclick="visualizarAtendimentosDia(${index})">
                            <i class="fa-solid fa-calendar-day"></i> Visualizar atendimentos do dia
                        </div>

                        <div onclick="editarPaciente(${index})">
                            <i class="fa-solid fa-pen"></i> Editar
                        </div>

                        <div class="danger" onclick="excluirPaciente(${index})">
                            <i class="fa-solid fa-trash-can"></i> Excluir
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    total.innerText = `${listaFiltrada.length} resultado${listaFiltrada.length !== 1 ? "s" : ""}`;
}

function toggleMenuAcoes(index) {
    document.querySelectorAll(".menu-acoes").forEach(menu => {
        if (menu.id !== `menuAcoes${index}`) {
            menu.classList.add("hidden");
        }
    });

    const menuAtual = document.getElementById(`menuAcoes${index}`);

    if (menuAtual) {
        menuAtual.classList.toggle("hidden");
    }
}

function visualizarProntuario(index) {

    const paciente = listaFiltrada[index];

    localStorage.setItem(
        "pacienteSelecionado",
        JSON.stringify(paciente)
    );

    localStorage.setItem(
        "pacienteProntuario",
        JSON.stringify(paciente)
    );

    window.location.href = "visualizar-prontuario.html";
}

function iniciarAtendimento(index) {
    const paciente = listaFiltrada[index];

    paciente.status = "Em atendimento";

    localStorage.setItem(
        "pacienteAtendimento",
        JSON.stringify(paciente)
    );

    window.location.href = "atendimento.html";
}

function pacienteNaoAguardou(index) {
    const paciente = listaFiltrada[index];

    paciente.status = "Não aguardou";

    filtrarLista();
}

function visualizarAtendimentosDia(index) {
    alert("Visualizar atendimentos do dia de " + listaFiltrada[index].nome);
}

function editarPaciente(index) {
    alert("Editar atendimento de " + listaFiltrada[index].nome);
}

function excluirPaciente(index) {
    if (confirm("Deseja excluir este atendimento?")) {
        const paciente = listaFiltrada[index];
        const posicaoOriginal = pacientes.indexOf(paciente);

        if (posicaoOriginal > -1) {
            pacientes.splice(posicaoOriginal, 1);
        }

        filtrarLista();
    }
}

function abrirDeclaracao(index) {
    pacienteDeclaracao = listaFiltrada[index];

    document.getElementById("nomeDeclaracao").innerText = pacienteDeclaracao.nome;
    document.getElementById("cpfDeclaracao").innerText = pacienteDeclaracao.cpf;
    document.getElementById("cnsDeclaracao").innerText = pacienteDeclaracao.cns;

    document.getElementById("modalDeclaracao").classList.add("active");
}

function fecharDeclaracao() {
    document.getElementById("modalDeclaracao").classList.remove("active");
}

function gerarDeclaracao() {
    if (!pacienteDeclaracao) return;

    alert("Declaração de comparecimento gerada para " + pacienteDeclaracao.nome);

    fecharDeclaracao();
}

function limparPesquisa() {
    document.getElementById("campoPesquisa").value = "";
}

function carregarPreferenciasUsuario() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar && localStorage.getItem("sidebarClosed") === "true") {
        sidebar.classList.add("closed");
    }
}

/* CALENDÁRIO */

function fecharCalendariosFiltro() {
    const calendarioInicial = document.getElementById("calendarioInicial");
    const calendarioFinal = document.getElementById("calendarioFinal");

    if (calendarioInicial) calendarioInicial.classList.add("closed");
    if (calendarioFinal) calendarioFinal.classList.add("closed");
}

function toggleCalendarioFiltro(event, tipo) {
    event.stopPropagation();

    tipoCalendarioAberto = tipo;

    const calendarioInicial = document.getElementById("calendarioInicial");
    const calendarioFinal = document.getElementById("calendarioFinal");

    if (!calendarioInicial || !calendarioFinal) return;

    if (tipo === "inicial") {
        calendarioFinal.classList.add("closed");
        calendarioInicial.classList.toggle("closed");
        renderizarCalendarioFiltro("inicial");
    }

    if (tipo === "final") {
        calendarioInicial.classList.add("closed");
        calendarioFinal.classList.toggle("closed");
        renderizarCalendarioFiltro("final");
    }
}

function renderizarCalendarioFiltro(tipo) {
    const idCalendario = tipo === "inicial" ? "calendarioInicial" : "calendarioFinal";
    const calendario = document.getElementById(idCalendario);

    if (!calendario) return;

    const mesAtual = tipo === "inicial" ? mesFiltroInicial : mesFiltroFinal;
    const anoAtual = tipo === "inicial" ? anoFiltroInicial : anoFiltroFinal;

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    calendario.innerHTML = `
        <div class="mini-calendar-box" onclick="event.stopPropagation()">
            <div class="mini-calendar-header">
                <button type="button" onclick="selecionarHojeFiltro(event, '${tipo}')">Hoje</button>

                <i class="fa-solid fa-chevron-left" onclick="mudarMesFiltro(event, '${tipo}', -1)"></i>

                <strong>${meses[mesAtual]} ${anoAtual}</strong>

                <i class="fa-solid fa-chevron-right" onclick="mudarMesFiltro(event, '${tipo}', 1)"></i>
            </div>

            <div class="mini-week-days">
                <span>D</span>
                <span>S</span>
                <span>T</span>
                <span>Q</span>
                <span>Q</span>
                <span>S</span>
                <span>S</span>
            </div>

            <div class="mini-days" id="diasFiltroCalendario${tipo}"></div>
        </div>
    `;

    const dias = document.getElementById(`diasFiltroCalendario${tipo}`);

    if (!dias) return;

    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);

    const inicio = primeiroDia.getDay();
    const total = ultimoDia.getDate();

    for (let i = 0; i < inicio; i++) {
        dias.innerHTML += `<div></div>`;
    }

    for (let dia = 1; dia <= total; dia++) {
        let classe = "mini-day";
        const hoje = new Date();

        if (
            dia === hoje.getDate() &&
            mesAtual === hoje.getMonth() &&
            anoAtual === hoje.getFullYear()
        ) {
            classe += " today";
        }

        dias.innerHTML += `
            <div class="${classe}" onclick="selecionarDataFiltro(event, '${tipo}', ${dia})">
                ${dia}
            </div>
        `;
    }
}

function mudarMesFiltro(event, tipo, valor) {
    event.stopPropagation();

    if (tipo === "inicial") {
        mesFiltroInicial += valor;

        if (mesFiltroInicial < 0) {
            mesFiltroInicial = 11;
            anoFiltroInicial--;
        }

        if (mesFiltroInicial > 11) {
            mesFiltroInicial = 0;
            anoFiltroInicial++;
        }
    }

    if (tipo === "final") {
        mesFiltroFinal += valor;

        if (mesFiltroFinal < 0) {
            mesFiltroFinal = 11;
            anoFiltroFinal--;
        }

        if (mesFiltroFinal > 11) {
            mesFiltroFinal = 0;
            anoFiltroFinal++;
        }
    }

    renderizarCalendarioFiltro(tipo);
}

function selecionarDataFiltro(event, tipo, dia) {
    event.stopPropagation();

    const mesAtual = tipo === "inicial" ? mesFiltroInicial : mesFiltroFinal;
    const anoAtual = tipo === "inicial" ? anoFiltroInicial : anoFiltroFinal;

    const data = new Date(anoAtual, mesAtual, dia);
    const dataFormatada = data.toLocaleDateString("pt-BR");

    if (tipo === "inicial") {
        document.getElementById("dataInicial").value = dataFormatada;
        document.getElementById("calendarioInicial").classList.add("closed");
    }

    if (tipo === "final") {
        document.getElementById("dataFinal").value = dataFormatada;
        document.getElementById("calendarioFinal").classList.add("closed");
    }
}

function selecionarHojeFiltro(event, tipo) {
    event.stopPropagation();

    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR");

    if (tipo === "inicial") {
        mesFiltroInicial = hoje.getMonth();
        anoFiltroInicial = hoje.getFullYear();

        document.getElementById("dataInicial").value = dataFormatada;
        document.getElementById("calendarioInicial").classList.add("closed");
    }

    if (tipo === "final") {
        mesFiltroFinal = hoje.getMonth();
        anoFiltroFinal = hoje.getFullYear();

        document.getElementById("dataFinal").value = dataFormatada;
        document.getElementById("calendarioFinal").classList.add("closed");
    }
}

/* INICIALIZAÇÃO */

if (window.location.pathname.includes("lista-atendimento.html")) {
    const usuarioLogado = localStorage.getItem("usuario");

    if (!usuarioLogado) {
        window.location.href = "login.html";
    }

    carregarPreferenciasUsuario();

    const nomeUsuario = localStorage.getItem("usuarioNome") || "Andressa de Sales Fernandes";
    const cargoUsuario = localStorage.getItem("usuarioCargo") || "Administrador(a)";

    document.getElementById("nomeUsuarioTopo").innerText = nomeUsuario;
    document.getElementById("cargoUsuarioTopo").innerText = cargoUsuario;

    voltarPadrao();
}