/* ==========================================
   COLABORADORES FAKE
========================================== */

let colaboradores = [

    {
        id: 1,
        nome: "Andressa de Sales Fernandes",
        cargoFuncao: "Psicólogo",
        supervisorResponsavel: "-",
        equipeSetor: "Psicologia",
        registroClasse: "CRP 06/123456",
        contato: "(11) 99999-1111",
        status: "Ativo"
    },
    {
        id: 2,
        nome: "Mariana Oliveira",
        cargoFuncao: "Gerente da unidade",
        supervisorResponsavel: "-",
        equipeSetor: "Administração",
        registroClasse: "-",
        contato: "(11) 99999-2222",
        status: "Ativo"
    },
    {
        id: 3,
        nome: "Carlos Henrique",
        cargoFuncao: "Médico",
        supervisorResponsavel: "Mariana Oliveira",
        equipeSetor: "Medicina",
        registroClasse: "CRM 123456",
        contato: "(11) 99999-3333",
        status: "Ativo"
    },
    {
        id: 4,
        nome: "Fernanda Souza",
        cargoFuncao: "Enfermeiro",
        supervisorResponsavel: "Mariana Oliveira",
        equipeSetor: "Enfermagem",
        registroClasse: "COREN 987654",
        contato: "(11) 99999-4444",
        status: "Ativo"
    },
    {
        id: 5,
        nome: "Lucas Martins",
        cargoFuncao: "Técnico de psicologia",
        supervisorResponsavel: "Andressa de Sales Fernandes",
        equipeSetor: "Psicologia",
        registroClasse: "RTP 445566",
        contato: "(11) 99999-5555",
        status: "Ativo"
    },
    {
        id: 6,
        nome: "Patrícia Lima",
        cargoFuncao: "Recepcionista",
        supervisorResponsavel: "Mariana Oliveira",
        equipeSetor: "Recepção",
        registroClasse: "-",
        contato: "(11) 99999-6666",
        status: "Inativo"
    },
    {
        id: 7,
        nome: "João Pedro Santos",
        cargoFuncao: "Aluno",
        supervisorResponsavel: "Andressa de Sales Fernandes",
        equipeSetor: "Psicologia",
        registroClasse: "-",
        contato: "(18) 99711-1111",
        status: "Ativo"
    },
    {
        id: 8,
        nome: "Maria Eduarda Lima",
        cargoFuncao: "Estagiária",
        supervisorResponsavel: "Andressa de Sales Fernandes",
        equipeSetor: "Psicologia",
        registroClasse: "-",
        contato: "(18) 99722-2222",
        status: "Ativo"
    },
    {
        id: 9,
        nome: "Gabriel Oliveira",
        cargoFuncao: "Aluno técnico",
        supervisorResponsavel: "Lucas Martins",
        equipeSetor: "Psicologia",
        registroClasse: "-",
        contato: "(18) 99733-3333",
        status: "Ativo"
    }
];

/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderizarColaboradores(colaboradores);

});

function formatarSupervisor(nome) {

    if (!nome || nome === "-") {
        return "-";
    }

    const palavrasIgnoradas = [
        "de",
        "da",
        "do",
        "dos",
        "das"
    ];

    const partes = nome.trim().split(" ");

    let indiceSobrenome = partes.length - 1;

    while (
        indiceSobrenome > 0 &&
        palavrasIgnoradas.includes(
            partes[indiceSobrenome].toLowerCase()
        )
    ) {
        indiceSobrenome--;
    }

    const primeiroNome = partes[0];
    const sobrenome = partes[indiceSobrenome];

    return `${primeiroNome} ${sobrenome.charAt(0)}.`;
}

/* ==========================================
   RENDERIZAÇÃO
========================================== */

function renderizarColaboradores(lista){

    const tabela =
        document.getElementById("tabelaColaboradores");

    const listaVazia =
        document.getElementById("listaVazia");

    const total =
        document.getElementById("totalColaboradores");

    tabela.innerHTML = "";

    total.innerText =
        `${lista.length} colaborador(es)`;

    if(lista.length === 0){

        listaVazia.classList.remove("hidden");

        return;
    }

    listaVazia.classList.add("hidden");

    lista.forEach(colaborador => {

        const totalAlunos = colaboradores.filter(item =>

            (
                item.cargoFuncao === "Aluno" ||
                item.cargoFuncao === "Aluno técnico" ||
                item.cargoFuncao === "Estagiária" ||
                item.cargoFuncao === "Estagiário"
            )

                &&

                item.supervisorResponsavel === colaborador.nome

        ).length;

        tabela.innerHTML += `

            <tr>

                <td>
                    ${colaborador.nome}
                </td>

                <td>
                    ${colaborador.cargoFuncao}
                </td>

                <td>
                    ${formatarSupervisor(
                        colaborador.supervisorResponsavel
                    )}
                </td>

                <td>
                    ${colaborador.cargoFuncao.includes("Aluno") ||
                    colaborador.cargoFuncao.includes("Estagi")
                    ? "-"
                    : totalAlunos}
                </td>

                <td>
                    ${colaborador.equipeSetor}
                </td>

                <td>
                    ${colaborador.registroClasse}
                </td>

                <td>
                    ${colaborador.contato}
                </td>

                <td>
                    <span class="badge ${
                        colaborador.status === "Ativo"
                        ? "ativo"
                        : "inativo"
                    }">

                        ${colaborador.status}

                    </span>
                </td>

                <td>

                    <div class="acoes">

                        <button
                            onclick="visualizarColaborador(${colaborador.id})"
                            title="Visualizar">

                            <i class="fa-solid fa-eye"></i>

                        </button>

                        <button
                            onclick="editarColaborador(${colaborador.id})"
                            title="Editar">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            onclick="inativarColaborador(${colaborador.id})"
                            title="Inativar">

                            <i class="fa-solid fa-user-slash"></i>

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

function filtrarColaboradores(){

    const busca =
        document
        .getElementById("campoBusca")
        .value
        .toLowerCase();

    const cargo =
        document
        .getElementById("filtroCargo")
        .value;

    const status =
        document
        .getElementById("filtroStatus")
        .value;

    const resultado = colaboradores.filter(c => {

        const correspondeBusca =

            c.nome.toLowerCase().includes(busca) ||

            c.cargoFuncao.toLowerCase().includes(busca) ||

            c.equipeSetor.toLowerCase().includes(busca) ||

            c.registroClasse.toLowerCase().includes(busca);

        const correspondeCargo =
            !cargo ||
            c.cargoFuncao === cargo;

        const correspondeStatus =
            !status ||
            c.status === status;

        return (
            correspondeBusca &&
            correspondeCargo &&
            correspondeStatus
        );

    });

    renderizarColaboradores(resultado);

}

/* ==========================================
   AÇÕES
========================================== */

function visualizarColaborador(id){

    alert(
        "Visualizar colaborador ID: " + id +
        "\n\n(Será conectado à página visualizar-colaborador futuramente)"
    );

}

function visualizarColaborador(id) {

    localStorage.setItem("colaboradorSelecionado", id);

    window.location.href = "visualizar-colaborador.html";

}

function inativarColaborador(id){

    const colaborador =
        colaboradores.find(c => c.id === id);

    if(!colaborador) return;

    const confirmar =
        confirm(
            `Deseja alterar o status de ${colaborador.nome}?`
        );

    if(!confirmar) return;

    colaborador.status =
        colaborador.status === "Ativo"
        ? "Inativo"
        : "Ativo";

    filtrarColaboradores();

}