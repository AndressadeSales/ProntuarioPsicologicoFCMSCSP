const CONFIG_IMPRESSAO = {
    unidade: "UNIDADE DE SAÚDE",
    endereco: "R. Dr. Cesário Mota Júnior, 112",
    bairroCidade: "Vila Buarque, São Paulo - SP",
    cep: "CEP: 01221-020",
    telefone: "",
    logo: "logosantacasa.webp"
};

function obterDataHoraAtual() {
    const agora = new Date();

    const data = agora.toLocaleDateString("pt-BR");
    const hora = agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    return `${data} às ${hora}`;
}

function gerarCodigoDocumento() {
    const agora = new Date();

    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    const hora = String(agora.getHours()).padStart(2, "0");
    const minuto = String(agora.getMinutes()).padStart(2, "0");
    const segundo = String(agora.getSeconds()).padStart(2, "0");

    return `DOC-${ano}${mes}${dia}-${hora}${minuto}${segundo}`;
}

function obterUsuarioLogado() {
    try {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

        if (usuario) {
            return {
                nome: usuario.nome || "Usuário do Sistema",
                cargo: usuario.cargo || usuario.funcao || "Profissional"
            };
        }
    } catch (erro) {
        console.warn("Erro ao buscar usuário logado:", erro);
    }

    return {
        nome: "Usuário do Sistema",
        cargo: "Profissional"
    };
}

function gerarCabecalhoImpressao() {
    return `
        <header class="print-header">
            <div class="print-brand">
                <img src="${CONFIG_IMPRESSAO.logo}" class="print-logo" alt="Santa Casa">

                <div class="print-brand-text">
                    <h1>SANTA CASA</h1>
                    <span>DE MISERICÓRDIA</span>
                </div>
            </div>

            <div class="print-unit">
                <strong>${CONFIG_IMPRESSAO.unidade}</strong>
                <p>
                    ${CONFIG_IMPRESSAO.endereco}<br>
                    ${CONFIG_IMPRESSAO.bairroCidade}<br>
                    ${CONFIG_IMPRESSAO.cep}
                    ${CONFIG_IMPRESSAO.telefone ? `<br>${CONFIG_IMPRESSAO.telefone}` : ""}
                </p>
            </div>
        </header>

        <div class="print-line"></div>
    `;
}

function gerarRodapeImpressao() {
    const usuario = obterUsuarioLogado();
    const dataHora = obterDataHoraAtual();
    const codigo = gerarCodigoDocumento();

    return `
        <footer class="print-footer">
            <div class="print-footer-line"></div>

            <div class="print-footer-main">
                <div class="print-footer-item">
                    <div class="footer-icon">▣</div>
                    <p>
                        Impresso em ${dataHora}<br>
                        por <strong>${usuario.nome}</strong> (${usuario.cargo})
                    </p>
                </div>

                <div class="print-footer-item">
                    <div class="footer-icon">▣</div>
                    <p>
                        Documento gerado eletronicamente<br>
                        pelo Sistema PsiSaúde
                    </p>
                </div>

                <div class="print-footer-item">
                    <div class="footer-icon">▣</div>
                    <p>
                        Código do documento:<br>
                        <strong>${codigo}</strong>
                    </p>
                </div>
            </div>

            <div class="print-page-number">
                Página 1 de 1
            </div>
        </footer>
    `;
}

function gerarAssinatura(nome, cargo, registro = "") {
    return `
        <div class="print-signature">
            <div class="print-signature-line"></div>
            <p><strong>${nome}</strong></p>
            <p>${cargo}</p>
            ${registro ? `<p>${registro}</p>` : ""}
        </div>
    `;
}

function imprimirDocumento(titulo, conteudoCentral) {
    const janela = window.open("", "_blank", "width=900,height=800");

    janela.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>${titulo}</title>
            <link rel="stylesheet" href="print.css">
        </head>

        <body>
            <main class="print-page">
                <section>
                    ${gerarCabecalhoImpressao()}

                    <h2 class="print-title">${titulo}</h2>

                    ${conteudoCentral}
                </section>

                ${gerarRodapeImpressao()}
            </main>
        </body>
        </html>
    `);

    janela.document.close();

    janela.onload = function () {
        janela.focus();
        janela.print();
    };
}