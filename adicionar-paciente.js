/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSidebar();
    configurarFormulario();
    configurarMascaras();
});


/* =====================================================
   FORMULÁRIO
===================================================== */

function configurarFormulario() {
    const form = document.getElementById("formPaciente");

    if (!form) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        salvarPaciente();
    });
}

function salvarPaciente() {
    const nome = valor("nome").trim();
    const cpf = valor("cpf").trim();
    const cns = valor("cns").trim();
    const dataNascimento = valor("dataNascimento").trim();
    const celular = valor("celular").trim();

    if (!nome || !cpf || !dataNascimento || !celular) {
        alert("Preencha os campos obrigatórios: nome, CPF, data de nascimento e celular.");
        return;
    }

    if (!validarCPF(cpf)) {
        alert("CPF inválido.");
        return;
    }

    if (cns && !validarCNS(cns)) {
        alert("CNS inválido. O CNS deve conter 15 números.");
        return;
    }

    const idade = calcularIdade(dataNascimento);

    if (idade < 18) {
        const responsavelNome = valor("responsavelNome").trim();
        const responsavelCpf = valor("responsavelCpf").trim();
        const responsavelTelefone = valor("responsavelTelefone").trim();
        const responsavelParentesco = valor("responsavelParentesco");

        if (!responsavelNome || !responsavelCpf || !responsavelTelefone || !responsavelParentesco) {
            alert("Para menores de 18 anos, os dados do responsável são obrigatórios.");
            return;
        }

        if (!validarCPF(responsavelCpf)) {
            alert("CPF do responsável inválido.");
            return;
        }
    }

    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

    const cpfLimpo = limparNumeros(cpf);
    const cnsLimpo = limparNumeros(cns);

    const cpfDuplicado = pacientes.some(p => limparNumeros(p.cpf || "") === cpfLimpo);

    if (cpfDuplicado) {
        alert("Já existe um paciente cadastrado com este CPF.");
        return;
    }

    if (cnsLimpo) {
        const cnsDuplicado = pacientes.some(p => limparNumeros(p.cns || "") === cnsLimpo);

        if (cnsDuplicado) {
            alert("Já existe um paciente cadastrado com este CNS.");
            return;
        }
    }

    const paciente = coletarDadosPaciente(idade);

    pacientes.push(paciente);

    localStorage.setItem("pacientes", JSON.stringify(pacientes));

    /* Preparado para banco de dados futuro */
    localStorage.setItem("pacienteSelecionado", JSON.stringify(paciente));
    localStorage.setItem("pacienteSelecionadoId", paciente.id);

    registrarLog(
        `Paciente ${paciente.nome} cadastrado por ${localStorage.getItem("usuarioNome") || "Usuário"}.`
    );

    alert("Paciente cadastrado com sucesso!");

    window.location.href = "visualizar-prontuario.html?id=" + paciente.id;
}

/* =====================================================
   COLETAR DADOS
===================================================== */

function coletarDadosPaciente(idade) {
    return {
        id: Date.now(),

        nome: valor("nome"),
        nomeSocial: valor("nomeSocial"),
        cpf: valor("cpf"),
        cns: valor("cns"),
        dataNascimento: valor("dataNascimento"),
        idade: idade,
        sexo: valor("sexo"),
        racaCor: valor("racaCor"),
        etnia: valor("etnia"),
        nomeMae: valor("nomeMae"),
        nomePai: valor("nomePai"),

        naturalidade: {
            nacionalidade: valor("nacionalidade"),
            municipioNascimento: valor("municipioNascimento"),
            ufNascimento: valor("ufNascimento")
        },

        contatos: {
            celular: valor("celular"),
            telefoneResidencial: valor("telefoneResidencial"),
            telefoneRecado: valor("telefoneRecado"),
            email: valor("email")
        },

        equipeResponsavel: {
            unidadeSaude: valor("unidadeSaude"),
            equipe: valor("equipe"),
            microarea: valor("microarea"),
            profissionalReferencia: valor("profissionalReferencia")
        },

        residencia: {
            cep: valor("cep"),
            logradouro: valor("logradouro"),
            numero: valor("numero"),
            complemento: valor("complemento"),
            bairro: valor("bairro"),
            municipio: valor("municipio"),
            uf: valor("uf"),
            pontoReferencia: valor("pontoReferencia")
        },

        responsavel: {
            nome: valor("responsavelNome"),
            cpf: valor("responsavelCpf"),
            telefone: valor("responsavelTelefone"),
            parentesco: valor("responsavelParentesco")
        },

        informacoesComplementares: {
            estadoCivil: valor("estadoCivil"),
            escolaridade: valor("escolaridade"),
            profissao: valor("profissao"),
            religiao: valor("religiao"),
            tipoSanguineo: valor("tipoSanguineo"),

            desejaInformarOrientacaoSexual: radioValor("desejaOrientacao"),
            orientacaoSexual: radioValor("desejaOrientacao") === "Sim" ? valor("orientacaoSexual") : "",

            desejaInformarIdentidadeGenero: radioValor("desejaGenero"),
            identidadeGenero: radioValor("desejaGenero") === "Sim" ? valor("identidadeGenero") : "",

            observacoes: valor("observacoes")
        },

        criadoEm: new Date().toISOString(),
        criadoPor: localStorage.getItem("usuarioNome") || "Usuário"
    };
}

/* =====================================================
   CAMPOS CONDICIONAIS
===================================================== */

function toggleOrientacaoSexual() {
    const deseja = radioValor("desejaOrientacao");
    const campo = document.getElementById("campoOrientacaoSexual");

    if (!campo) return;

    if (deseja === "Sim") {
        campo.classList.remove("hidden");
    } else {
        campo.classList.add("hidden");
        setValor("orientacaoSexual", "");
    }
}

function toggleIdentidadeGenero() {
    const deseja = radioValor("desejaGenero");
    const campo = document.getElementById("campoIdentidadeGenero");

    if (!campo) return;

    if (deseja === "Sim") {
        campo.classList.remove("hidden");
    } else {
        campo.classList.add("hidden");
        setValor("identidadeGenero", "");
    }
}

/* =====================================================
   LIMPAR
===================================================== */

function limparFormulario() {
    if (!confirm("Deseja limpar todos os campos do formulário?")) return;

    document.getElementById("formPaciente").reset();

    toggleOrientacaoSexual();
    toggleIdentidadeGenero();
}

/* =====================================================
   MÁSCARAS
===================================================== */

function configurarMascaras() {
    aplicarMascara("cpf", mascaraCPF);
    aplicarMascara("responsavelCpf", mascaraCPF);
    aplicarMascara("cep", mascaraCEP);
    aplicarMascara("celular", mascaraTelefone);
    aplicarMascara("telefoneResidencial", mascaraTelefone);
    aplicarMascara("telefoneRecado", mascaraTelefone);
    aplicarMascara("responsavelTelefone", mascaraTelefone);
    aplicarMascara("cns", mascaraCNS);
}

function aplicarMascara(id, funcaoMascara) {
    const campo = document.getElementById(id);

    if (!campo) return;

    campo.addEventListener("input", function() {
        campo.value = funcaoMascara(campo.value);
    });
}

function mascaraCPF(valorCampo) {
    return limparNumeros(valorCampo)
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascaraCEP(valorCampo) {
    return limparNumeros(valorCampo)
        .slice(0, 8)
        .replace(/(\d{5})(\d)/, "$1-$2");
}

function mascaraTelefone(valorCampo) {
    const numeros = limparNumeros(valorCampo).slice(0, 11);

    if (numeros.length <= 10) {
        return numeros
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
}

function mascaraCNS(valorCampo) {
    return limparNumeros(valorCampo).slice(0, 15);
}

/* =====================================================
   CALENDÁRIO DATA DE NASCIMENTO
===================================================== */

let dataNascimentoSelecionada = new Date();
let mesNascimento = new Date().getMonth();
let anoNascimento = new Date().getFullYear();

function toggleCalendarioNascimento() {
    const calendario = document.getElementById("miniCalendarioNascimento");

    if (!calendario) return;

    calendario.classList.toggle("closed");

    renderizarCalendarioNascimento();
}

function renderizarCalendarioNascimento() {
    const calendario = document.getElementById("miniCalendarioNascimento");

    if (!calendario) return;

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    calendario.innerHTML = `
        <div class="mini-calendar-box">
            <div class="mini-calendar-header">
                <button type="button" onclick="selecionarHojeNascimento()">Hoje</button>

                <i class="fa-solid fa-chevron-left" onclick="mudarMesNascimento(-1)"></i>

                <strong>${meses[mesNascimento]} ${anoNascimento}</strong>

                <i class="fa-solid fa-chevron-right" onclick="mudarMesNascimento(1)"></i>
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

            <div class="mini-days" id="diasNascimento"></div>
        </div>
    `;

    const dias = document.getElementById("diasNascimento");

    const primeiroDia = new Date(anoNascimento, mesNascimento, 1);
    const ultimoDia = new Date(anoNascimento, mesNascimento + 1, 0);

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
            mesNascimento === hoje.getMonth() &&
            anoNascimento === hoje.getFullYear()
        ) {
            classe += " today";
        }

        if (
            i === dataNascimentoSelecionada.getDate() &&
            mesNascimento === dataNascimentoSelecionada.getMonth() &&
            anoNascimento === dataNascimentoSelecionada.getFullYear()
        ) {
            classe += " selected";
        }

        dias.innerHTML += `
            <div class="${classe}" onclick="selecionarDataNascimento(${i})">
                ${i}
            </div>
        `;
    }
}

function selecionarDataNascimento(dia) {
    dataNascimentoSelecionada = new Date(anoNascimento, mesNascimento, dia);

    const campo = document.getElementById("dataNascimento");

    if (campo) {
        campo.value = dataNascimentoSelecionada.toLocaleDateString("pt-BR");
    }

    document.getElementById("miniCalendarioNascimento")?.classList.add("closed");
}

function mudarMesNascimento(valor) {
    mesNascimento += valor;

    if (mesNascimento < 0) {
        mesNascimento = 11;
        anoNascimento--;
    }

    if (mesNascimento > 11) {
        mesNascimento = 0;
        anoNascimento++;
    }

    renderizarCalendarioNascimento();
}

function selecionarHojeNascimento() {
    const hoje = new Date();

    dataNascimentoSelecionada = hoje;
    mesNascimento = hoje.getMonth();
    anoNascimento = hoje.getFullYear();

    const campo = document.getElementById("dataNascimento");

    if (campo) {
        campo.value = hoje.toLocaleDateString("pt-BR");
    }

    renderizarCalendarioNascimento();
}

/* =====================================================
   VALIDAÇÕES
===================================================== */

function validarCPF(cpf) {
    cpf = limparNumeros(cpf);

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) resto = 0;

    if (resto !== Number(cpf.charAt(9))) return false;

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) resto = 0;

    return resto === Number(cpf.charAt(10));
}

function validarCNS(cns) {
    cns = limparNumeros(cns);

    return cns.length === 15;
}

function calcularIdade(dataNascimento) {
    let partes;

    if (dataNascimento.includes("/")) {
        partes = dataNascimento.split("/");
        dataNascimento = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    const nascimento = new Date(dataNascimento);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

/* =====================================================
   LOG
===================================================== */

function registrarLog(descricao) {
    const logs = JSON.parse(localStorage.getItem("historicoSistema")) || [];

    logs.unshift({
        descricao,
        usuario: localStorage.getItem("usuarioNome") || "Usuário",
        data: new Date().toLocaleDateString("pt-BR"),
        hora: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        }),
        tipo: "Cadastro de paciente"
    });

    localStorage.setItem("historicoSistema", JSON.stringify(logs));
}

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function valor(id) {
    return document.getElementById(id)?.value || "";
}

function setValor(id, valorCampo) {
    const campo = document.getElementById(id);

    if (campo) {
        campo.value = valorCampo;
    }
}

function setTexto(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.innerText = texto;
    }
}

function radioValor(nome) {
    return document.querySelector(`input[name="${nome}"]:checked`)?.value || "";
}

function limparNumeros(valorCampo) {
    return String(valorCampo || "").replace(/\D/g, "");
}