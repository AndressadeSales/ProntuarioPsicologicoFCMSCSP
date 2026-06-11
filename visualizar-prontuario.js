let paciente = {};
let atendimentosPaciente = [];
let ultimaAnamnese = null;

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSidebar();
    carregarPaciente();
    carregarDadosProntuario();

    preencherCabecalho();
    preencherFolhaRosto();
    preencherDadosPessoais();
    preencherAnamnese();
    preencherAtendimentos();
    preencherDocumentos();
    preencherEncaminhamentos();
    preencherAgendamentos();
});


/* =========================
   ABAS
========================= */

function abrirAba(nome, botao) {

    document.querySelectorAll(".tab-content").forEach(secao => {
        secao.classList.remove("active");
    });

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    const aba = document.getElementById(`aba-${nome}`);

    if (aba) {
        aba.classList.add("active");
    }

    if (botao) {
        botao.classList.add("active");
    }
}

/* =========================
   ACCORDION
========================= */

function toggleAccordion(header) {

    const accordion = header.closest(".accordion");

    accordion.classList.toggle("active");
}

/* =========================
   TIMELINE
========================= */

function toggleTimeline(id) {

    const item = document.getElementById(id);

    if (item) {
        item.classList.toggle("active");
    }
}

/* =========================
   PACIENTE
========================= */

function carregarPaciente() {

    let salvo = localStorage.getItem("pacienteSelecionado");

    if (!salvo) {
        salvo = localStorage.getItem("pacienteProntuario");
    }

    if (!salvo) {
        criarDadosFicticiosPadrao();
        salvo = localStorage.getItem("pacienteProntuario");
    }

    if (!salvo) {
        alert("Paciente não encontrado.");
        window.location.href = "prontuarios.html";
        return;
    }

    paciente = JSON.parse(salvo);
}

function carregarDadosProntuario() {
    const historico =
        JSON.parse(localStorage.getItem("historicoAtendimentos")) || [];

    atendimentosPaciente = historico.filter(item => {
        return (
            item?.paciente?.cpf === paciente.cpf ||
            item?.paciente?.cns === paciente.cns
        );
    });

    if (atendimentosPaciente.length > 0) {
        ultimaAnamnese =
            atendimentosPaciente[atendimentosPaciente.length - 1];
    }
}

/* =========================
   CABEÇALHO
========================= */

function preencherCabecalho() {
    setTexto("pacienteNome", paciente.nome || "Paciente");
}

/* =========================
   FOLHA DE ROSTO
========================= */

function preencherFolhaRosto() {
    const anamnese = ultimaAnamnese?.anamnese || {};
    const medicoes = anamnese.medicoes || {};
    const ultimo = atendimentosPaciente[atendimentosPaciente.length - 1];

    setTexto("frNome", paciente.nome || "-");
    setTexto("frCpf", paciente.cpf || "-");
    setTexto("frCns", paciente.cns || "-");
    setTexto("frNascimento", formatarData(paciente.dataNascimento));
    setTexto("frIdade", paciente.idade || calcularIdade(paciente.dataNascimento) || "-");
    setTexto("frSexo", paciente.sexo || "-");

    setTexto("frTelefone", paciente.telefone || "-");
    setTexto("frCelular", paciente.celular || paciente.telefone || "-");
    setTexto("frEmail", paciente.email || "-");

    setTexto("frUltimoAtendimento", ultimo ? formatarDataHora(ultimo.finalizadoEm || ultimo.atualizadoEm) : "-");
    setTexto("frUltimoProfissional", ultimo?.profissional || "-");
    setTexto("frProximoAgendamento", obterProximoAgendamentoTexto());
    setTexto("frProfReferencia", paciente.profissionalReferencia || ultimo?.profissional || "-");

    const status = document.getElementById("frStatus");
    if (status) {
        status.innerText = paciente.status || "Ativo";
        status.className = `badge ${classeBadge(paciente.status || "Ativo")}`;
    }

    setTexto("frPeso", medicoes.peso ? `${medicoes.peso} kg` : "-");
    setTexto("frAltura", medicoes.altura ? `${medicoes.altura} cm` : "-");
    setTexto("frImc", medicoes.imc || "-");

    preencherResumoLista(
        "frAlergias",
        ultimaAnamnese?.alergias || [],
        item => `⚠️ ${item.descricao || "-"}`,
        "Nenhuma alergia registrada."
    );

    preencherResumoLista(
        "frProblemas",
        (ultimaAnamnese?.problemas || []).filter(p => (p.situacao || "").toLowerCase() === "ativo"),
        item => `⚠️ ${item.descricao || item.cid || item.ciap || "-"}`,
        "Nenhum problema ativo registrado."
    );

    preencherResumoMedicamentos();
    preencherResumoExames();
    preencherResumoAtendimentos();
}

function preencherResumoLista(id, lista, textoCallback, vazioTexto) {
    const container = document.getElementById(id);

    if (!container) return;

    if (!lista || lista.length === 0) {
        container.innerHTML = `<div class="item-vazio">${vazioTexto}</div>`;
        return;
    }

    container.innerHTML = lista.slice(0, 4).map(item => `
        <div class="folha-item">
            <strong>${textoCallback(item)}</strong>
            ${item.criticidade ? `<span class="badge ${classeBadge(item.criticidade)}">Crit. ${item.criticidade}</span>` : ""}
            ${item.situacao ? `<span class="badge ${classeBadge(item.situacao)}">${item.situacao}</span>` : ""}
        </div>
    `).join("");
}

function preencherResumoMedicamentos() {
    const container = document.getElementById("frMedicamentos");
    if (!container) return;

    const lista = [
        ...(ultimaAnamnese?.medicamentosPsiquiatricos || []),
        ...(ultimaAnamnese?.medicamentosGerais || [])
    ];

    if (lista.length === 0) {
        container.innerHTML = `<div class="item-vazio">Nenhuma medicação registrada.</div>`;
        return;
    }

    container.innerHTML = lista.slice(0, 5).map(med => `
        <div class="folha-item">
            <strong>💊 ${med.nome || "-"}</strong>
            <span>${med.dose || "-"} | ${med.frequencia || "-"}</span>
        </div>
    `).join("");
}

function preencherResumoExames() {
    const container = document.getElementById("frExames");
    if (!container) return;

    const lista = ultimaAnamnese?.resultadosExames || [];

    if (lista.length === 0) {
        container.innerHTML = `<div class="item-vazio">Nenhum exame registrado.</div>`;
        return;
    }

    container.innerHTML = lista.slice(0, 3).map(exame => `
        <div class="folha-item">
            <strong>${exame.nome || "-"}</strong>
            <span>${exame.resultado || "-"}</span><br>
            <span>${formatarData(exame.data)}</span>
        </div>
    `).join("");
}

function preencherResumoAtendimentos() {
    const container = document.getElementById("frUltimosAtendimentos");
    if (!container) return;

    if (!atendimentosPaciente || atendimentosPaciente.length === 0) {
        container.innerHTML = `<div class="item-vazio">Nenhum atendimento registrado.</div>`;
        return;
    }

    container.innerHTML = [...atendimentosPaciente].reverse().slice(0, 4).map(item => `
        <div class="folha-item">
            <strong>Consulta Psicológica</strong>
            <span>${formatarDataHora(item.finalizadoEm || item.atualizadoEm)}</span><br>
            <span>${item.profissional || "-"}</span>
        </div>
    `).join("");
}

/* =========================
   DADOS PESSOAIS
========================= */

function preencherDadosPessoais() {
    setTexto("dpNome", paciente.nome || "-");
    setTexto("dpNomeSocial", paciente.nomeSocial || "-");
    setTexto("dpCpf", paciente.cpf || "-");
    setTexto("dpCns", paciente.cns || "-");
    setTexto("dpNascimento", formatarData(paciente.dataNascimento));
    setTexto("dpSexo", paciente.sexo || "-");
    setTexto("dpRaca", paciente.racaCor || "-");
    setTexto("dpEtnia", paciente.etnia || "-");
    setTexto("dpMae", paciente.nomeMae || "-");
    setTexto("dpPai", paciente.nomePai || "-");

    setTexto("dpNacionalidade", paciente.nacionalidade || "Brasileira");
    setTexto("dpMunicipioNascimento", paciente.municipioNascimento || paciente.municipio || "-");
    setTexto("dpUfNascimento", paciente.ufNascimento || "SP");

    setTexto("dpTelefoneResidencial", paciente.telefoneResidencial || paciente.telefone || "-");
    setTexto("dpCelular", paciente.celular || paciente.telefone || "-");
    setTexto("dpTelefoneRecado", paciente.telefoneRecado || "-");
    setTexto("dpEmail", paciente.email || "-");

    setTexto("dpUnidadeSaude", paciente.unidadeSaude || "Santa Casa");
    setTexto("dpEquipe", paciente.equipe || "Psicologia");
    setTexto("dpMicroarea", paciente.microarea || "-");
    setTexto("dpProfReferencia", paciente.profissionalReferencia || ultimaAnamnese?.profissional || "-");

    setTexto("dpCep", paciente.cep || "-");
    setTexto("dpLogradouro", paciente.logradouro || "-");
    setTexto("dpNumero", paciente.numero || "-");
    setTexto("dpComplemento", paciente.complemento || "-");
    setTexto("dpBairro", paciente.bairro || "-");
    setTexto("dpMunicipio", paciente.municipio || "-");
    setTexto("dpUf", paciente.uf || "SP");
    setTexto("dpPontoReferencia", paciente.pontoReferencia || "-");

    preencherResponsavel();

    setTexto("dpEstadoCivil", paciente.estadoCivil || "-");
    setTexto("dpEscolaridade", paciente.escolaridade || "-");
    setTexto("dpProfissao", paciente.profissao || "-");
    setTexto("dpReligiao", paciente.religiao || "-");
    setTexto("dpTipoSanguineo", paciente.tipoSanguineo || "-");
    setTexto("dpOrientacaoSexual", paciente.orientacaoSexual || "-");
    setTexto("dpIdentidadeGenero", paciente.identidadeGenero || "-");
    setTexto("dpObservacoesCadastrais", paciente.observacoesCadastrais || "-");
}

function preencherResponsavel() {
    const temResponsavel =
        paciente.responsavel ||
        paciente.responsavelNome ||
        paciente.responsavelCpf ||
        paciente.responsavelTelefone;

    if (!temResponsavel) {
        const bloco = document.getElementById("blocoResponsavel");

        if (bloco) {
            bloco.innerHTML = `<div class="item-vazio">Não possui responsável cadastrado.</div>`;
        }

        return;
    }

    setTexto("respNome", paciente.responsavelNome || paciente.responsavel || "-");
    setTexto("respParentesco", paciente.responsavelParentesco || "-");
    setTexto("respCpf", paciente.responsavelCpf || "-");
    setTexto("respTelefone", paciente.responsavelTelefone || "-");
    setTexto("respCelular", paciente.responsavelCelular || paciente.responsavelTelefone || "-");
    setTexto("respEmail", paciente.responsavelEmail || "-");
    setTexto("respObservacoes", paciente.responsavelObservacoes || "-");
}

/* =========================
   ANAMNESE
========================= */

function preencherAnamnese() {
    if (!ultimaAnamnese) {
        preencherAnamneseVazia();
        return;
    }

    const anamnese = ultimaAnamnese.anamnese || {};
    const medicoes = anamnese.medicoes || {};

    setTexto("anamneseAtualizacao", `Última atualização: ${obterUltimaAtualizacao()}`);

    setTexto("anamneseQueixaPrincipal", anamnese.queixaPrincipal || "-");
    setTexto("historiaMolestiaAtual", anamnese.hma || "-");
    setTexto("historiaFamiliar", anamnese.historiaFamiliar || "-");
    setTexto("historicoDesenvolvimento", anamnese.historicoDesenvolvimento || "-");
    setTexto("historicoPessoalSocial", anamnese.historicoPessoalSocial || "-");
    setTexto("tratamentosAnteriores", anamnese.tratamentosAnteriores || "-");

    setTexto("peso", medicoes.peso ? `${medicoes.peso} kg` : "-");
    setTexto("altura", medicoes.altura ? `${medicoes.altura} cm` : "-");
    setTexto("imc", medicoes.imc || "-");
    setTexto("classificacaoImc", medicoes.classificacao || "-");

    setTexto("dum", anamnese.dum ? formatarData(anamnese.dum) : "-");

    renderizarAlergias(ultimaAnamnese.alergias || []);
    renderizarProblemas(ultimaAnamnese.problemas || []);
    renderizarResultadosExames(ultimaAnamnese.resultadosExames || []);
    renderizarMedicamentosUso(
        ultimaAnamnese.medicamentosPsiquiatricos || [],
        ultimaAnamnese.medicamentosGerais || []
    );
}

function preencherAnamneseVazia() {
    setTexto("anamneseAtualizacao", "Última atualização: sem registros");

    [
        "anamneseQueixaPrincipal",
        "historiaMolestiaAtual",
        "historiaFamiliar",
        "historicoDesenvolvimento",
        "historicoPessoalSocial",
        "tratamentosAnteriores",
        "peso",
        "altura",
        "imc",
        "classificacaoImc",
        "dum"
    ].forEach(id => setTexto(id, "-"));

    renderizarAlergias([]);
    renderizarProblemas([]);
    renderizarResultadosExames([]);
    renderizarMedicamentosUso([], []);
}

function renderizarAlergias(lista) {
    const container = document.getElementById("listaAlergias");

    if (!container) return;

    if (!lista || lista.length === 0) {
        container.innerHTML = vazio("Nenhuma alergia/reação registrada.");
        return;
    }

    container.innerHTML = lista.map(item => `
        <div class="item-lista">
            <strong>${item.descricao || "-"}</strong><br>
            <span>Tipo: ${item.tipo || "-"}</span><br>
            <span class="badge ${classeBadge(item.criticidade)}">
                Criticidade: ${item.criticidade || "-"}
            </span>
        </div>
    `).join("");
}

function renderizarProblemas(lista) {
    const container = document.getElementById("listaProblemas");

    if (!container) return;

    if (!lista || lista.length === 0) {
        container.innerHTML = vazio("Nenhum problema/condição registrado.");
        return;
    }

    container.innerHTML = lista.map(item => `
        <div class="item-lista">
            <strong>${item.descricao || item.cid || item.ciap || "-"}</strong><br>
            <span>CIAP: ${item.ciap || "-"} | CID: ${item.cid || "-"}</span><br>
            <span>Início: ${formatarData(item.inicio) || "-"}</span><br>
            <span class="badge ${classeBadge(item.situacao)}">${item.situacao || "-"}</span>
            ${item.observacao ? `<br><span>${item.observacao}</span>` : ""}
        </div>
    `).join("");
}

function renderizarResultadosExames(lista) {
    const container = document.getElementById("listaResultadosExames");

    if (!container) return;

    if (!lista || lista.length === 0) {
        container.innerHTML = vazio("Nenhum resultado de exame registrado.");
        return;
    }

    container.innerHTML = lista.map(item => `
        <div class="item-lista">
            <strong>${item.nome || "-"}</strong><br>
            <span>Resultado: ${item.resultado || "-"}</span><br>
            <span>Data: ${formatarData(item.data) || "-"}</span>
        </div>
    `).join("");
}

function renderizarMedicamentosUso(psiquiatricos, gerais) {
    const listaPsiq = document.getElementById("listaMedicamentosPsiquiatricos");
    const listaGeral = document.getElementById("listaMedicamentosGerais");

    if (listaPsiq) {
        listaPsiq.innerHTML = psiquiatricos.length
            ? psiquiatricos.map(medicamentoVisual).join("")
            : vazio("Nenhuma medicação psiquiátrica registrada.");
    }

    if (listaGeral) {
        listaGeral.innerHTML = gerais.length
            ? gerais.map(medicamentoVisual).join("")
            : vazio("Nenhuma medicação geral registrada.");
    }
}

function medicamentoVisual(item) {
    return `
        <div class="item-lista">
            <strong>${item.nome || "-"}</strong><br>
            <span>Dose: ${item.dose || "-"} | Frequência: ${item.frequencia || "-"}</span><br>
            <span>Prescritor: ${item.prescritor || "-"}</span>
            ${item.motivo ? `<br><span>Motivo: ${item.motivo}</span>` : ""}
            ${item.observacoes ? `<br><span>${item.observacoes}</span>` : ""}
        </div>
    `;
}

/* =========================
   ATENDIMENTOS
========================= */

function preencherAtendimentos() {
    const container = document.getElementById("listaAtendimentos");
    const total = document.getElementById("totalAtendimentos");

    if (!container || !total) return;

    total.innerText = `${atendimentosPaciente.length} registro(s)`;

    if (atendimentosPaciente.length === 0) {
        container.innerHTML = vazio("Nenhum atendimento registrado.");
        return;
    }

    const ordenados = [...atendimentosPaciente].reverse();

    container.innerHTML = ordenados.map((item, index) => `
        <div class="timeline-item" id="atendimento-${index}">
            <div class="timeline-head" onclick="toggleTimeline('atendimento-${index}')">
                <div class="timeline-icon">
                    <i class="fa-solid fa-comments"></i>
                </div>

                <div>
                    <h4>Consulta Psicológica</h4>
                    <p>${formatarDataHora(item.finalizadoEm || item.atualizadoEm)} | ${item.profissional || "-"}</p>
                </div>

                <div class="timeline-actions">
                    <button title="Imprimir" onclick="event.stopPropagation(); imprimirAtendimento(${index})">
                        <i class="fa-solid fa-print"></i>
                    </button>

                    <button title="Expandir">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                </div>
            </div>

            <div class="timeline-body">
                ${secaoAtendimento("Queixa Principal", item.queixaPrincipal)}
                ${secaoAtendimento("Evolução", item.evolucaoAtendimento)}
                ${secaoAtendimento("Intervenções Realizadas", item.intervencoesRealizadas)}
                ${secaoAtendimento("Conduta", montarConduta(item))}
                ${secaoAtendimento("Observações Complementares", item.observacoesComplementares)}
                ${secaoAtendimento("Orientações", item.orientacoesPaciente)}
                ${secaoAtendimento("Prescrições", montarPrescricoes(item.prescricoes || []))}
                ${secaoAtendimento("Exames Solicitados", montarExamesSolicitados(item.examesSolicitados || []))}
                ${secaoAtendimento("Atestado", item?.atestado?.texto)}
                ${secaoAtendimento("Encaminhamento", item?.encaminhamento?.texto)}
            </div>
        </div>
    `).join("");
}

function secaoAtendimento(titulo, conteudo) {
    return `
        <div class="timeline-section">
            <h5>${titulo}</h5>
            <div>${conteudo || "-"}</div>
        </div>
    `;
}

function montarConduta(item) {
    const rapidas = item.condutasRapidas?.length
        ? `Condutas selecionadas: ${item.condutasRapidas.join(", ")}\n\n`
        : "";

    return `${rapidas}${item.conduta || "-"}`;
}

function montarPrescricoes(lista) {
    if (!lista || lista.length === 0) return "-";

    return lista.map(p => {
        return `${p.medicamento || "-"}\n${p.tipoReceita || "-"}\n${p.posologia || "-"}`;
    }).join("\n\n--------------------\n\n");
}

function montarExamesSolicitados(lista) {
    if (!lista || lista.length === 0) return "-";

    return lista.map(e => {
        return `${e.nome || "-"}\nGrupo: ${e.grupo || "-"}\nCID: ${e.cid || "-"}\nJustificativa: ${e.justificativa || "-"}`;
    }).join("\n\n--------------------\n\n");
}

/* =========================
   DOCUMENTOS
========================= */

function preencherDocumentos() {
    const container = document.getElementById("listaDocumentos");
    const total = document.getElementById("totalDocumentos");

    if (!container || !total) return;

    let documentos = [];

    atendimentosPaciente.forEach(atendimento => {
        documentos = documentos.concat(
            (atendimento.documentos || []).map(doc => ({
                ...doc,
                profissional: atendimento.profissional,
                dataAtendimento: atendimento.finalizadoEm || atendimento.atualizadoEm
            }))
        );

        if (atendimento?.atestado?.texto) {
            documentos.push({
                nome: "Atestado",
                tipo: "Atestado",
                profissional: atendimento.profissional,
                dataAtendimento: atendimento.finalizadoEm || atendimento.atualizadoEm,
                texto: atendimento.atestado.texto
            });
        }

        if (atendimento?.orientacoesPaciente) {
            documentos.push({
                nome: "Orientações ao paciente",
                tipo: "Orientações",
                profissional: atendimento.profissional,
                dataAtendimento: atendimento.finalizadoEm || atendimento.atualizadoEm,
                texto: atendimento.orientacoesPaciente
            });
        }

        (atendimento.prescricoes || []).forEach(p => {
            documentos.push({
                nome: p.medicamento,
                tipo: p.tipoReceita || "Receita",
                profissional: atendimento.profissional,
                dataAtendimento: atendimento.finalizadoEm || atendimento.atualizadoEm,
                texto: p.posologia
            });
        });

        (atendimento.examesSolicitados || []).forEach(e => {
            documentos.push({
                nome: e.nome,
                tipo: "Solicitação de Exame",
                profissional: atendimento.profissional,
                dataAtendimento: atendimento.finalizadoEm || atendimento.atualizadoEm,
                texto: e.justificativa
            });
        });
    });

    total.innerText = `${documentos.length} documento(s)`;

    if (documentos.length === 0) {
        container.innerHTML = vazio("Nenhum documento registrado.");
        return;
    }

    container.innerHTML = documentos.map((doc, index) => `
        <div class="item-lista">
            <strong>${doc.nome || "-"}</strong><br>
            <span>Tipo: ${doc.tipo || "Documento"}</span><br>
            <span>Data: ${formatarDataHora(doc.dataAtendimento)} | Profissional: ${doc.profissional || "-"}</span>

            <div class="item-actions">
                <button onclick="imprimirDocumentoProntuario(${index})">
                    <i class="fa-solid fa-print"></i>
                    Imprimir
                </button>
            </div>
        </div>
    `).join("");

    window.documentosProntuario = documentos;
}

function imprimirDocumentoProntuario(index) {
    const doc = window.documentosProntuario[index];

    imprimirDocumento(`
        <h1>${doc.tipo || "Documento"}</h1>
        <p><strong>Paciente:</strong> ${paciente.nome || "-"}</p>
        <p><strong>Data:</strong> ${formatarDataHora(doc.dataAtendimento)}</p>
        <p><strong>Profissional:</strong> ${doc.profissional || "-"}</p>
        <hr>
        <div style="white-space:pre-wrap; line-height:1.6;">
            ${doc.texto || doc.nome || "-"}
        </div>
    `);
}

/* =========================
   ENCAMINHAMENTOS
========================= */

function preencherEncaminhamentos() {
    const container = document.getElementById("listaEncaminhamentos");
    const total = document.getElementById("totalEncaminhamentos");

    if (!container || !total) return;

    let encaminhamentos = [];

    atendimentosPaciente.forEach(atendimento => {
        if (atendimento.encaminhamento) {
            const enc = atendimento.encaminhamento;

            if (
                enc.texto ||
                enc.destinos?.length ||
                enc.motivo ||
                enc.objetivo
            ) {
                encaminhamentos.push({
                    ...enc,
                    profissional: atendimento.profissional,
                    data: atendimento.finalizadoEm || atendimento.atualizadoEm
                });
            }
        }
    });

    total.innerText = `${encaminhamentos.length} encaminhamento(s)`;

    if (encaminhamentos.length === 0) {
        container.innerHTML = vazio("Nenhum encaminhamento registrado.");
        return;
    }

    container.innerHTML = encaminhamentos.map((enc, index) => `
        <div class="item-lista">
            <strong>${enc.destinos?.join(", ") || "Encaminhamento"}</strong><br>
            <span>Data: ${formatarDataHora(enc.data)} | Profissional: ${enc.profissional || "-"}</span><br>
            <span><strong>Motivo:</strong> ${enc.motivo || "-"}</span><br>
            <span><strong>Objetivo:</strong> ${enc.objetivo || "-"}</span>
            ${enc.observacoes ? `<br><span><strong>Observações:</strong> ${enc.observacoes}</span>` : ""}

            <div class="item-actions">
                <button onclick="imprimirEncaminhamento(${index})">
                    <i class="fa-solid fa-print"></i>
                    Imprimir
                </button>
            </div>
        </div>
    `).join("");

    window.encaminhamentosProntuario = encaminhamentos;
}

function imprimirEncaminhamento(index) {
    const enc = window.encaminhamentosProntuario[index];

    imprimirDocumento(`
        <h1>Encaminhamento</h1>
        <p><strong>Paciente:</strong> ${paciente.nome || "-"}</p>
        <p><strong>Data:</strong> ${formatarDataHora(enc.data)}</p>
        <p><strong>Profissional:</strong> ${enc.profissional || "-"}</p>
        <hr>
        <div style="white-space:pre-wrap; line-height:1.6;">
            ${enc.texto || `
Destino: ${enc.destinos?.join(", ") || "-"}
Motivo: ${enc.motivo || "-"}
Objetivo: ${enc.objetivo || "-"}
Observações: ${enc.observacoes || "-"}
            `}
        </div>
    `);
}

/* =========================
   AGENDAMENTOS
========================= */

function preencherAgendamentos() {
    const container = document.getElementById("listaAgendamentos");
    const total = document.getElementById("totalAgendamentos");

    if (!container || !total) return;

    const agendamentos =
        JSON.parse(localStorage.getItem("agendamentos")) || [];

    const listaPaciente = agendamentos.filter(ag => {
        return (
            ag?.paciente?.cpf === paciente.cpf ||
            ag?.paciente?.cns === paciente.cns ||
            ag?.cpf === paciente.cpf ||
            ag?.cns === paciente.cns
        );
    });

    total.innerText = `${listaPaciente.length} agendamento(s)`;

    if (listaPaciente.length === 0) {
        container.innerHTML = vazio("Nenhum agendamento registrado.");
        return;
    }

    container.innerHTML = listaPaciente.map(ag => `
        <div class="item-lista">
            <strong>${ag.tipo || "Consulta Psicológica"}</strong><br>
            <span>Data: ${formatarData(ag.data)} | Hora: ${ag.hora || "-"}</span><br>
            <span>Profissional: ${ag.profissional || "-"}</span><br>
            <span class="badge ${classeBadge(ag.status || "Agendado")}">${ag.status || "Agendado"}</span>
        </div>
    `).join("");
}

function obterProximoAgendamentoTexto() {
    const agendamentos =
        JSON.parse(localStorage.getItem("agendamentos")) || [];

    const lista = agendamentos.filter(ag =>
        ag?.paciente?.cpf === paciente.cpf ||
        ag?.paciente?.cns === paciente.cns ||
        ag?.cpf === paciente.cpf ||
        ag?.cns === paciente.cns
    );

    if (lista.length === 0) return "-";

    const proximo = lista[0];

    return `${formatarData(proximo.data)} às ${proximo.hora || "-"}`;
}

/* =========================
   AÇÕES
========================= */

function novoAtendimento() {
    localStorage.setItem(
        "pacienteAtendimento",
        JSON.stringify(paciente)
    );

    window.location.href = "atendimento.html";
}

function voltarProntuarios() {
    window.location.href = "prontuarios.html";
}

function imprimirProntuario() {
    window.print();
}

function imprimirAtendimento(indexVisual) {
    const atendimento = [...atendimentosPaciente].reverse()[indexVisual];

    imprimirDocumento(`
        <h1>Atendimento Psicológico</h1>
        <p><strong>Paciente:</strong> ${paciente.nome || "-"}</p>
        <p><strong>Data:</strong> ${formatarDataHora(atendimento.finalizadoEm || atendimento.atualizadoEm)}</p>
        <p><strong>Profissional:</strong> ${atendimento.profissional || "-"}</p>
        <hr>
        <h2>Queixa Principal</h2>
        <p>${atendimento.queixaPrincipal || "-"}</p>
        <h2>Evolução</h2>
        <p>${atendimento.evolucaoAtendimento || "-"}</p>
        <h2>Conduta</h2>
        <p>${montarConduta(atendimento)}</p>
        <h2>Orientações</h2>
        <p>${atendimento.orientacoesPaciente || "-"}</p>
    `);
}

function imprimirDocumento(htmlInterno) {
    const janela = window.open("", "_blank");

    janela.document.write(`
        <html>
        <head>
            <title>PsiSaúde</title>
            <style>
                body{
                    font-family:Arial, Helvetica, sans-serif;
                    padding:40px;
                    color:#111827;
                }

                h1{
                    color:#007A33;
                    border-bottom:2px solid #007A33;
                    padding-bottom:10px;
                }

                h2{
                    font-size:18px;
                    margin-top:20px;
                }

                p{
                    font-size:14px;
                    line-height:1.6;
                }

                hr{
                    border:none;
                    border-top:1px solid #ddd;
                    margin:20px 0;
                }
            </style>
        </head>

        <body>
            ${htmlInterno}

            <script>
                window.print();
            </script>
        </body>
        </html>
    `);

    janela.document.close();
}

/* =========================
   UTIL
========================= */

function setTexto(id, valor) {
    const el = document.getElementById(id);

    if (el) {
        el.innerText = valor || "-";
    }
}

function vazio(texto) {
    return `
        <div class="item-vazio">
            ${texto}
        </div>
    `;
}

function formatarData(data) {
    if (!data) return "-";

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarDataHora(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR");
}

function calcularIdade(dataNascimento) {
    if (!dataNascimento) return "";

    const nascimento = new Date(dataNascimento);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (
        mes < 0 ||
        (mes === 0 && hoje.getDate() < nascimento.getDate())
    ) {
        idade--;
    }

    return idade ? `${idade} anos` : "";
}

function classeBadge(valor) {
    if (!valor) return "";

    return valor
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
}

/* =========================
   DADOS FICTÍCIOS PADRÃO
========================= */

function criarDadosFicticiosPadrao() {
    const pacienteFicticio = {
        nome: "Mariana Alves Santos",
        nomeSocial: "",
        cpf: "123.456.789-00",
        cns: "700000000000001",
        dataNascimento: "1994-08-15",
        idade: "31 anos",
        sexo: "Feminino",
        telefone: "(18) 99999-8888",
        celular: "(18) 99999-8888",
        email: "mariana.santos@email.com",
        responsavel: "",
        nomeMae: "Helena Alves Santos",
        nomePai: "Roberto Santos",
        municipio: "Dracena",
        status: "Ativo",
        racaCor: "Parda",
        etnia: "-",
        nacionalidade: "Brasileira",
        municipioNascimento: "Dracena",
        ufNascimento: "SP",
        unidadeSaude: "Santa Casa",
        equipe: "Psicologia",
        microarea: "01",
        profissionalReferencia: "Andressa de Sales Fernandes",
        cep: "17900-000",
        logradouro: "Rua das Flores",
        numero: "120",
        complemento: "Casa",
        bairro: "Centro",
        uf: "SP",
        pontoReferencia: "Próximo à praça central",
        estadoCivil: "Solteira",
        escolaridade: "Ensino Superior Completo",
        profissao: "Professora",
        religiao: "Católica",
        tipoSanguineo: "O+",
        orientacaoSexual: "-",
        identidadeGenero: "-",
        observacoesCadastrais: "Cadastro fictício utilizado para visualização do protótipo."
    };

    const atendimento = {
        paciente: pacienteFicticio,
        profissional: "Andressa de Sales Fernandes",
        dataAtendimento: "31/05/2026",
        horaInicio: "09:00",
        horaTermino: "09:50",
        tipoAtendimento: "Presencial",

        queixaPrincipal: "Paciente relata ansiedade, dificuldade para dormir e preocupação excessiva com demandas familiares e profissionais.",
        evolucaoAtendimento: "Durante o atendimento, apresentou fala organizada, humor ansioso e boa colaboração. Demonstrou compreensão das orientações propostas.",
        intervencoesRealizadas: "Escuta ativa, acolhimento, psicoeducação sobre ansiedade e orientação sobre higiene do sono.",
        condutasRapidas: ["Atendimento individual", "Psicoeducação", "Retorno agendado"],
        conduta: "Manter acompanhamento psicológico semanal e reavaliar sintomas nas próximas sessões.",
        observacoesComplementares: "Paciente orientada a procurar atendimento de urgência em caso de piora importante.",
        orientacoesPaciente: "Praticar respiração diafragmática diariamente. Evitar uso de telas antes de dormir. Registrar pensamentos automáticos durante a semana.",

        anamnese: {
            queixaPrincipal: "Ansiedade, insônia e preocupação excessiva.",
            hma: "Sintomas iniciados há aproximadamente três meses, com piora nas últimas semanas. Relata tensão, dificuldade de concentração e sono não reparador.",
            historiaFamiliar: "Reside com a mãe. Refere boa relação familiar, porém com conflitos ocasionais relacionados à sobrecarga de responsabilidades.",
            historicoDesenvolvimento: "Sem intercorrências relevantes no desenvolvimento. Histórico escolar adequado.",
            historicoPessoalSocial: "Rede de apoio composta por familiares e amigas. Refere lazer reduzido e rotina de sono irregular.",
            tratamentosAnteriores: "Realizou psicoterapia há dois anos, com boa resposta.",
            medicoes: {
                peso: "68",
                altura: "165",
                imc: "24,98",
                classificacao: "IMC: 24,98 kg/m² — Adequado ou Eutrófico"
            },
            dum: "2026-05-10"
        },

        alergias: [
            {
                descricao: "Dipirona",
                tipo: "Medicamento",
                criticidade: "Alta"
            }
        ],

        problemas: [
            {
                ciap: "",
                cid: "F41.1",
                descricao: "Ansiedade Generalizada",
                situacao: "Ativo",
                inicio: "2026-03-01",
                observacao: "Em acompanhamento psicológico."
            }
        ],

        resultadosExames: [
            {
                nome: "Avaliação psicológica inicial",
                resultado: "Sintomas compatíveis com ansiedade leve a moderada.",
                data: "2026-05-31"
            }
        ],

        medicamentosPsiquiatricos: [
            {
                nome: "Sertralina 50 mg",
                dose: "50 mg",
                frequencia: "1 vez ao dia",
                prescritor: "Psiquiatra",
                inicio: "2026-04-10",
                usoAtual: "Sim",
                observacoes: "Paciente refere boa adesão."
            }
        ],

        medicamentosGerais: [
            {
                nome: "Losartana 50 mg",
                dose: "50 mg",
                frequencia: "1 vez ao dia",
                prescritor: "Clínico geral",
                motivo: "Hipertensão arterial",
                inicio: "2025-11-15",
                observacoes: "Uso contínuo."
            }
        ],

        documentos: [
            {
                nome: "Relatório psicológico inicial.pdf",
                tipo: "Relatório",
                data: "31/05/2026"
            }
        ],

        prescricoes: [
            {
                tipoReceita: "Receita simples",
                medicamento: "Sertralina 50 mg",
                posologia: "Tomar 1 comprimido via oral pela manhã, por 30 dias.",
                profissional: "Andressa de Sales Fernandes",
                data: "31/05/2026"
            }
        ],

        examesSolicitados: [
            {
                grupo: "Neuropsicologia",
                nome: "Avaliação neuropsicológica",
                cid: "F41.1",
                justificativa: "Avaliação complementar devido à queixa de dificuldade de concentração.",
                data: "31/05/2026",
                profissional: "Andressa de Sales Fernandes",
                status: "Pendente"
            }
        ],

        encaminhamento: {
            destinos: ["Psiquiatria"],
            motivo: "Paciente apresenta sintomas ansiosos persistentes.",
            objetivo: "Avaliação medicamentosa e acompanhamento compartilhado.",
            observacoes: "Encaminhamento discutido com a paciente.",
            texto: "Encaminho a paciente Mariana Alves Santos para avaliação psiquiátrica, devido a sintomas ansiosos persistentes, com objetivo de avaliação medicamentosa e acompanhamento compartilhado."
        },

        atestado: {
            texto: "Declaro, para os devidos fins, que Mariana Alves Santos compareceu a atendimento psicológico nesta instituição em 31/05/2026, às 09:00."
        },

        atualizadoEm: "2026-05-31T12:50:00.000Z",
        finalizadoEm: "2026-05-31T12:50:00.000Z",
        status: "Atendimento realizado"
    };

    const agendamento = {
        paciente: pacienteFicticio,
        tipo: "Consulta Psicológica",
        data: "2026-06-10",
        hora: "09:00",
        profissional: "Andressa de Sales Fernandes",
        status: "Agendado"
    };

    localStorage.setItem("pacientes", JSON.stringify([pacienteFicticio]));
    localStorage.setItem("pacienteProntuario", JSON.stringify(pacienteFicticio));
    localStorage.setItem("historicoAtendimentos", JSON.stringify([atendimento]));
    localStorage.setItem("agendamentos", JSON.stringify([agendamento]));
}