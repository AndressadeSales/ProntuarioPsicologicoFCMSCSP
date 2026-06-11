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
    const form = document.getElementById("formColaborador");

    if (!form) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        salvarColaborador();
    });
}

function salvarColaborador() {
    const nome = valor("nomeCompleto").trim();
    const cpf = valor("cpf").trim();
    const dataNascimento = valor("dataNascimento").trim();
    const email = valor("email").trim();
    const unidadeAtuacao = valor("unidadeAtuacao").trim();
    const equipeSetor = valor("equipeSetor").trim();
    const cargoFuncao = valor("cargoFuncao").trim();
    const perfilAcesso = valor("perfilAcesso").trim();

    if (!nome || !cpf || !dataNascimento || !email || !unidadeAtuacao || !equipeSetor || !cargoFuncao || !perfilAcesso) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    if (!validarCPF(cpf)) {
        alert("CPF inválido.");
        return;
    }

    if (cargoExigeRegistro(cargoFuncao) && !valor("registroClasse").trim()) {
        alert("Informe o registro de classe/profissional.");
        return;
    }

    const colaboradores = JSON.parse(localStorage.getItem("colaboradores")) || [];

    const cpfLimpo = limparNumeros(cpf);

    const cpfDuplicado = colaboradores.some(c => limparNumeros(c.cpf || "") === cpfLimpo);

    if (cpfDuplicado) {
        alert("Já existe um colaborador cadastrado com este CPF.");
        return;
    }

    const colaborador = coletarDadosColaborador();

    colaboradores.push(colaborador);

    localStorage.setItem("colaboradores", JSON.stringify(colaboradores));

    localStorage.setItem("colaboradorSelecionado", JSON.stringify(colaborador));
    localStorage.setItem("colaboradorSelecionadoId", colaborador.id);

    registrarLog(
        `Colaborador ${colaborador.nome} cadastrado por ${localStorage.getItem("usuarioNome") || "Usuário"}.`
    );

    alert("Colaborador cadastrado com sucesso!");

    window.location.href = "lista-colaboradores.html";
}

function coletarDadosColaborador() {
    return {
        id: Date.now(),

        nome: valor("nomeCompleto"),
        cpf: valor("cpf"),
        dataNascimento: valor("dataNascimento"),
        telefone: valor("telefone"),
        email: valor("email"),

        unidadeAtuacao: valor("unidadeAtuacao"),
        equipeSetor: valor("equipeSetor"),
        cargoFuncao: valor("cargoFuncao"),
        registroClasse: valor("registroClasse"),

        usuarioLogin: valor("usuarioLogin"),
        perfilAcesso: valor("perfilAcesso"),
        status: valor("status"),

        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        criadoPor: localStorage.getItem("usuarioNome") || "Usuário"
    };
}

/* =====================================================
   REGISTRO DE CLASSE DINÂMICO
===================================================== */

function verificarRegistroClasse() {
    const cargo = valor("cargoFuncao");
    const area = document.getElementById("areaRegistroClasse");
    const label = document.getElementById("labelRegistroClasse");
    const input = document.getElementById("registroClasse");

    if (!area || !label || !input) return;

    const registros = {
        "Psicólogo": "CRP *",
        "Técnico de psicologia": "Registro profissional *",
        "Médico": "CRM *",
        "Enfermeiro": "COREN *"
    };

    if (registros[cargo]) {
        area.classList.remove("hidden");
        label.innerText = registros[cargo];
        input.placeholder = exemploRegistro(cargo);
        input.required = true;
    } else {
        area.classList.add("hidden");
        label.innerText = "Registro de classe";
        input.placeholder = "";
        input.required = false;
        input.value = "";
    }
}

function cargoExigeRegistro(cargo) {
    return [
        "Psicólogo",
        "Técnico de psicologia",
        "Médico",
        "Enfermeiro"
    ].includes(cargo);
}

function exemploRegistro(cargo) {
    if (cargo === "Psicólogo") return "Ex.: CRP 06/123456";
    if (cargo === "Médico") return "Ex.: CRM 123456-SP";
    if (cargo === "Enfermeiro") return "Ex.: COREN 123456";
    if (cargo === "Técnico de psicologia") return "Ex.: Registro profissional";
    return "";
}

/* =====================================================
   LIMPAR FORMULÁRIO
===================================================== */

function limparFormulario() {
    if (!confirm("Deseja limpar todos os campos do formulário?")) return;

    document.getElementById("formColaborador").reset();

    verificarRegistroClasse();
}

/* =====================================================
   MÁSCARAS
===================================================== */

function configurarMascaras() {
    aplicarMascara("cpf", mascaraCPF);
    aplicarMascara("telefone", mascaraTelefone);
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
        tipo: "Cadastro de colaborador"
    });

    localStorage.setItem("historicoSistema", JSON.stringify(logs));
}

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function valor(id) {
    return document.getElementById(id)?.value || "";
}

function setTexto(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.innerText = texto;
    }
}

function limparNumeros(valorCampo) {
    return String(valorCampo || "").replace(/\D/g, "");
}