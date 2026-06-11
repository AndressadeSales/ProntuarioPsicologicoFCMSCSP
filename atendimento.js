let paciente = {};
let chaveRascunho = "";

let documentos = [];
let cids = [];
let alergias = [];
let problemas = [];
let resultadosExames = [];
let medicamentosPsiquiatricos = [];
let medicamentosGerais = [];
let prescricoes = [];
let examesSolicitados = [];
let atestados = [];
let encaminhamentos = [];

let indicePrescricaoEditando = null;
let indiceExameEditando = null;

const gruposExames = {
    "Psicologia": [
        "Avaliação psicológica",
        "Avaliação psicodiagnóstica",
        "Avaliação comportamental",
        "Avaliação emocional",
        "Avaliação de habilidades sociais",
        "Avaliação familiar"
    ],
    "Psiquiatria": [
        "Avaliação psiquiátrica",
        "Reavaliação psiquiátrica",
        "Avaliação medicamentosa",
        "Avaliação de risco suicida",
        "Avaliação de transtornos mentais"
    ],
    "Neuropsicologia": [
        "Avaliação neuropsicológica",
        "Avaliação cognitiva",
        "Avaliação de memória",
        "Avaliação de atenção",
        "Avaliação de funções executivas"
    ],
    "Desenvolvimento infantil": [
        "Avaliação para TEA",
        "Avaliação para TDAH",
        "Avaliação de aprendizagem",
        "Avaliação do desenvolvimento infantil"
    ],
    "Avaliação escolar": [
        "Avaliação escolar",
        "Avaliação psicopedagógica",
        "Avaliação de desempenho escolar"
    ],
    "Outros": [
        "Outro exame ou avaliação"
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSidebar();
    carregarPaciente();
    iniciarDadosAtendimento();
    carregarRascunho();
    configurarSalvamentoAutomatico();
    manterAccordionsFechados();
    selecionarGrupoExame("Psicologia");

    const primeiraAba = document.querySelector(".abas-atendimento .aba");

    if (primeiraAba) {
        mostrarAba("documentos", primeiraAba);
    }
});

/* PACIENTE / INICIALIZAÇÃO */

function carregarPaciente() {
    const salvo = localStorage.getItem("pacienteAtendimento");

    if (!salvo) {
        alert("Paciente não encontrado.");
        window.location.href = "lista-atendimento.html";
        return;
    }

    paciente = JSON.parse(salvo);

    const identificador = paciente.cpf || paciente.cns || paciente.nome || "sem-identificacao";
    chaveRascunho = `rascunhoAtendimento_${identificador}`;

    setTexto("pacienteNome", paciente.nome || "-");
    setTexto("pacienteIdade", paciente.idade || "-");
    setTexto("pacienteCpf", paciente.cpf || "-");
    setTexto("pacienteCns", paciente.cns || "-");
    setTexto("pacienteTelefone", paciente.telefone || "-");
    setTexto("pacienteResponsavel", paciente.responsavel || "-");

    setValor("identNome", paciente.nome || "");
    setValor("identIdade", paciente.idade || "");
    setValor("identContatos", paciente.telefone || "");
}

function iniciarDadosAtendimento() {
    const hoje = new Date();

    if (!valor("dataAtendimento")) {
        setValor("dataAtendimento", hoje.toLocaleDateString("pt-BR"));
    }

    if (!localStorage.getItem(chaveRascunho + "_inicio")) {
        localStorage.setItem(
            chaveRascunho + "_inicio",
            hoje.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            })
        );
    }

    setValor("horaInicio", localStorage.getItem(chaveRascunho + "_inicio"));

    if (!valor("profissionalAtendimento")) {
        setValor("profissionalAtendimento", localStorage.getItem("usuarioNome") || "Andressa de Sales Fernandes");
    }

    const hojeISO = hoje.toISOString().split("T")[0];

    if (!valor("atestadoData")) {
    setValor("atestadoData", hoje.toLocaleDateString("pt-BR"));
    }
    if (!valor("atestadoHora")) setValor("atestadoHora", hoje.toTimeString().slice(0, 5));
    if (!valor("prescricaoInicio")) setValor("prescricaoInicio", hojeISO);
}

/* SALVAMENTO */

function configurarSalvamentoAutomatico() {
    document.querySelectorAll("input, textarea, select").forEach(campo => {
        campo.addEventListener("input", salvarAutomaticamente);
        campo.addEventListener("change", salvarAutomaticamente);
    });

    window.addEventListener("beforeunload", salvarAutomaticamente);
}

function salvarAutomaticamente() {
    if (!chaveRascunho) return;

    localStorage.setItem(chaveRascunho, JSON.stringify(coletarDados()));
    mostrarAutoSave();
}

function salvarRascunhoManual() {
    salvarAutomaticamente();
    alert("Rascunho salvo com sucesso.");
}

function mostrarAutoSave() {
    const info = document.getElementById("autoSaveInfo");

    if (!info) return;

    const agora = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    info.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Salvo automaticamente às ${agora}`;
}

function coletarDados() {
    return {
        paciente,
        profissional: valor("profissionalAtendimento"),
        dataAtendimento: valor("dataAtendimento"),
        horaInicio: valor("horaInicio"),
        horaTermino: valor("horaTermino"),
        tipoAtendimento: radioValor("tipoAtendimento"),

        queixaPrincipal: valor("queixaPrincipal"),
        evolucaoAtendimento: valor("evolucaoAtendimento"),
        intervencoesRealizadas: valor("intervencoesRealizadas"),
        condutasRapidas: checksValores("condutasRapidas"),
        conduta: valor("conduta"),
        observacoesComplementares: valor("observacoesComplementares"),
        orientacoesPaciente: valor("orientacoesPaciente"),

        anamnese: {
            queixaPrincipal: valor("anamneseQueixaPrincipal"),
            hma: valor("historiaMolestiaAtual"),
            historiaFamiliar: valor("historiaFamiliar"),
            historicoDesenvolvimento: valor("historicoDesenvolvimento"),
            historicoPessoalSocial: valor("historicoPessoalSocial"),
            tratamentosAnteriores: valor("tratamentosAnteriores"),
            medicoes: {
                peso: valor("peso"),
                altura: valor("altura"),
                imc: valor("imc"),
                classificacao: texto("classificacaoImc")
            },
            dum: valor("dum")
        },

        documentos,
        cids,
        alergias,
        problemas,
        resultadosExames,
        medicamentosPsiquiatricos,
        medicamentosGerais,
        prescricoes,
        examesSolicitados,
        atestados,
        encaminhamentos,

        atestado: {
            modelo: valor("atestadoModelo"),
            data: valor("atestadoData"),
            hora: valor("atestadoHora"),
            dias: valor("atestadoDias"),
            cid: valor("atestadoCid"),
            email: valor("atestadoEmail"),
            digital: document.getElementById("atestadoDigital")?.checked || false,
            texto: valor("textoAtestado")
        },

        encaminhamento: {
            destinos: checksValores("encaminhamento"),
            motivo: valor("encaminhamentoMotivo"),
            objetivo: valor("encaminhamentoObjetivo"),
            observacoes: valor("encaminhamentoObservacoes"),
            texto: valor("textoEncaminhamento")
        },

        atualizadoEm: new Date().toISOString()
    };
}

function carregarRascunho() {
    const salvo = localStorage.getItem(chaveRascunho);

    if (!salvo) return;

    const dados = JSON.parse(salvo);

    setValor("profissionalAtendimento", dados.profissional);
    setValor("dataAtendimento", dados.dataAtendimento);
    setValor("horaInicio", dados.horaInicio);
    setValor("horaTermino", dados.horaTermino);
    marcarRadio("tipoAtendimento", dados.tipoAtendimento);

    setValor("queixaPrincipal", dados.queixaPrincipal);
    setValor("evolucaoAtendimento", dados.evolucaoAtendimento);
    setValor("intervencoesRealizadas", dados.intervencoesRealizadas);
    marcarChecks("condutasRapidas", dados.condutasRapidas || []);
    setValor("conduta", dados.conduta);
    setValor("observacoesComplementares", dados.observacoesComplementares);
    setValor("orientacoesPaciente", dados.orientacoesPaciente);

    if (dados.anamnese) {
        const id = dados.anamnese.identificacao || {};

        setValor("identNome", id.nome);
        setValor("identIdade", id.idade);
        setValor("identEstadoCivil", id.estadoCivil);
        setValor("identProfissao", id.profissao);
        setValor("identReligiao", id.religiao);
        setValor("identContatos", id.contatos);

        setValor("anamneseQueixaPrincipal", dados.anamnese.queixaPrincipal);
        setValor("historiaMolestiaAtual", dados.anamnese.hma);
        setValor("historiaFamiliar", dados.anamnese.historiaFamiliar);
        setValor("historicoDesenvolvimento", dados.anamnese.historicoDesenvolvimento);
        setValor("historicoPessoalSocial", dados.anamnese.historicoPessoalSocial);
        setValor("tratamentosAnteriores", dados.anamnese.tratamentosAnteriores);

        if (dados.anamnese.medicoes) {
            setValor("peso", dados.anamnese.medicoes.peso);
            setValor("altura", dados.anamnese.medicoes.altura);
            setValor("imc", dados.anamnese.medicoes.imc);
            calcularIMC();
        }

        setValor("dum", dados.anamnese.dum);
    }

    documentos = dados.documentos || [];
    cids = dados.cids || [];
    alergias = dados.alergias || [];
    problemas = dados.problemas || [];
    resultadosExames = dados.resultadosExames || [];
    medicamentosPsiquiatricos = dados.medicamentosPsiquiatricos || [];
    medicamentosGerais = dados.medicamentosGerais || [];
    prescricoes = dados.prescricoes || [];
    examesSolicitados = dados.examesSolicitados || [];
    atestados = dados.atestados || [];
    encaminhamentos = dados.encaminhamentos || [];

    if (dados.atestado) {
        setValor("atestadoModelo", dados.atestado.modelo);
        setValor("atestadoData", dados.atestado.data);
        setValor("atestadoHora", dados.atestado.hora);
        setValor("atestadoDias", dados.atestado.dias);
        setValor("atestadoCid", dados.atestado.cid);
        setValor("atestadoEmail", dados.atestado.email);
        setValor("textoAtestado", dados.atestado.texto);

        const digital = document.getElementById("atestadoDigital");
        if (digital) digital.checked = !!dados.atestado.digital;
    }

    if (dados.encaminhamento) {
        marcarChecks("encaminhamento", dados.encaminhamento.destinos || []);
        setValor("encaminhamentoMotivo", dados.encaminhamento.motivo);
        setValor("encaminhamentoObjetivo", dados.encaminhamento.objetivo);
        setValor("encaminhamentoObservacoes", dados.encaminhamento.observacoes);
        setValor("textoEncaminhamento", dados.encaminhamento.texto);
    }

    renderizarTudo();
}

function salvarAtestado() {
    gerarTextoAtestado();

    const texto = valor("textoAtestado").trim();

    if (!texto) {
        alert("Gere ou escreva o texto do atestado.");
        return;
    }

    atestados.push({
        modelo: valor("atestadoModelo"),
        data: valor("atestadoData"),
        hora: valor("atestadoHora"),
        dias: valor("atestadoDias"),
        cid: valor("atestadoCid"),
        email: valor("atestadoEmail"),
        texto,
        profissional: valor("profissionalAtendimento")
    });

    renderizarAtestados();
    salvarAutomaticamente();
}

function renderizarAtestados() {
    const lista = document.getElementById("listaAtestados");
    if (!lista) return;

    lista.innerHTML = atestados.map((a, i) => `
        <div class="historico-item" id="atestadoItem${i}">
            <div class="historico-head">
                <button class="hist-toggle" onclick="toggleHistorico('atestadoItem${i}')">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>

                <div class="historico-info">
                    <strong>${a.modelo || "Atestado"}</strong>
                    <div class="historico-subinfo">
                        ${a.data || "-"} | ${a.profissional || "-"} | Atestado
                    </div>
                </div>

                <div class="hist-actions">
                    <button title="Imprimir" onclick="imprimirTextoSalvo('Atestado', atestados[${i}].texto)">
                        <i class="fa-solid fa-print"></i>
                    </button>

                    <button title="Duplicar" onclick="duplicarAtestado(${i})">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button title="Editar" onclick="editarAtestado(${i})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button title="Excluir" onclick="excluirAtestado(${i})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>

            <div class="historico-body">
                <p><strong>Hora:</strong> ${a.hora || "-"}</p>
                <p><strong>Dias:</strong> ${a.dias || "-"}</p>
                <p><strong>CID:</strong> ${a.cid || "-"}</p>
                <p><strong>Texto:</strong> ${a.texto || "-"}</p>
            </div>
        </div>
    `).join("");
}

function excluirAtestado(index) {
    if (!confirm("Deseja excluir este atestado?")) return;

    atestados.splice(index, 1);
    renderizarAtestados();
    salvarAutomaticamente();
}

function renderizarEncaminhamentos() {
    const lista = document.getElementById("listaEncaminhamentos");
    if (!lista) return;

    lista.innerHTML = encaminhamentos.map((e, i) => `
        <div class="historico-item" id="encaminhamentoItem${i}">
            <div class="historico-head">
                <button class="hist-toggle" onclick="toggleHistorico('encaminhamentoItem${i}')">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>

                <div class="historico-info">
                    <strong>Encaminhamento</strong>
                    <div class="historico-subinfo">
                        ${e.data || "-"} | ${e.profissional || "-"} | ${(e.destinos || []).join(", ") || "Serviço indicado"}
                    </div>
                </div>

                <div class="hist-actions">
                    <button title="Imprimir" onclick="imprimirTextoSalvo('Encaminhamento', encaminhamentos[${i}].texto)">
                        <i class="fa-solid fa-print"></i>
                    </button>

                    <button title="Duplicar" onclick="duplicarEncaminhamento(${i})">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button title="Editar" onclick="editarEncaminhamento(${i})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button title="Excluir" onclick="excluirEncaminhamento(${i})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>

            <div class="historico-body">
                <p><strong>Motivo:</strong> ${e.motivo || "-"}</p>
                <p><strong>Objetivo:</strong> ${e.objetivo || "-"}</p>
                <p><strong>Observações:</strong> ${e.observacoes || "-"}</p>
                <p><strong>Texto:</strong> ${e.texto || "-"}</p>
            </div>
        </div>
    `).join("");
}

function excluirEncaminhamento(index) {
    if (!confirm("Deseja excluir este encaminhamento?")) return;

    encaminhamentos.splice(index, 1);
    renderizarEncaminhamentos();
    salvarAutomaticamente();
}

function salvarEncaminhamento() {
    gerarTextoEncaminhamento();

    const texto = valor("textoEncaminhamento").trim();

    if (!texto) {
        alert("Gere ou escreva o texto do encaminhamento.");
        return;
    }

    encaminhamentos.push({
        destinos: checksValores("encaminhamento"),
        motivo: valor("encaminhamentoMotivo"),
        objetivo: valor("encaminhamentoObjetivo"),
        observacoes: valor("encaminhamentoObservacoes"),
        texto,
        data: valor("dataAtendimento"),
        profissional: valor("profissionalAtendimento")
    });

    renderizarEncaminhamentos();
    salvarAutomaticamente();
}

function duplicarAtestado(index) {
    const copia = {
        ...atestados[index],
        data: new Date().toLocaleDateString("pt-BR"),
        profissional: valor("profissionalAtendimento")
    };

    atestados.push(copia);
    renderizarAtestados();
    salvarAutomaticamente();
}

function editarAtestado(index) {
    const a = atestados[index];

    setValor("atestadoModelo", a.modelo);
    setValor("atestadoData", a.data);
    setValor("atestadoHora", a.hora);
    setValor("atestadoDias", a.dias);
    setValor("atestadoCid", a.cid);
    setValor("atestadoEmail", a.email);
    setValor("textoAtestado", a.texto);

    atestados.splice(index, 1);
    renderizarAtestados();
    salvarAutomaticamente();
}

function duplicarEncaminhamento(index) {
    const copia = {
        ...encaminhamentos[index],
        data: new Date().toLocaleDateString("pt-BR"),
        profissional: valor("profissionalAtendimento")
    };

    encaminhamentos.push(copia);
    renderizarEncaminhamentos();
    salvarAutomaticamente();
}

function editarEncaminhamento(index) {
    const e = encaminhamentos[index];

    marcarChecks("encaminhamento", e.destinos || []);
    setValor("encaminhamentoMotivo", e.motivo);
    setValor("encaminhamentoObjetivo", e.objetivo);
    setValor("encaminhamentoObservacoes", e.observacoes);
    setValor("textoEncaminhamento", e.texto);

    encaminhamentos.splice(index, 1);
    renderizarEncaminhamentos();
    salvarAutomaticamente();
}

function imprimirTextoSalvo(titulo, texto) {
    imprimirDocumento(`
        <h1>${titulo}</h1>
        <p><strong>Paciente:</strong> ${paciente.nome || "-"}</p>
        <p><strong>CPF:</strong> ${paciente.cpf || "-"}</p>
        <p><strong>Profissional:</strong> ${valor("profissionalAtendimento")}</p>
        <hr>
        <div style="white-space:pre-wrap; line-height:1.6;">${texto}</div>
    `);
}

/* ACCORDIONS */

function manterAccordionsFechados() {
    document.querySelectorAll(".accordion, .sub-accordion").forEach(acc => {
        acc.classList.remove("active");

        const icon = acc.querySelector(
            ".accordion-header .fa-chevron-up, .accordion-header .fa-chevron-down, .sub-accordion-header .fa-chevron-up, .sub-accordion-header .fa-chevron-down"
        );

        if (icon) {
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }
    });
}

function toggleAccordion(header) {
    const acc = header.closest(".accordion");
    const icon = header.querySelector(".fa-chevron-up, .fa-chevron-down");

    acc.classList.toggle("active");

    if (icon) {
        icon.classList.toggle("fa-chevron-up");
        icon.classList.toggle("fa-chevron-down");
    }
}

function toggleSubAccordion(header) {
    const acc = header.closest(".sub-accordion");
    const icon = header.querySelector(".fa-chevron-up, .fa-chevron-down");

    acc.classList.toggle("active");

    if (icon) {
        icon.classList.toggle("fa-chevron-up");
        icon.classList.toggle("fa-chevron-down");
    }
}

/* ANAMNESE */

function calcularIMC() {
    const peso = Number(valor("peso"));
    const alturaCm = Number(valor("altura"));
    const imcCampo = document.getElementById("imc");
    const status = document.getElementById("classificacaoImc");

    if (!peso || !alturaCm) {
        if (imcCampo) imcCampo.value = "";

        if (status) {
            status.className = "imc-status";
            status.innerText = "Informe peso e altura para calcular o IMC.";
        }

        return;
    }

    const altura = alturaCm / 100;
    const imc = peso / (altura * altura);
    const imcFormatado = imc.toFixed(2).replace(".", ",");

    imcCampo.value = imcFormatado;

    let classe = "imc-ok";
    let texto = "Adequado ou Eutrófico";

    if (imc < 18.5) {
        classe = "imc-alerta";
        texto = "Baixo peso";
    } else if (imc >= 25 && imc < 30) {
        classe = "imc-alerta";
        texto = "Sobrepeso";
    } else if (imc >= 30) {
        classe = "imc-critico";
        texto = "Obesidade";
    }

    status.className = `imc-status ${classe}`;
    status.innerHTML = `<i class="fa-solid fa-circle-check"></i> IMC: ${imcFormatado} kg/m² — ${texto}`;

    salvarAutomaticamente();
}

function adicionarAlergia() {
    const descricao = valor("alergiaDescricao").trim();

    if (!descricao) {
        alert("Informe a alergia/reação.");
        return;
    }

    alergias.push({
        descricao,
        tipo: valor("alergiaTipo"),
        criticidade: valor("alergiaCriticidade")
    });

    setValor("alergiaDescricao", "");

    renderizarAlergias();
    salvarAutomaticamente();
}

function renderizarAlergias() {
    const lista = document.getElementById("listaAlergias");

    if (!lista) return;

    lista.innerHTML = alergias.map((a, i) => `
        <div class="item-lista">
            <div>
                <strong>${a.descricao}</strong><br>
                <span>${a.tipo}</span><br>
                <span class="badge ${classeBadge(a.criticidade)}">Crit. ${a.criticidade}</span>
            </div>

            <button onclick="removerItem('alergias', ${i})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join("");
}

function adicionarProblema() {
    const descricao = valor("problemaDescricao").trim();
    const ciap = valor("problemaCiap").trim();
    const cid = valor("problemaCid").trim();

    if (!descricao && !ciap && !cid) {
        alert("Informe CIAP, CID ou descrição.");
        return;
    }

    problemas.push({
        ciap,
        cid,
        descricao,
        situacao: radioValor("problemaSituacao"),
        inicio: valor("problemaDataInicio"),
        observacao: valor("problemaObservacao")
    });

    [
        "problemaCiap",
        "problemaCid",
        "problemaDescricao",
        "problemaDataInicio",
        "problemaObservacao"
    ].forEach(id => setValor(id, ""));

    renderizarProblemas();
    salvarAutomaticamente();
}

function renderizarProblemas() {
    const lista = document.getElementById("listaProblemas");

    if (!lista) return;

    lista.innerHTML = problemas.map((p, i) => `
        <div class="item-lista">
            <div>
                <strong>${p.descricao || p.ciap || p.cid}</strong><br>
                <span>CIAP: ${p.ciap || "-"} | CID: ${p.cid || "-"} | Início: ${formatarData(p.inicio) || "-"}</span><br>
                <span class="badge ${classeBadge(p.situacao)}">${p.situacao}</span>
                ${p.observacao ? `<br><span>${p.observacao}</span>` : ""}
            </div>

            <button onclick="removerItem('problemas', ${i})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join("");
}

function adicionarResultadoExame() {
    const nome = valor("resultadoExameNome").trim();

    if (!nome) {
        alert("Informe o nome do exame.");
        return;
    }

    resultadosExames.push({
        nome,
        resultado: valor("resultadoExameValor"),
        data: valor("resultadoExameData")
    });

    [
        "resultadoExameNome",
        "resultadoExameValor",
        "resultadoExameData"
    ].forEach(id => setValor(id, ""));

    renderizarResultadosExames();
    salvarAutomaticamente();
}

function renderizarResultadosExames() {
    const lista = document.getElementById("listaResultadosExames");

    if (!lista) return;

    lista.innerHTML = resultadosExames.map((e, i) => `
        <div class="item-lista">
            <div>
                <strong>${e.nome}</strong><br>
                <span>${e.resultado || "Resultado não informado"} • ${formatarData(e.data) || "-"}</span>
            </div>

            <button onclick="removerItem('resultadosExames', ${i})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join("");
}

function adicionarMedicamentoUso(tipo) {
    const prefixo = tipo === "psiquiatrica" ? "psiq" : "geral";
    const nome = valor(`${prefixo}Nome`).trim();

    if (!nome) {
        alert("Informe o medicamento.");
        return;
    }

    const item = {
        nome,
        dose: valor(`${prefixo}Dose`),
        frequencia: valor(`${prefixo}Frequencia`),
        prescritor: valor(`${prefixo}Prescritor`),
        inicio: valor(`${prefixo}Inicio`),
        observacoes: valor(`${prefixo}Observacoes`)
    };

    if (tipo === "psiquiatrica") {
        item.usoAtual = valor("psiqUsoAtual");

        medicamentosPsiquiatricos.push(item);

        [
            "psiqNome",
            "psiqDose",
            "psiqFrequencia",
            "psiqPrescritor",
            "psiqInicio",
            "psiqObservacoes"
        ].forEach(id => setValor(id, ""));
    } else {
        item.motivo = valor("geralMotivo");

        medicamentosGerais.push(item);

        [
            "geralNome",
            "geralDose",
            "geralFrequencia",
            "geralPrescritor",
            "geralMotivo",
            "geralInicio",
            "geralObservacoes"
        ].forEach(id => setValor(id, ""));
    }

    renderizarMedicamentosUso();
    salvarAutomaticamente();
}

function renderizarMedicamentosUso() {
    const psiq = document.getElementById("listaMedicamentosPsiquiatricos");
    const geral = document.getElementById("listaMedicamentosGerais");

    if (psiq) {
        psiq.innerHTML = medicamentosPsiquiatricos
            .map((m, i) => itemMedicamentoUso(m, "medicamentosPsiquiatricos", i))
            .join("");
    }

    if (geral) {
        geral.innerHTML = medicamentosGerais
            .map((m, i) => itemMedicamentoUso(m, "medicamentosGerais", i))
            .join("");
    }
}

function itemMedicamentoUso(m, array, i) {
    return `
        <div class="item-lista">
            <div>
                <strong>${m.nome}</strong><br>
                <span>${m.dose || "-"} • ${m.frequencia || "-"} • Prescritor: ${m.prescritor || "-"}</span>
                ${m.motivo ? `<br><span>Motivo: ${m.motivo}</span>` : ""}
            </div>

            <button onclick="removerItem('${array}', ${i})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `;
}

/* DOCUMENTOS / CID */

function adicionarDocumento() {
    const input = document.getElementById("arquivoDocumento");

    if (!input || input.files.length === 0) {
        alert("Selecione pelo menos um documento.");
        return;
    }

    Array.from(input.files).forEach(arquivo => {
        documentos.push({
            nome: arquivo.name,
            tipo: arquivo.type || "Arquivo",
            tamanho: arquivo.size,
            data: new Date().toLocaleDateString("pt-BR")
        });
    });

    input.value = "";

    renderizarDocumentos();
    salvarAutomaticamente();
}

function renderizarDocumentos() {
    const lista = document.getElementById("listaDocumentos");

    if (!lista) return;

    lista.innerHTML = documentos.map((doc, i) => `
        <div class="item-lista">
            <div>
                <strong>${doc.nome}</strong><br>
                <span>${doc.tipo} • ${doc.data}</span>
            </div>

            <button onclick="removerItem('documentos', ${i})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join("");
}

function adicionarCid() {
    const codigo = valor("codigoCid").trim();

    if (!codigo) {
        alert("Informe o código do CID.");
        return;
    }

    cids.push({
        codigo,
        descricao: valor("descricaoCid"),
        data: new Date().toLocaleDateString("pt-BR")
    });

    setValor("codigoCid", "");
    setValor("descricaoCid", "");

    renderizarCids();
    salvarAutomaticamente();
}

function renderizarCids() {
    const lista = document.getElementById("listaCid");

    if (!lista) return;

    lista.innerHTML = cids.map((cid, i) => `
        <div class="item-lista">
            <div>
                <strong>${cid.codigo}</strong><br>
                <span>${cid.descricao || "Sem descrição"} • ${cid.data}</span>
            </div>

            <button onclick="removerItem('cids', ${i})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join("");
}

/* PRESCRIÇÃO */

function abrirModalPrescricao(index = null) {
    indicePrescricaoEditando = index;

    limparModalPrescricao();

    if (index !== null) {
        preencherModalPrescricao(prescricoes[index]);
    }

    document.getElementById("modalPrescricao").classList.add("active");
}

function fecharModalPrescricao() {
    document.getElementById("modalPrescricao").classList.remove("active");
    indicePrescricaoEditando = null;
}

function limparModalPrescricao() {
    setValor("prescricaoTipoReceita", "Receita simples");
    setValor("prescricaoMedicamento", "");
    setValor("prescricaoVia", "Oral");
    setValor("prescricaoTipoDose", "Comum");
    setValor("prescricaoQuantidade", "1");
    setValor("prescricaoUnidade", "Comprimido");
    setValor("prescricaoFrequencia", "1 vez ao dia");
    setValor("prescricaoInicio", new Date().toISOString().split("T")[0]);
    setValor("prescricaoDuracao", "");
    setValor("prescricaoPosologia", "");
    setValor("prescricaoObservacoes", "");

    const usoContinuo = document.getElementById("prescricaoUsoContinuo");

    if (usoContinuo) {
        usoContinuo.checked = false;
    }
}

function preencherModalPrescricao(p) {
    setValor("prescricaoTipoReceita", p.tipoReceita);
    setValor("prescricaoMedicamento", p.medicamento);
    setValor("prescricaoVia", p.via);
    setValor("prescricaoTipoDose", p.tipoDose);
    setValor("prescricaoQuantidade", p.quantidade);
    setValor("prescricaoUnidade", p.unidade);
    setValor("prescricaoFrequencia", p.frequencia);
    setValor("prescricaoInicio", p.inicio);
    setValor("prescricaoDuracao", p.duracao);
    setValor("prescricaoPosologia", p.posologia);
    setValor("prescricaoObservacoes", p.observacoes);

    const usoContinuo = document.getElementById("prescricaoUsoContinuo");

    if (usoContinuo) {
        usoContinuo.checked = !!p.usoContinuo;
    }
}

function salvarPrescricao() {
    const medicamento = valor("prescricaoMedicamento").trim();

    if (!medicamento) {
        alert("Informe o medicamento.");
        return;
    }

    let posologia = valor("prescricaoPosologia").trim();

    if (!posologia) {
        posologia = gerarPosologiaAutomatica();
        setValor("prescricaoPosologia", posologia);
    }

    const item = {
        tipoReceita: valor("prescricaoTipoReceita"),
        medicamento,
        via: valor("prescricaoVia"),
        tipoDose: valor("prescricaoTipoDose"),
        quantidade: valor("prescricaoQuantidade"),
        unidade: valor("prescricaoUnidade"),
        frequencia: valor("prescricaoFrequencia"),
        inicio: valor("prescricaoInicio"),
        duracao: valor("prescricaoDuracao"),
        usoContinuo: document.getElementById("prescricaoUsoContinuo")?.checked || false,
        posologia,
        observacoes: valor("prescricaoObservacoes"),
        data: new Date().toLocaleDateString("pt-BR"),
        profissional: valor("profissionalAtendimento"),
        status: "Ativa"
    };

    if (indicePrescricaoEditando !== null) {
        prescricoes[indicePrescricaoEditando] = item;
    } else {
        prescricoes.push(item);
    }

    fecharModalPrescricao();
    renderizarPrescricoes();
    salvarAutomaticamente();
}

function gerarPosologiaAutomatica() {
    return `Tomar ${valor("prescricaoQuantidade")} ${valor("prescricaoUnidade").toLowerCase()} via ${valor("prescricaoVia").toLowerCase()}, ${valor("prescricaoFrequencia").toLowerCase()}${valor("prescricaoDuracao") ? `, por ${valor("prescricaoDuracao")}` : ""}.`;
}

function renderizarPrescricoes() {
    const lista = document.getElementById("listaPrescricoes");

    if (!lista) return;

    const termo = valor("pesquisaPrescricao").toLowerCase();
    const somenteContinuos = document.getElementById("somenteContinuos")?.checked || false;

    const filtradas = prescricoes
        .map((p, index) => ({ ...p, indexOriginal: index }))
        .filter(p => {
            const batePesquisa = !termo || p.medicamento.toLowerCase().includes(termo);
            const bateContinuo = !somenteContinuos || p.usoContinuo;

            return batePesquisa && bateContinuo;
        });

    lista.innerHTML = filtradas.map(p => `
        <div class="historico-item" id="prescricaoItem${p.indexOriginal}">
            <div class="historico-head">
                <button class="hist-toggle" onclick="toggleHistorico('prescricaoItem${p.indexOriginal}')">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>

                <div>
                    <strong>${p.medicamento}</strong><br>
                    <span>${p.data} | ${p.profissional || "-"} | ${p.tipoReceita}</span>
                    ${p.usoContinuo ? `<br><span class="badge continuo">Uso contínuo</span>` : ""}
                </div>

                <div class="hist-actions">
                    <button title="Imprimir" onclick="imprimirPrescricao(${p.indexOriginal})">
                        <i class="fa-solid fa-print"></i>
                    </button>

                    <button title="Duplicar" onclick="duplicarPrescricao(${p.indexOriginal})">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button title="Editar" onclick="abrirModalPrescricao(${p.indexOriginal})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button title="Excluir" onclick="excluirPrescricao(${p.indexOriginal})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>

            <div class="historico-body">
                <p><strong>Via:</strong> ${p.via}</p>
                <p><strong>Dose:</strong> ${p.quantidade} ${p.unidade}</p>
                <p><strong>Frequência:</strong> ${p.frequencia}</p>
                <p><strong>Duração:</strong> ${p.duracao || "-"}</p>
                <p><strong>Posologia:</strong> ${p.posologia}</p>
                <p><strong>Observações:</strong> ${p.observacoes || "-"}</p>
            </div>
        </div>
    `).join("");
}

function duplicarPrescricao(index) {
    const original = prescricoes[index];

    const copia = {
        ...original,
        data: new Date().toLocaleDateString("pt-BR"),
        profissional: valor("profissionalAtendimento")
    };

    prescricoes.push(copia);

    renderizarPrescricoes();
    salvarAutomaticamente();
}

function excluirPrescricao(index) {
    if (!confirm("Deseja excluir esta prescrição?")) return;

    prescricoes.splice(index, 1);

    renderizarPrescricoes();
    salvarAutomaticamente();
}

function imprimirPrescricao(index) {
    const p = prescricoes[index];

    imprimirDocumento(`
        <h1>${p.tipoReceita.toUpperCase()}</h1>
        <p><strong>Paciente:</strong> ${paciente.nome || "-"}</p>
        <p><strong>CPF:</strong> ${paciente.cpf || "-"}</p>
        <p><strong>Data:</strong> ${p.data}</p>
        <hr>
        <h2>${p.medicamento}</h2>
        <p>${p.posologia}</p>
        ${p.observacoes ? `<p><strong>Observações:</strong> ${p.observacoes}</p>` : ""}
        <br><br>
        <p>_______________________________________</p>
        <p>${p.profissional || valor("profissionalAtendimento")}</p>
    `);
}

/* EXAMES */

function abrirModalExame(index = null) {
    indiceExameEditando = index;

    limparModalExame();

    if (index !== null) {
        preencherModalExame(examesSolicitados[index]);
    }

    document.getElementById("modalExame").classList.add("active");
}

function fecharModalExame() {
    document.getElementById("modalExame").classList.remove("active");
    indiceExameEditando = null;
}

function selecionarGrupoExame(grupo) {
    setValor("exameGrupo", grupo);

    const select = document.getElementById("exameNome");

    if (select) {
        select.innerHTML = gruposExames[grupo].map(nome => `
            <option>${nome}</option>
        `).join("");
    }

    document.querySelectorAll(".exam-groups button").forEach(btn => {
        btn.classList.remove("active");

        if (btn.innerText.includes(grupo)) {
            btn.classList.add("active");
        }
    });
}

function limparModalExame() {
    selecionarGrupoExame("Psicologia");
    setValor("exameCid", "");
    setValor("exameJustificativa", "");
    setValor("exameObservacoes", "");
}

function preencherModalExame(e) {
    selecionarGrupoExame(e.grupo);
    setValor("exameNome", e.nome);
    setValor("exameCid", e.cid);
    setValor("exameJustificativa", e.justificativa);
    setValor("exameObservacoes", e.observacoes);
}

function salvarExameSolicitado() {
    const nome = valor("exameNome");
    const justificativa = valor("exameJustificativa").trim();

    if (!nome || !justificativa) {
        alert("Informe a solicitação e a justificativa.");
        return;
    }

    const item = {
        grupo: valor("exameGrupo"),
        nome,
        cid: valor("exameCid"),
        justificativa,
        observacoes: valor("exameObservacoes"),
        data: new Date().toLocaleDateString("pt-BR"),
        profissional: valor("profissionalAtendimento"),
        status: "Pendente"
    };

    if (indiceExameEditando !== null) {
        examesSolicitados[indiceExameEditando] = item;
    } else {
        examesSolicitados.push(item);
    }

    fecharModalExame();
    renderizarExamesSolicitados();
    salvarAutomaticamente();
}

function renderizarExamesSolicitados() {
    const lista = document.getElementById("listaExamesSolicitados");

    if (!lista) return;

    const termo = valor("pesquisaExames").toLowerCase();
    const somentePendentes = document.getElementById("somenteExamesPendentes")?.checked || false;

    const filtrados = examesSolicitados
        .map((e, index) => ({ ...e, indexOriginal: index }))
        .filter(e => {
            const batePesquisa = !termo || e.nome.toLowerCase().includes(termo);
            const batePendente = !somentePendentes || e.status === "Pendente";

            return batePesquisa && batePendente;
        });

    lista.innerHTML = filtrados.map(e => `
        <div class="historico-item" id="exameItem${e.indexOriginal}">
            <div class="historico-head">
                <button class="hist-toggle" onclick="toggleHistorico('exameItem${e.indexOriginal}')">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>

                <div>
                    <strong>${e.nome}</strong><br>
                    <span>${e.data} | ${e.profissional || "-"} | ${e.grupo}</span><br>
                    <span class="badge ${classeBadge(e.status)}">${e.status}</span>
                </div>

                <div class="hist-actions">
                    <button title="Imprimir" onclick="imprimirExame(${e.indexOriginal})">
                        <i class="fa-solid fa-print"></i>
                    </button>

                    <button title="Duplicar" onclick="duplicarExame(${e.indexOriginal})">
                        <i class="fa-solid fa-copy"></i>
                    </button>

                    <button title="Editar" onclick="abrirModalExame(${e.indexOriginal})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button title="Excluir" onclick="excluirExame(${e.indexOriginal})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>

            <div class="historico-body">
                <p><strong>Grupo:</strong> ${e.grupo}</p>
                <p><strong>CID:</strong> ${e.cid || "-"}</p>
                <p><strong>Justificativa:</strong> ${e.justificativa}</p>
                <p><strong>Observações:</strong> ${e.observacoes || "-"}</p>
            </div>
        </div>
    `).join("");
}

function duplicarExame(index) {
    const original = examesSolicitados[index];

    const copia = {
        ...original,
        data: new Date().toLocaleDateString("pt-BR"),
        profissional: valor("profissionalAtendimento")
    };

    examesSolicitados.push(copia);

    renderizarExamesSolicitados();
    salvarAutomaticamente();
}

function excluirExame(index) {
    if (!confirm("Deseja excluir esta solicitação?")) return;

    examesSolicitados.splice(index, 1);

    renderizarExamesSolicitados();
    salvarAutomaticamente();
}

function imprimirExame(index) {
    const e = examesSolicitados[index];

    imprimirDocumento(`
        <h1>SOLICITAÇÃO DE EXAME / AVALIAÇÃO</h1>
        <p><strong>Paciente:</strong> ${paciente.nome || "-"}</p>
        <p><strong>CPF:</strong> ${paciente.cpf || "-"}</p>
        <p><strong>CNS:</strong> ${paciente.cns || "-"}</p>
        <p><strong>Data:</strong> ${e.data}</p>
        <hr>
        <p><strong>Solicitação:</strong> ${e.nome}</p>
        <p><strong>Grupo:</strong> ${e.grupo}</p>
        <p><strong>CID:</strong> ${e.cid || "-"}</p>
        <p><strong>Justificativa:</strong> ${e.justificativa}</p>
        <p><strong>Observações:</strong> ${e.observacoes || "-"}</p>
        <br><br>
        <p>_______________________________________</p>
        <p>${e.profissional || valor("profissionalAtendimento")}</p>
    `);
}

/* TEXTOS PADRÃO */

function gerarTextoOrientacoes() {
    const textoPadrao = `Orientações ao paciente ${paciente.nome || "-"}:

- Manter acompanhamento conforme combinado em atendimento.
- Realizar as estratégias orientadas durante a consulta.
- Observar sinais de piora emocional e procurar suporte em caso de necessidade.
- Retornar conforme agendamento ou orientação profissional.`;

    setValor("orientacoesPaciente", textoPadrao);
    salvarAutomaticamente();
}

function gerarTextoAtestado() {
    const modelo = valor("atestadoModelo");
    const data = formatarData(valor("atestadoData")) || valor("dataAtendimento");
    const hora = valor("atestadoHora") || valor("horaInicio");
    const dias = valor("atestadoDias");
    const cid = valor("atestadoCid");

    let texto = "";

    if (modelo === "Comparecimento") {
        texto = `Declaro, para os devidos fins, que ${paciente.nome || "-"}, CPF ${paciente.cpf || "-"}, compareceu a atendimento psicológico nesta instituição em ${data}, às ${hora}.`;
    } else if (modelo === "Acompanhante") {
        texto = `Declaro, para os devidos fins, que o(a) acompanhante esteve presente durante o atendimento psicológico de ${paciente.nome || "-"}, realizado em ${data}, às ${hora}.`;
    } else if (modelo === "Afastamento") {
        texto = `Atesto, para os devidos fins, que ${paciente.nome || "-"}, CPF ${paciente.cpf || "-"}, recebeu atendimento psicológico nesta instituição em ${data}, às ${hora}, necessitando de afastamento por ${dias || "___"} dia(s).${cid ? ` CID: ${cid}.` : ""}`;
    } else {
        texto = `Declaro, para os devidos fins, que ${paciente.nome || "-"}, CPF ${paciente.cpf || "-"}, recebeu atendimento psicológico nesta instituição em ${data}, às ${hora}.`;
    }

    setValor("textoAtestado", texto);
    salvarAutomaticamente();
}

function gerarTextoEncaminhamento() {
    const destinos = checksValores("encaminhamento").join(", ") || "serviço indicado";
    const motivo = valor("encaminhamentoMotivo") || "avaliação e acompanhamento conforme necessidade clínica";
    const objetivo = valor("encaminhamentoObjetivo") || "continuidade do cuidado e acompanhamento especializado";
    const observacoes = valor("encaminhamentoObservacoes");

    const texto = `Encaminho o(a) paciente ${paciente.nome || "-"}, CPF ${paciente.cpf || "-"}, CNS ${paciente.cns || "-"}, para ${destinos}.

Motivo do encaminhamento:
${motivo}

Objetivo:
${objetivo}

${observacoes ? `Observações:\n${observacoes}` : ""}

Atenciosamente,

${valor("profissionalAtendimento") || "-"}`;

    setValor("textoEncaminhamento", texto);
    salvarAutomaticamente();
}

/* IMPRESSÕES */

function montarCabecalhoImpressao() {
    return `
        <div class="print-section-title">Dados do Paciente</div>

        <div class="print-box">
            <p><strong>Paciente:</strong> ${paciente.nome || "-"}</p>
            <p><strong>CPF:</strong> ${paciente.cpf || "-"}</p>
            <p><strong>CNS:</strong> ${paciente.cns || "-"}</p>
            <p><strong>Profissional:</strong> ${valor("profissionalAtendimento") || "-"}</p>
            <p><strong>Data:</strong> ${valor("dataAtendimento") || "-"}</p>
        </div>
    `;
}

function imprimirOrientacoes() {
    imprimirTexto("ORIENTAÇÕES AO PACIENTE", "orientacoesPaciente");
}

function imprimirTexto(titulo, idCampo) {
    const conteudo = valor(idCampo).trim();

    if (!conteudo) {
        alert("Não há texto para imprimir.");
        return;
    }

    imprimirDocumento(titulo, `
        ${montarCabecalhoImpressao()}

        <div class="print-section-title">${titulo}</div>

        <div class="print-box texto-documento">
            ${conteudo.replace(/\n/g, "<br>")}
        </div>

        <br><br>

        <p>_______________________________________</p>
        <p>${valor("profissionalAtendimento") || "-"}</p>
    `);
}

function imprimirTextoSalvo(titulo, texto) {
    imprimirDocumento(titulo.toUpperCase(), `
        ${montarCabecalhoImpressao()}

        <div class="print-section-title">${titulo}</div>

        <div class="print-box texto-documento">
            ${(texto || "-").replace(/\n/g, "<br>")}
        </div>

        <br><br>

        <p>_______________________________________</p>
        <p>${valor("profissionalAtendimento") || "-"}</p>
    `);
}

function imprimirPrescricao(index) {
    const p = prescricoes[index];

    imprimirDocumento("PRESCRIÇÃO", `
        ${montarCabecalhoImpressao()}

        <div class="print-section-title">${p.tipoReceita || "Prescrição"}</div>

        <div class="print-box">
            <p><strong>Medicamento:</strong> ${p.medicamento || "-"}</p>
            <p><strong>Via:</strong> ${p.via || "-"}</p>
            <p><strong>Dose:</strong> ${p.quantidade || "-"} ${p.unidade || ""}</p>
            <p><strong>Frequência:</strong> ${p.frequencia || "-"}</p>
            <p><strong>Duração:</strong> ${p.duracao || "-"}</p>
            <p><strong>Posologia:</strong> ${p.posologia || "-"}</p>
            <p><strong>Observações:</strong> ${p.observacoes || "-"}</p>
        </div>

        <br><br>

        <p>_______________________________________</p>
        <p>${p.profissional || valor("profissionalAtendimento")}</p>
    `);
}

function imprimirExame(index) {
    const e = examesSolicitados[index];

    imprimirDocumento("SOLICITAÇÃO DE EXAMES", `
        ${montarCabecalhoImpressao()}

        <div class="print-section-title">Solicitação</div>

        <div class="print-box">
            <p><strong>Exame/Avaliação:</strong> ${e.nome || "-"}</p>
            <p><strong>Grupo:</strong> ${e.grupo || "-"}</p>
            <p><strong>CID:</strong> ${e.cid || "-"}</p>
            <p><strong>Justificativa:</strong> ${e.justificativa || "-"}</p>
            <p><strong>Observações:</strong> ${e.observacoes || "-"}</p>
        </div>

        <br><br>

        <p>_______________________________________</p>
        <p>${e.profissional || valor("profissionalAtendimento")}</p>
    `);
}

function imprimirAtendimento() {
    salvarAutomaticamente();

    imprimirDocumento("ATENDIMENTO", `
        ${montarCabecalhoImpressao()}

        <div class="print-section-title">Consulta</div>

        <div class="print-box">
            <p><strong>Queixa principal:</strong> ${valor("queixaPrincipal") || "-"}</p>
            <p><strong>Evolução:</strong> ${valor("evolucaoAtendimento") || "-"}</p>
            <p><strong>Intervenções:</strong> ${valor("intervencoesRealizadas") || "-"}</p>
            <p><strong>Observações:</strong> ${valor("observacoesComplementares") || "-"}</p>
            <p><strong>Conduta:</strong> ${valor("conduta") || "-"}</p>
            <p><strong>Orientações:</strong> ${valor("orientacoesPaciente") || "-"}</p>
        </div>
    `);
}

/* FINALIZAÇÃO */

function voltarLista() {
    salvarAutomaticamente();
    window.location.href = "lista-atendimento.html";
}

function finalizarAtendimento() {
    if (!confirm("Deseja finalizar este atendimento?")) return;

    const agora = new Date();

    setValor("horaTermino", agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    }));

    const atendimentoFinalizado = coletarDados();

    atendimentoFinalizado.finalizadoEm = agora.toISOString();
    atendimentoFinalizado.status = "Atendimento realizado";

    const historico = JSON.parse(localStorage.getItem("historicoAtendimentos")) || [];

    historico.push(atendimentoFinalizado);

    localStorage.setItem("historicoAtendimentos", JSON.stringify(historico));

    localStorage.removeItem(chaveRascunho);
    localStorage.removeItem(chaveRascunho + "_inicio");

    alert("Atendimento finalizado com sucesso.");

    window.location.href = "lista-atendimento.html";
}

/* RENDERIZAÇÃO GERAL */

function renderizarTudo() {
    renderizarDocumentos();
    renderizarCids();
    renderizarAlergias();
    renderizarProblemas();
    renderizarResultadosExames();
    renderizarMedicamentosUso();
    renderizarPrescricoes();
    renderizarExamesSolicitados();
    renderizarAtestados();
    renderizarEncaminhamentos();
}

/* UTILITÁRIOS */

function removerItem(nomeArray, index) {
    const mapas = {
        documentos,
        cids,
        alergias,
        problemas,
        resultadosExames,
        medicamentosPsiquiatricos,
        medicamentosGerais
    };

    if (!mapas[nomeArray]) return;

    mapas[nomeArray].splice(index, 1);

    renderizarTudo();
    salvarAutomaticamente();
}

function toggleHistorico(id) {
    const item = document.getElementById(id);
    const icon = item?.querySelector(".hist-toggle i");

    if (!item) return;

    item.classList.toggle("active");

    if (icon) {
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    }
}

function valor(id) {
    return document.getElementById(id)?.value || "";
}

function texto(id) {
    return document.getElementById(id)?.innerText || "";
}

function setValor(id, valorCampo) {
    const campo = document.getElementById(id);

    if (campo && valorCampo !== undefined && valorCampo !== null) {
        campo.value = valorCampo;
    }
}

function setTexto(id, valorCampo) {
    const campo = document.getElementById(id);

    if (campo) {
        campo.innerText = valorCampo;
    }
}

function radioValor(nome) {
    return document.querySelector(`input[name='${nome}']:checked`)?.value || "";
}

function checksValores(nome) {
    return Array.from(document.querySelectorAll(`input[name='${nome}']:checked`))
        .map(item => item.value);
}

function marcarRadio(nome, valorCampo) {
    if (!valorCampo) return;

    const radio = document.querySelector(`input[name='${nome}'][value='${valorCampo}']`);

    if (radio) {
        radio.checked = true;
    }
}

function marcarChecks(nome, valores) {
    document.querySelectorAll(`input[name='${nome}']`).forEach(check => {
        check.checked = valores.includes(check.value);
    });
}

function formatarData(dataISO) {
    if (!dataISO) return "";

    const partes = dataISO.split("-");

    if (partes.length !== 3) return dataISO;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function classeBadge(textoClasse) {
    if (!textoClasse) return "";

    return textoClasse
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function mostrarAba(nome, botao){

    document.querySelectorAll('.aba').forEach(aba=>{
        aba.classList.remove('ativa');
    });

    botao.classList.add('ativa');

    document.querySelectorAll('.tab-section').forEach(secao=>{
        secao.classList.remove('active');
    });

    const alvo =
        document.querySelector(
            `[data-accordion="${nome}"]`
        );

    if(alvo){
        alvo.classList.add('active');
    }
}

let mesAtestado = new Date().getMonth();
let anoAtestado = new Date().getFullYear();

function toggleCalendarioAtestado(event) {
    event.stopPropagation();

    const calendario = document.getElementById("calendarioAtestado");

    if (!calendario) return;

    calendario.classList.toggle("closed");
    renderizarCalendarioAtestado();
}

function renderizarCalendarioAtestado() {
    const calendario = document.getElementById("calendarioAtestado");

    if (!calendario) return;

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    calendario.innerHTML = `
        <div class="mini-calendar-box">
            <div class="mini-calendar-header">
                <button type="button" onclick="selecionarHojeAtestado()">Hoje</button>
                <i class="fa-solid fa-chevron-left" onclick="mudarMesAtestado(-1)"></i>
                <strong>${meses[mesAtestado]} ${anoAtestado}</strong>
                <i class="fa-solid fa-chevron-right" onclick="mudarMesAtestado(1)"></i>
            </div>

            <div class="mini-week-days">
                <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
            </div>

            <div class="mini-days" id="diasAtestado"></div>
        </div>
    `;

    const dias = document.getElementById("diasAtestado");
    const primeiroDia = new Date(anoAtestado, mesAtestado, 1);
    const ultimoDia = new Date(anoAtestado, mesAtestado + 1, 0);

    for (let i = 0; i < primeiroDia.getDay(); i++) {
        dias.innerHTML += `<div></div>`;
    }

    const hoje = new Date();

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {

        const ehHoje =
            dia === hoje.getDate() &&
            mesAtestado === hoje.getMonth() &&
            anoAtestado === hoje.getFullYear();

        dias.innerHTML += `
            <div class="mini-day ${ehHoje ? 'today' : ''}" onclick="selecionarDataAtestado(${dia})">
                ${dia}
            </div>
        `;
    }

}

function selecionarDataAtestado(dia) {
    const data = new Date(anoAtestado, mesAtestado, dia);

    document.getElementById("atestadoData").value =
        data.toLocaleDateString("pt-BR");

    document.getElementById("calendarioAtestado").classList.add("closed");

    gerarTextoAtestado();
}

function mudarMesAtestado(valor) {
    mesAtestado += valor;

    if (mesAtestado < 0) {
        mesAtestado = 11;
        anoAtestado--;
    }

    if (mesAtestado > 11) {
        mesAtestado = 0;
        anoAtestado++;
    }

    renderizarCalendarioAtestado();
}

function selecionarHojeAtestado() {
    const hoje = new Date();

    mesAtestado = hoje.getMonth();
    anoAtestado = hoje.getFullYear();

    document.getElementById("atestadoData").value =
        hoje.toLocaleDateString("pt-BR");

    document.getElementById("calendarioAtestado").classList.add("closed");

    gerarTextoAtestado();
}
