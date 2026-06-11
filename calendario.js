const mesesCalendario = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const estadoCalendario = {};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-calendario]").forEach(input => {
        const hoje = new Date();

        estadoCalendario[input.id] = {
            mes: hoje.getMonth(),
            ano: hoje.getFullYear()
        };

        input.addEventListener("click", () => abrirCalendario(input.id));
        input.addEventListener("input", () => mascaraData(input));
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".calendario-wrapper")) {
            fecharTodosCalendarios();
        }
    });
});

function abrirCalendario(idInput) {
    fecharTodosCalendarios();

    const calendario = document.getElementById(`cal-${idInput}`);

    if (!calendario) return;

    calendario.classList.remove("closed");
    renderizarCalendario(idInput);
}

function fecharTodosCalendarios() {
    document.querySelectorAll(".mini-calendar").forEach(cal => {
        cal.classList.add("closed");
    });
}

function renderizarCalendario(idInput) {
    const calendario = document.getElementById(`cal-${idInput}`);
    const estado = estadoCalendario[idInput];

    const primeiroDia = new Date(estado.ano, estado.mes, 1);
    const ultimoDia = new Date(estado.ano, estado.mes + 1, 0);

    const diaSemanaInicio = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();

    let diasHTML = "";

    for (let i = 0; i < diaSemanaInicio; i++) {
        diasHTML += `<span></span>`;
    }

    const hoje = new Date();

    for (let dia = 1; dia <= totalDias; dia++) {
        const ehHoje =
            dia === hoje.getDate() &&
            estado.mes === hoje.getMonth() &&
            estado.ano === hoje.getFullYear();

        diasHTML += `
            <span
                class="mini-day ${ehHoje ? "today" : ""}"
                onclick="selecionarData('${idInput}', ${dia})">
                ${dia}
            </span>
        `;
    }

    calendario.innerHTML = `
        <div class="mini-calendar-box">

            <div class="mini-calendar-header">

                <i class="fa-solid fa-chevron-left" onclick="mudarMes('${idInput}', -1)"></i>

                <strong>${mesesCalendario[estado.mes]}</strong>

                <select class="select-ano-calendario" onchange="mudarAno('${idInput}', this.value)">
                    ${gerarOpcoesAno(estado.ano)}
                </select>

                <button type="button" onclick="irParaHoje('${idInput}')">
                    Hoje
                </button>

                <i class="fa-solid fa-chevron-right" onclick="mudarMes('${idInput}', 1)"></i>

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

            <div class="mini-days">
                ${diasHTML}
            </div>

        </div>
    `;
}

function gerarOpcoesAno(anoAtual) {
    let html = "";

    for (let ano = anoAtual - 80; ano <= anoAtual + 10; ano++) {
        html += `
            <option value="${ano}" ${ano === anoAtual ? "selected" : ""}>
                ${ano}
            </option>
        `;
    }

    return html;
}

function mudarAno(idInput, ano) {
    estadoCalendario[idInput].ano = Number(ano);
    renderizarCalendario(idInput);
}

function mudarMes(idInput, direcao) {
    const estado = estadoCalendario[idInput];

    estado.mes += direcao;

    if (estado.mes < 0) {
        estado.mes = 11;
        estado.ano--;
    }

    if (estado.mes > 11) {
        estado.mes = 0;
        estado.ano++;
    }

    renderizarCalendario(idInput);
}

function irParaHoje(idInput) {
    const hoje = new Date();

    estadoCalendario[idInput].mes = hoje.getMonth();
    estadoCalendario[idInput].ano = hoje.getFullYear();

    selecionarData(idInput, hoje.getDate());
}

function selecionarData(idInput, dia) {
    const input = document.getElementById(idInput);
    const estado = estadoCalendario[idInput];

    const diaFormatado = String(dia).padStart(2, "0");
    const mesFormatado = String(estado.mes + 1).padStart(2, "0");

    input.value = `${diaFormatado}/${mesFormatado}/${estado.ano}`;

    fecharTodosCalendarios();
}

function mascaraData(input) {
    let valor = input.value.replace(/\D/g, "");

    if (valor.length > 8) {
        valor = valor.slice(0, 8);
    }

    if (valor.length >= 5) {
        valor = valor.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (valor.length >= 3) {
        valor = valor.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }

    input.value = valor;
}