let pacientes = [];
let pacientesFiltrados = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSidebar();
    carregarPacientes();
    pacientesFiltrados = pacientes;
    atualizarResultado(pacientes);
});


/* =========================
   PACIENTES
========================= */

function carregarPacientes() {
    const pacientesSalvos =
        JSON.parse(localStorage.getItem("pacientes")) || [];

    if (pacientesSalvos.length > 0) {
        pacientes = pacientesSalvos;
        return;
    }

    pacientes = [
        {
            nome: "Mariana Alves Santos",
            cpf: "123.456.789-00",
            cns: "700000000000001",
            dataNascimento: "1994-08-15",
            idade: "31 anos",
            telefone: "(18) 99999-8888",
            responsavel: "-",
            nomeMae: "Helena Alves Santos",
            municipio: "Dracena",
            status: "Ativo"
        },
        {
            nome: "Viridiana Silva",
            cpf: "987.654.321-00",
            cns: "700000000000034",
            dataNascimento: "1993-04-22",
            idade: "33 anos",
            telefone: "-",
            responsavel: "-",
            nomeMae: "Ana Maria Silva",
            municipio: "Dracena",
            status: "Ativo"
        },
        {
            nome: "João Pedro Almeida",
            cpf: "456.789.123-00",
            cns: "700000000000056",
            dataNascimento: "2012-09-10",
            idade: "13 anos",
            telefone: "(18) 98888-7777",
            responsavel: "Carla Almeida",
            nomeMae: "Carla Almeida",
            municipio: "Dracena",
            status: "Ativo"
        },
        {
            nome: "Letícia Moura Fernandes",
            cpf: "321.654.987-00",
            cns: "700000000000078",
            dataNascimento: "1988-01-30",
            idade: "38 anos",
            telefone: "(18) 97777-6666",
            responsavel: "-",
            nomeMae: "Rosa Moura Fernandes",
            municipio: "Tupi Paulista",
            status: "Inativo"
        }
    ];

    localStorage.setItem("pacientes", JSON.stringify(pacientes));
}

function buscarPacientes() {
    const busca =
        document
            .getElementById("buscaPrincipal")
            .value
            .toLowerCase()
            .trim();

    const dataNascimento =
        document
            .getElementById("dataNascimento")
            .value;

    const nomeMae =
        document
            .getElementById("nomeMae")
            .value
            .toLowerCase()
            .trim();

    const municipio =
        document
            .getElementById("municipio")
            .value
            .toLowerCase()
            .trim();

    const status =
        document.querySelector(
            "input[name='statusPaciente']:checked"
        ).value;

    pacientesFiltrados = pacientes.filter(paciente => {
        const atendeBusca =
            !busca ||
            (paciente.nome || "")
                .toLowerCase()
                .includes(busca) ||
            (paciente.cpf || "")
                .toLowerCase()
                .includes(busca) ||
            (paciente.cns || "")
                .toLowerCase()
                .includes(busca);

        const atendeNascimento =
            !dataNascimento ||
            paciente.dataNascimento === dataNascimento;

        const atendeMae =
            !nomeMae ||
            (paciente.nomeMae || "")
                .toLowerCase()
                .includes(nomeMae);

        const atendeMunicipio =
            !municipio ||
            (paciente.municipio || "")
                .toLowerCase()
                .includes(municipio);

        const atendeStatus =
            status === "Todos" ||
            (paciente.status || "Ativo") === status;

        return (
            atendeBusca &&
            atendeNascimento &&
            atendeMae &&
            atendeMunicipio &&
            atendeStatus
        );
    });

    atualizarResultado(pacientesFiltrados);
}

/* =========================
   LIMPAR
========================= */

function limparFiltros() {
    document.getElementById("buscaPrincipal").value = "";
    document.getElementById("dataNascimento").value = "";
    document.getElementById("nomeMae").value = "";
    document.getElementById("municipio").value = "";

    document.querySelector(
        "input[value='Todos']"
    ).checked = true;

    pacientesFiltrados = [];

    atualizarResultado([]);
}

/* =========================
   RESULTADOS
========================= */

function atualizarResultado(lista) {
    const container =
        document.getElementById("listaPacientes");

    const mensagem =
        document.getElementById("mensagemBusca");

    const total =
        document.getElementById("totalResultados");

    container.innerHTML = "";

    total.innerText =
        `${lista.length} paciente(s)`;

    if (lista.length === 0) {
        mensagem.innerHTML = `
            <i class="fa-solid fa-circle-info"></i>
            Nenhum paciente encontrado.
        `;

        return;
    }

    mensagem.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        ${lista.length} paciente(s) encontrado(s).
    `;

    lista.forEach((paciente, index) => {
        const card = document.createElement("div");

        card.className = "card-paciente";

        card.innerHTML = `
            <div class="paciente-info">
                <h4>${paciente.nome || "-"}</h4>

                <p>
                    <strong>CPF:</strong>
                    ${paciente.cpf || "-"}
                </p>

                <p>
                    <strong>CNS:</strong>
                    ${paciente.cns || "-"}
                </p>

                <p>
                    <strong>Nascimento:</strong>
                    ${formatarData(paciente.dataNascimento)}
                </p>

                <p>
                    <strong>Telefone:</strong>
                    ${paciente.telefone || "-"}
                </p>

                <p>
                    <strong>Último Atendimento:</strong>
                    ${obterUltimoAtendimento(paciente)}
                </p>

                <span class="status ${(paciente.status || "Ativo").toLowerCase()}">
                    ${paciente.status || "Ativo"}
                </span>
            </div>

            <div class="paciente-acoes">
                <button
                    class="btn-visualizar"
                    onclick="abrirProntuario(${index})">

                    <i class="fa-solid fa-eye"></i>
                    Visualizar
                </button>

                <div class="menu-container">
                    <button
                        class="menu-btn-card"
                        onclick="toggleMenuPaciente(event,'menu-${index}')">

                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    <div
                        class="menu-opcoes"
                        id="menu-${index}">

                        <a href="#"
                           onclick="abrirProntuario(${index})">

                            <i class="fa-solid fa-eye"></i>
                            Visualizar prontuário
                        </a>

                        <a href="#"
                           onclick="novoAtendimento(${index})">

                            <i class="fa-solid fa-stethoscope"></i>
                            Novo atendimento
                        </a>

                        <a href="#"
                           onclick="imprimirProntuario(${index})">

                            <i class="fa-solid fa-print"></i>
                            Imprimir prontuário
                        </a>

                        <a href="#"
                           onclick="editarPaciente(${index})">

                            <i class="fa-solid fa-user-pen"></i>
                            Editar cadastro
                        </a>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

/* =========================
   MENU PACIENTE
========================= */

function toggleMenuPaciente(event, id) {
    event.stopPropagation();

    document
        .querySelectorAll(".menu-opcoes")
        .forEach(menu => {
            if (menu.id !== id) {
                menu.classList.remove("active");
            }
        });

    document
        .getElementById(id)
        .classList.toggle("active");
}

document.addEventListener("click", () => {
    document
        .querySelectorAll(".menu-opcoes")
        .forEach(menu => {
            menu.classList.remove("active");
        });
});

/* =========================
   AÇÕES
========================= */

function abrirProntuario(index) {
    const paciente =
        pacientesFiltrados[index];

    localStorage.setItem(
        "pacienteProntuario",
        JSON.stringify(paciente)
    );

    window.location.href =
        "visualizar-prontuario.html";
}

function novoAtendimento(index) {
    const paciente =
        pacientesFiltrados[index];

    localStorage.setItem(
        "pacienteAtendimento",
        JSON.stringify(paciente)
    );

    window.location.href =
        "atendimento.html";
}

function editarPaciente(index) {
    const paciente =
        pacientesFiltrados[index];

    localStorage.setItem(
        "pacienteEdicao",
        JSON.stringify(paciente)
    );

    alert("Tela de edição será implementada.");
}

function imprimirProntuario(index) {
    const paciente =
        pacientesFiltrados[index];

    const janela =
        window.open("", "_blank");

    janela.document.write(`
        <html>
        <head>
            <title>Prontuário</title>
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

                p{
                    margin:8px 0;
                    font-size:14px;
                }
            </style>
        </head>

        <body>
            <h1>Prontuário do Paciente</h1>

            <p><strong>Nome:</strong> ${paciente.nome || "-"}</p>
            <p><strong>CPF:</strong> ${paciente.cpf || "-"}</p>
            <p><strong>CNS:</strong> ${paciente.cns || "-"}</p>
            <p><strong>Telefone:</strong> ${paciente.telefone || "-"}</p>
            <p><strong>Nascimento:</strong> ${formatarData(paciente.dataNascimento)}</p>
            <p><strong>Último atendimento:</strong> ${obterUltimoAtendimento(paciente)}</p>

            <script>
                window.print();
            </script>
        </body>
        </html>
    `);

    janela.document.close();
}

/* =========================
   HISTÓRICO
========================= */

function obterUltimoAtendimento(paciente) {
    const historico =
        JSON.parse(
            localStorage.getItem("historicoAtendimentos")
        ) || [];

    const atendimentos =
        historico.filter(item => {
            return (
                item?.paciente?.cpf === paciente.cpf ||
                item?.paciente?.cns === paciente.cns
            );
        });

    if (atendimentos.length === 0) {
        return "Nenhum";
    }

    const ultimo =
        atendimentos[atendimentos.length - 1];

    return formatarDataHora(
        ultimo.finalizadoEm ||
        ultimo.atualizadoEm
    );
}

/* =========================
   UTIL
========================= */

function formatarData(data) {
    if (!data) return "-";

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarDataHora(data) {
    if (!data) return "-";

    return new Date(data)
        .toLocaleString("pt-BR");
}