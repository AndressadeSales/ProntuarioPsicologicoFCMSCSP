
/* =====================================================
   DADOS
===================================================== */

const profissionais = [
    {
        nome: "Andressa de Sales Adm",
        cargo: "Administrador(a)",
        equipe: "Administração"
    },
    {
        nome: "Psicóloga Ana Beatriz",
        cargo: "Psicóloga Clínica",
        equipe: "Equipe Saúde Mental"
    },
    {
        nome: "Psicólogo Carlos Henrique",
        cargo: "Psicologia Hospitalar",
        equipe: "Equipe CAPS"
    },
    {
        nome: "Psicóloga Fernanda Souza",
        cargo: "Neuropsicologia",
        equipe: "Equipe Ambulatório"
    }
];

let profissionalAtual = profissionais[0];

let agendas = {
    "Andressa de Sales Adm": {},
    "Psicóloga Ana Beatriz": {},
    "Psicólogo Carlos Henrique": {},
    "Psicóloga Fernanda Souza": {}
};

let configuracoesAgenda = {
    "Andressa de Sales Adm": {
        inicio: "07:00",
        fim: "18:00",
        intervalo: 60,
        almocoInicio: "12:00",
        almocoFim: "13:00"
    },
    "Psicóloga Ana Beatriz": {
        inicio: "08:00",
        fim: "17:00",
        intervalo: 60,
        almocoInicio: "12:00",
        almocoFim: "13:00"
    },
    "Psicólogo Carlos Henrique": {
        inicio: "08:00",
        fim: "17:00",
        intervalo: 30,
        almocoInicio: "12:00",
        almocoFim: "13:00"
    },
    "Psicóloga Fernanda Souza": {
        inicio: "09:00",
        fim: "18:00",
        intervalo: 40,
        almocoInicio: "12:00",
        almocoFim: "13:00"
    }
};

function agendaAtual() {
    return agendas[profissionalAtual.nome];
}

function configAtual() {
    return configuracoesAgenda[profissionalAtual.nome];
}

function chaveData() {
    return dataSelecionada.toLocaleDateString("pt-BR");
}

function agendaDoDia() {
    const agenda = agendaAtual();
    const data = chaveData();

    if (!agenda[data]) {
        agenda[data] = {};
    }

    return agenda[data];
}


/* =====================================================
   PROFISSIONAIS
===================================================== */

function carregarProfissionais() {
    const lista = document.getElementById("listaProfissionais");

    if (!lista) return;

    lista.innerHTML = "";

    profissionais.forEach(profissional => {
        lista.innerHTML += `
            <div class="professional-item" onclick="selecionarProfissional('${profissional.nome}')">
                <strong>${profissional.nome}</strong><br>
                <span>${profissional.cargo}</span><br>
                <small>${profissional.equipe}</small>
            </div>
        `;
    });
}

function selecionarProfissional(nome) {
    const encontrado = profissionais.find(p => p.nome === nome);

    if (!encontrado) return;

    profissionalAtual = encontrado;

    document.getElementById("campoProfissional").value = profissionalAtual.nome;

    document.getElementById("infoProfissional").innerHTML =
        `<strong>${profissionalAtual.cargo}</strong> | ${profissionalAtual.equipe}`;

    const lista = document.getElementById("listaProfissionais");
    const seta = document.getElementById("setaProfissionais");

    if (lista) lista.classList.add("closed");
    if (seta) seta.classList.add("rotated");

    gerarDropdownHorarios();
    gerarAgenda();
}

function toggleProfissionais() {
    document.getElementById("listaProfissionais").classList.toggle("closed");
    document.getElementById("setaProfissionais").classList.toggle("rotated");
}

/* =====================================================
   CALENDÁRIO PRINCIPAL
===================================================== */

let dataSelecionada = new Date();
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

function renderizarCalendario() {
    const mesAno = document.getElementById("mesAnoCalendario");
    const dias = document.getElementById("diasCalendario");

    if (!mesAno || !dias) return;

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    mesAno.innerText = `${meses[mesAtual]} ${anoAtual}`;
    dias.innerHTML = "";

    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);

    const inicio = primeiroDia.getDay();
    const total = ultimoDia.getDate();

    for (let i = 0; i < inicio; i++) {
        dias.innerHTML += `<div></div>`;
    }

    for (let i = 1; i <= total; i++) {
        let classe = "calendar-day";
        const hoje = new Date();

        if (
            i === hoje.getDate() &&
            mesAtual === hoje.getMonth() &&
            anoAtual === hoje.getFullYear()
        ) {
            classe += " today";
        }

        if (
            i === dataSelecionada.getDate() &&
            mesAtual === dataSelecionada.getMonth() &&
            anoAtual === dataSelecionada.getFullYear()
        ) {
            classe += " selected";
        }

        dias.innerHTML += `
            <div class="${classe}" onclick="selecionarDia(${i})">
                ${i}
            </div>
        `;
    }
}

function selecionarDia(dia) {
    dataSelecionada = new Date(anoAtual, mesAtual, dia);

    atualizarTitulo();
    renderizarCalendario();
    gerarAgenda();
}

function mudarMes(valor) {
    mesAtual += valor;

    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }

    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }

    renderizarCalendario();
}

function mudarDia(valor) {
    dataSelecionada.setDate(dataSelecionada.getDate() + valor);

    mesAtual = dataSelecionada.getMonth();
    anoAtual = dataSelecionada.getFullYear();

    atualizarTitulo();
    renderizarCalendario();
    gerarAgenda();
}

function irParaHoje() {
    const hoje = new Date();

    dataSelecionada = hoje;
    mesAtual = hoje.getMonth();
    anoAtual = hoje.getFullYear();

    atualizarTitulo();
    renderizarCalendario();
    gerarAgenda();
}

function atualizarTitulo() {
    const titulo = document.getElementById("dataAtual");

    if (!titulo) return;

    titulo.innerText = dataSelecionada.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

/* =====================================================
   MINI CALENDÁRIO DO MODAL
===================================================== */

function toggleMiniCalendario() {
    const mini = document.getElementById("miniCalendario");

    if (!mini) return;

    mini.classList.toggle("closed");
    renderizarMiniCalendario();
}

function renderizarMiniCalendario() {
    const mini = document.getElementById("miniCalendario");

    if (!mini) return;

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    mini.innerHTML = `
        <div class="mini-calendar-box">
            <div class="mini-calendar-header">
                <button type="button" onclick="selecionarHojeMini()">Hoje</button>
                <i class="fa-solid fa-chevron-left" onclick="mudarMesMini(-1)"></i>
                <strong>${meses[mesAtual]} ${anoAtual}</strong>
                <i class="fa-solid fa-chevron-right" onclick="mudarMesMini(1)"></i>
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

            <div class="mini-days" id="miniDiasCalendario"></div>
        </div>
    `;

    const dias = document.getElementById("miniDiasCalendario");

    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);

    const inicio = primeiroDia.getDay();
    const total = ultimoDia.getDate();

    for (let i = 0; i < inicio; i++) {
        dias.innerHTML += `<div></div>`;
    }

    for (let i = 1; i <= total; i++) {
        let classe = "mini-day";
        const hoje = new Date();

        if (
            i === hoje.getDate() &&
            mesAtual === hoje.getMonth() &&
            anoAtual === hoje.getFullYear()
        ) {
            classe += " today";
        }

        if (
            i === dataSelecionada.getDate() &&
            mesAtual === dataSelecionada.getMonth() &&
            anoAtual === dataSelecionada.getFullYear()
        ) {
            classe += " selected";
        }

        dias.innerHTML += `
            <div class="${classe}" onclick="selecionarDataMini(${i})">
                ${i}
            </div>
        `;
    }
}

function selecionarDataMini(dia) {
    dataSelecionada = new Date(anoAtual, mesAtual, dia);

    document.getElementById("modalData").value =
        dataSelecionada.toLocaleDateString("pt-BR");

    document.getElementById("miniCalendario").classList.add("closed");

    atualizarTitulo();
    renderizarCalendario();
    gerarAgenda();
}

function mudarMesMini(valor) {
    mesAtual += valor;

    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }

    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }

    renderizarMiniCalendario();
}

function selecionarHojeMini() {
    const hoje = new Date();

    dataSelecionada = hoje;
    mesAtual = hoje.getMonth();
    anoAtual = hoje.getFullYear();

    document.getElementById("modalData").value =
        hoje.toLocaleDateString("pt-BR");

    renderizarMiniCalendario();
    atualizarTitulo();
    renderizarCalendario();
    gerarAgenda();
}

/* =====================================================
   CONVERSÃO DE HORÁRIOS
===================================================== */

function horarioParaMinutos(horario) {
    const partes = horario.split(":");
    return Number(partes[0]) * 60 + Number(partes[1]);
}

function minutosParaHorario(minutos) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;

    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

function gerarListaHorarios(inicio, fim, intervalo) {
    const lista = [];
    const minInicio = horarioParaMinutos(inicio);
    const minFim = horarioParaMinutos(fim);

    for (let atual = minInicio; atual <= minFim; atual += intervalo) {
        lista.push(minutosParaHorario(atual));
    }

    return lista;
}

function calcularHorarioFinal(horario) {
    const config = configAtual();
    const final = horarioParaMinutos(horario) + config.intervalo;

    return minutosParaHorario(final);
}

function horarioEhAlmoco(horario) {
    const config = configAtual();

    const hora = horarioParaMinutos(horario);
    const inicio = horarioParaMinutos(config.almocoInicio);
    const fim = horarioParaMinutos(config.almocoFim);

    return hora >= inicio && hora < fim;
}

/* =====================================================
   DROPDOWNS DE HORÁRIO
===================================================== */

function gerarDropdownHorarios() {
    const config = configAtual();

    const listaAgenda = gerarListaHorarios(config.inicio, config.fim, config.intervalo);
    const listaGeral = gerarListaHorarios("06:00", "22:00", 15);

    preencherDropdownHorario("dropdownHorarioInicial", "modalHorario", listaAgenda);
    preencherDropdownHorario("dropdownHorarioFinal", "modalHorarioFinal", listaAgenda);

    preencherDropdownHorario("dropdownInicioAgenda", "configInicioAgenda", listaGeral);
    preencherDropdownHorario("dropdownFimAgenda", "configFimAgenda", listaGeral);
    preencherDropdownHorario("dropdownInicioAlmoco", "configInicioAlmoco", listaGeral);
    preencherDropdownHorario("dropdownFimAlmoco", "configFimAlmoco", listaGeral);
}

function preencherDropdownHorario(idDropdown, idCampo, lista) {
    const dropdown = document.getElementById(idDropdown);

    if (!dropdown) return;

    dropdown.innerHTML = "";

    lista.forEach(horario => {
        dropdown.innerHTML += `
            <div onclick="selecionarHorario('${idCampo}', '${horario}')">
                ${horario}
            </div>
        `;
    });
}

function toggleDropdownHorario(id) {
    const dropdown = document.getElementById(id);

    if (!dropdown) return;

    document.querySelectorAll(".time-dropdown").forEach(item => {
        if (item.id !== id) {
            item.classList.add("closed");
        }
    });

    dropdown.classList.toggle("closed");
}

function selecionarHorario(campo, valor) {
    const input = document.getElementById(campo);

    if (input) {
        input.value = valor;
    }

    document.querySelectorAll(".time-dropdown").forEach(drop => {
        drop.classList.add("closed");
    });

    if (campo === "modalHorario") {
        const final = document.getElementById("modalHorarioFinal");

        if (final) {
            final.value = calcularHorarioFinal(valor);
        }
    }
}

function limparHorario(campo) {
    const input = document.getElementById(campo);

    if (input) {
        input.value = "";
    }
}

function selecionarIntervalo(valor) {
    const input = document.getElementById("configIntervalo");

    if (input) {
        input.value = valor;
    }

    const dropdown = document.getElementById("dropdownIntervalo");

    if (dropdown) {
        dropdown.classList.add("closed");
    }
}

/* =====================================================
   MODAL AGENDAMENTO
===================================================== */

let horarioSelecionado = "";
let tipoSelecionado = "Consulta";
let tipoAtendimentoSelecionado = "Consulta presencial";
let cancelandoHorario = null;

function abrirModalAgendamento(horario) {
    if (horarioEhAlmoco(horario)) {
        abrirMensagem("Horário bloqueado", "Este horário está bloqueado para almoço.");
        return;
    }

    const item = agendaDoDia()[horario];

    if (item) {
        abrirMensagem("Horário indisponível", "Este horário não está disponível para agendamento.");
        return;
    }

    horarioSelecionado = horario;
    tipoSelecionado = "Consulta";
    tipoAtendimentoSelecionado = "Consulta presencial";

    document.getElementById("tituloModal").innerText = "Novo agendamento";
    document.getElementById("modalHorario").value = horario;
    document.getElementById("modalHorarioFinal").value = calcularHorarioFinal(horario);
    document.getElementById("modalData").value = chaveData();

    limparCamposModal();

    document.querySelectorAll(".tipo-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(".tipo-btn").classList.add("active");

    atualizarFormularioPorTipo();

    document.getElementById("modalAgendamento").classList.add("active");
}

function fecharModalAgendamento() {
    document.getElementById("modalAgendamento").classList.remove("active");
}

function limparCamposModal() {
    const campos = [
        "modalCidadao",
        "modalTelefone",
        "modalEmail",
        "modalProfissionalConvidado",
        "modalEmailProfissional",
        "modalCidadaoEntre",
        "modalTelefoneEntre",
        "modalObservacoes"
    ];

    campos.forEach(id => {
        const campo = document.getElementById(id);

        if (campo) {
            campo.value = "";
        }
    });

    const contador = document.getElementById("contadorObservacoes");

    if (contador) {
        contador.innerText = 0;
    }

    const tipoAtendimento = document.getElementById("textoTipoAtendimento");

    if (tipoAtendimento) {
        tipoAtendimento.innerText = "Consulta presencial";
    }

    const imprimir = document.getElementById("modalImprimir");

    if (imprimir) {
        imprimir.checked = true;
    }

    const motivo = document.querySelector("input[name='motivoReserva'][value='Reunião']");

    if (motivo) {
        motivo.checked = true;
    }
}

function selecionarTipo(botao, tipo) {
    tipoSelecionado = tipo;

    document.querySelectorAll(".tipo-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    botao.classList.add("active");

    atualizarFormularioPorTipo();
}

function atualizarFormularioPorTipo() {
    const camposConsulta = document.getElementById("camposConsulta");
    const camposReserva = document.getElementById("camposReserva");
    const camposEntre = document.getElementById("camposEntreProfissionais");
    const areaTipo = document.getElementById("areaTipoAtendimento");
    const imprimir = document.getElementById("areaImprimirComprovante");

    if (!camposConsulta || !camposReserva || !camposEntre || !areaTipo || !imprimir) return;

    camposConsulta.classList.add("hidden");
    camposReserva.classList.add("hidden");
    camposEntre.classList.add("hidden");
    areaTipo.classList.add("hidden");
    imprimir.classList.remove("hidden");

    if (tipoSelecionado === "Consulta") {
        camposConsulta.classList.remove("hidden");
        areaTipo.classList.remove("hidden");
    }

    if (tipoSelecionado === "Reserva") {
        camposReserva.classList.remove("hidden");
        imprimir.classList.add("hidden");
    }

    if (tipoSelecionado === "Entre profissionais") {
        camposEntre.classList.remove("hidden");
        areaTipo.classList.remove("hidden");
    }
}

function toggleTipoAtendimento() {
    document.getElementById("opcoesTipoAtendimento").classList.toggle("closed");
}

function selecionarTipoAtendimento(tipo) {
    tipoAtendimentoSelecionado = tipo;

    document.getElementById("textoTipoAtendimento").innerText = tipo;
    document.getElementById("opcoesTipoAtendimento").classList.add("closed");
}

function toggleAreaCidadao() {
    document.getElementById("areaCidadaoEntreProfissionais").classList.toggle("hidden");
}

/* =====================================================
   SALVAR AGENDAMENTO
===================================================== */

function salvarAgendamento() {
    const agenda = agendaDoDia();

    const horarioInicial = document.getElementById("modalHorario").value;
    const horarioFinal = document.getElementById("modalHorarioFinal").value;
    const observacoes = document.getElementById("modalObservacoes").value;

    if (horarioInicial === "") {
        abrirMensagem("Atenção", "Informe o horário inicial.");
        return;
    }

    if (horarioEhAlmoco(horarioInicial)) {
        abrirMensagem("Horário bloqueado", "Não é possível agendar no horário de almoço.");
        return;
    }

    const agora = new Date();

    const dadosBase = {
        tipo: tipoSelecionado,
        observacoes: observacoes,
        criadoEm: agora.toLocaleDateString("pt-BR"),
        criadoHora: agora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        }),
        criadoPor: localStorage.getItem("usuarioNome") || "Usuário",
        criadoCargo: localStorage.getItem("usuarioCargo") || "Função não informada"
    };

    if (tipoSelecionado === "Consulta") {
        const cidadao = document.getElementById("modalCidadao").value.trim();

        if (cidadao === "") {
            abrirMensagem("Atenção", "Informe o cidadão.");
            return;
        }

        agenda[horarioInicial] = {
            ...dadosBase,
            titulo: cidadao,
            telefone: document.getElementById("modalTelefone").value,
            email: document.getElementById("modalEmail").value,
            tipoAtendimento: document.getElementById("textoTipoAtendimento").innerText,
            status: "Agendado",
            horarioInicial: horarioInicial,
            horarioFinal: horarioFinal || calcularHorarioFinal(horarioInicial)
        };
    }

    if (tipoSelecionado === "Entre profissionais") {
        const profissional = document.getElementById("modalProfissionalConvidado").value.trim();

        if (profissional === "") {
            abrirMensagem("Atenção", "Informe o profissional convidado.");
            return;
        }

        agenda[horarioInicial] = {
            ...dadosBase,
            titulo: profissional,
            telefone: document.getElementById("modalTelefoneEntre").value,
            email: document.getElementById("modalEmailProfissional").value,
            tipoAtendimento: document.getElementById("textoTipoAtendimento").innerText,
            status: "Agendado",
            horarioInicial: horarioInicial,
            horarioFinal: horarioFinal || calcularHorarioFinal(horarioInicial)
        };
    }

    if (tipoSelecionado === "Reserva") {
        if (horarioFinal === "") {
            abrirMensagem("Atenção", "Informe o horário final.");
            return;
        }

        const inicio = horarioParaMinutos(horarioInicial);
        const fim = horarioParaMinutos(horarioFinal);

        if (fim <= inicio) {
            abrirMensagem("Atenção", "O horário final precisa ser maior que o horário inicial.");
            return;
        }

        const motivo = document.querySelector("input[name='motivoReserva']:checked").value;
        const config = configAtual();

        for (let atual = inicio; atual < fim; atual += config.intervalo) {
            const hora = minutosParaHorario(atual);

            if (horarioEhAlmoco(hora)) {
                continue;
            }

            agenda[hora] = {
                ...dadosBase,
                tipo: "Reserva",
                motivo: motivo,
                titulo: motivo,
                horarioInicial: horarioInicial,
                horarioFinal: horarioFinal
            };
        }
    }

    fecharModalAgendamento();
    gerarAgenda();

    if (tipoSelecionado !== "Reserva" && document.getElementById("modalImprimir").checked) {
        abrirMensagem("Comprovante", "Comprovante de agendamento gerado com sucesso.");
    } else {
        abrirMensagem("Sucesso", "Agendamento salvo com sucesso.");
    }
}

/* =====================================================
   GERAR AGENDA
===================================================== */

function gerarAgenda() {
    const agendaElemento = document.getElementById("agendaHorarios");

    if (!agendaElemento) return;

    const agenda = agendaDoDia();
    const config = configAtual();
    const horarios = gerarListaHorarios(config.inicio, config.fim, config.intervalo);

    agendaElemento.innerHTML = "";

    horarios.forEach(horario => {
        const item = agenda[horario];
        let html = "";

        if (horarioEhAlmoco(horario)) {
            html = criarCardAlmoco();
        } else if (item) {
            if (item.tipo === "Reserva") {
                html = criarCardReserva(horario, item);
            } else {
                html = criarCardAgendamento(horario, item);
            }
        } else {
            html = `
                <div class="add" onclick="abrirModalAgendamento('${horario}')">
                    <i class="fa-solid fa-plus"></i>
                    Adicionar agendamento
                </div>
            `;
        }

        agendaElemento.innerHTML += `
            <div class="time-row">
                <span>${horario}</span>
                <div class="time-content">
                    ${html}
                </div>
            </div>
        `;
    });
}

function criarCardAlmoco() {
    const config = configAtual();

    return `
        <div class="horario-almoco">
            <strong>
                <i class="fa-solid fa-lock"></i>
                Horário bloqueado para almoço
            </strong>
            <small>${config.almocoInicio} até ${config.almocoFim}</small>
        </div>
    `;
}

function criarCardAgendamento(horario, item) {
    return `
        <div class="appointment">
            <div class="appointment-header">
                <div>
                    <strong class="nome-cidadao" onclick="visualizarAgendamento('${horario}')">
                        ${item.titulo}
                    </strong>

                    <div>${item.tipo} - ${item.horarioInicial || horario} até ${item.horarioFinal || calcularHorarioFinal(horario)}</div>

                    <small>${item.tipoAtendimento || ""}</small>

                    <br>

                    <span class="status ${item.status === "Paciente não aguardou" ? "nao-aguardou" : ""}">
                        ${item.status}
                    </span>

                    <div class="registro-info">
                        Adicionado em ${item.criadoEm} às ${item.criadoHora}
                        por <strong>${item.criadoPor}</strong> | ${item.criadoCargo}
                    </div>
                </div>

                <div class="appointment-actions">
                    <button onclick="visualizarProntuario('${horario}')" title="Visualizar prontuário">
                        <i class="fa-solid fa-user-magnifying-glass"></i>
                    </button>

                    <button onclick="adicionarListaAtendimento('${horario}')" title="Adicionar cidadão na lista de atendimentos">
                        <i class="fa-solid fa-clipboard-check"></i>
                    </button>

                    <button onclick="informarFalta('${horario}')" title="Informar falta do cidadão">
                        <i class="fa-solid fa-user-xmark"></i>
                    </button>

                    <button onclick="abrirCancelamento('${horario}')" title="Cancelar agendamento">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function criarCardReserva(horario, item) {
    return `
        <div class="reserva-card">
            <strong>
                <i class="fa-solid fa-bookmark"></i>
                ${item.motivo}
            </strong>

            <small>
                ${item.horarioInicial} até ${item.horarioFinal}
                ${item.observacoes ? `| Observações: ${item.observacoes}` : ""}
            </small>

            <div class="reserva-actions">
                <button onclick="abrirCancelamento('${horario}')" title="Excluir reserva">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
    `;
}

/* =====================================================
   VISUALIZAR / AÇÕES
===================================================== */

function visualizarAgendamento(horario) {
    const item = agendaDoDia()[horario];

    if (!item) return;

    document.getElementById("conteudoVisualizacao").innerHTML = `
        <div class="visual-card">
            <h3>${item.titulo}</h3>
            <p><strong>Tipo:</strong> ${item.tipo}</p>
            <p><strong>Data:</strong> ${chaveData()}</p>
            <p><strong>Horário:</strong> ${item.horarioInicial || horario} até ${item.horarioFinal || calcularHorarioFinal(horario)}</p>
            <p><strong>Atendimento:</strong> ${item.tipoAtendimento || "Não se aplica"}</p>
            <p><strong>Telefone:</strong> ${item.telefone || "Não informado"}</p>
            <p><strong>E-mail:</strong> ${item.email || "Não informado"}</p>
            <p><strong>Observações:</strong> ${item.observacoes || "Nenhuma"}</p>
            <p><strong>Adicionado em:</strong> ${item.criadoEm} às ${item.criadoHora}</p>
            <p><strong>Por:</strong> ${item.criadoPor} | ${item.criadoCargo}</p>
        </div>
    `;

    document.getElementById("modalVisualizar").classList.add("active");
}

function fecharModalVisualizar() {
    document.getElementById("modalVisualizar").classList.remove("active");
}

function imprimirComprovanteVisualizacao() {
    fecharModalVisualizar();
    abrirMensagem("Comprovante", "Comprovante enviado para impressão.");
}

function visualizarProntuario(horario) {
    const item = agendaDoDia()[horario];

    if (!item) return;

    abrirMensagem("Prontuário", "Visualizar prontuário de: " + item.titulo);
}

function adicionarListaAtendimento(horario) {
    const item = agendaDoDia()[horario];

    if (!item) return;

    item.status = "Na lista de atendimentos";
    gerarAgenda();

    abrirMensagem("Lista de atendimentos", "Cidadão adicionado na lista de atendimentos.");
}

function informarFalta(horario) {
    const item = agendaDoDia()[horario];

    if (!item) return;

    item.status = "Paciente não aguardou";
    gerarAgenda();

    abrirMensagem("Falta registrada", "Falta do cidadão registrada.");
}

/* =====================================================
   CANCELAMENTO
===================================================== */

function abrirCancelamento(horario) {
    cancelandoHorario = horario;

    document.getElementById("justificativaCancelamento").value = "";
    document.getElementById("erroJustificativa").innerText = "";
    document.getElementById("modalCancelamento").classList.add("active");
}

function fecharModalCancelamento() {
    document.getElementById("modalCancelamento").classList.remove("active");
}

function confirmarCancelamento() {
    const justificativa = document.getElementById("justificativaCancelamento").value.trim();

    if (justificativa === "") {
        document.getElementById("erroJustificativa").innerText = "Justificativa obrigatória.";
        return;
    }

    const item = agendaDoDia()[cancelandoHorario];

    if (item && item.tipo === "Reserva") {
        excluirReservaCompleta(item);
    } else {
        delete agendaDoDia()[cancelandoHorario];
    }

    fecharModalCancelamento();
    gerarAgenda();

    abrirMensagem("Cancelamento", "Registro cancelado com sucesso.");
}

function excluirReservaCompleta(reserva) {
    const agenda = agendaDoDia();
    const config = configAtual();

    const inicio = horarioParaMinutos(reserva.horarioInicial);
    const fim = horarioParaMinutos(reserva.horarioFinal);

    for (let atual = inicio; atual < fim; atual += config.intervalo) {
        const hora = minutosParaHorario(atual);

        if (
            agenda[hora] &&
            agenda[hora].tipo === "Reserva" &&
            agenda[hora].horarioInicial === reserva.horarioInicial &&
            agenda[hora].horarioFinal === reserva.horarioFinal
        ) {
            delete agenda[hora];
        }
    }
}

/* =====================================================
   CONFIGURAÇÃO DA AGENDA
===================================================== */

function abrirConfiguracaoAgenda() {
    const config = configAtual();

    document.getElementById("textoConfiguracaoAgenda").innerText =
        `Configuração da agenda de ${profissionalAtual.nome}`;

    document.getElementById("configInicioAgenda").value = config.inicio;
    document.getElementById("configFimAgenda").value = config.fim;
    document.getElementById("configIntervalo").value = config.intervalo + " min";
    document.getElementById("configInicioAlmoco").value = config.almocoInicio;
    document.getElementById("configFimAlmoco").value = config.almocoFim;

    gerarDropdownHorarios();

    document.getElementById("modalConfiguracaoAgenda").classList.add("active");
}

function fecharConfiguracaoAgenda() {
    document.getElementById("modalConfiguracaoAgenda").classList.remove("active");
}

function salvarConfiguracaoAgenda() {
    const inicio = document.getElementById("configInicioAgenda").value;
    const fim = document.getElementById("configFimAgenda").value;
    const intervaloTexto = document.getElementById("configIntervalo").value;
    const almocoInicio = document.getElementById("configInicioAlmoco").value;
    const almocoFim = document.getElementById("configFimAlmoco").value;

    const intervalo = Number(intervaloTexto.replace(" min", ""));

    if (horarioParaMinutos(fim) <= horarioParaMinutos(inicio)) {
        abrirMensagem("Atenção", "O horário final da agenda precisa ser maior que o inicial.");
        return;
    }

    if (horarioParaMinutos(almocoFim) <= horarioParaMinutos(almocoInicio)) {
        abrirMensagem("Atenção", "O fim do almoço precisa ser maior que o início.");
        return;
    }

    configuracoesAgenda[profissionalAtual.nome] = {
        inicio: inicio,
        fim: fim,
        intervalo: intervalo,
        almocoInicio: almocoInicio,
        almocoFim: almocoFim
    };

    fecharConfiguracaoAgenda();
    gerarDropdownHorarios();
    gerarAgenda();

    abrirMensagem("Configuração", "Configuração da agenda salva com sucesso.");
}

/* =====================================================
   MENSAGENS / IMPRESSÃO
===================================================== */

function abrirMensagem(titulo, texto) {
    const tituloEl = document.getElementById("tituloMensagem");
    const textoEl = document.getElementById("textoMensagem");
    const modal = document.getElementById("modalMensagem");

    if (tituloEl && textoEl && modal) {
        tituloEl.innerText = titulo;
        textoEl.innerText = texto;
        modal.classList.add("active");
    } else {
        alert(texto);
    }
}

function fecharMensagem() {
    document.getElementById("modalMensagem").classList.remove("active");
}

function fecharConfirmacao() {
    const modal = document.getElementById("modalConfirmacao");

    if (modal) {
        modal.classList.remove("active");
    }
}

function imprimirAgenda() {
    window.print();
}

/* =====================================================
   CONTADOR
===================================================== */

const observacoes = document.getElementById("modalObservacoes");

if (observacoes) {
    observacoes.addEventListener("input", function () {
        document.getElementById("contadorObservacoes").innerText = this.value.length;
    });
}

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

if (window.location.pathname.includes("agenda.html")) {

    const sidebar = document.getElementById("sidebar");

    if (sidebar && localStorage.getItem("sidebarClosed") === "true") {
        sidebar.classList.add("closed");
    }

    carregarProfissionais();

    const nomeUsuario = localStorage.getItem("usuarioNome") || "Andressa de Sales Fernandes";
    const cargoUsuario = localStorage.getItem("usuarioCargo") || "Administrador(a)";
    const agendaUsuario = localStorage.getItem("usuarioAgenda") || "Andressa de Sales Adm";

    document.getElementById("nomeUsuarioTopo").innerText = nomeUsuario;
    document.getElementById("cargoUsuarioTopo").innerText = cargoUsuario;

    selecionarProfissional(agendaUsuario);

    renderizarCalendario();
    atualizarTitulo();
    gerarDropdownHorarios();
    gerarAgenda();
}