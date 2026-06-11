/* =====================================================
   LOGIN
===================================================== */

const olho = document.getElementById("olho");
const senha = document.getElementById("senha");

if (olho && senha) {
    olho.addEventListener("click", () => {
        if (senha.type === "password") {
            senha.type = "text";
            olho.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            senha.type = "password";
            olho.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
}

function entrar() {
    const usuario = document.getElementById("usuario").value;
    const senhaLogin = document.getElementById("senha").value;

    if (usuario === "202644069" && senhaLogin === "550885") {
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("usuarioNome", "Andressa de Sales Fernandes");
        localStorage.setItem("usuarioCargo", "Administrador(a)");
        localStorage.setItem("usuarioAgenda", "Andressa de Sales Adm");

        window.location.href = "agenda.html";
    } else {
        alert("Usuário ou senha incorretos.");
    }
}

// Permite fazer login apertando Enter

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        entrar();
    }
});

// RECUPERAR LOGIN

function enviarEmail() {
    const email = document.querySelector("input[type='email']").value;

    if (email === "") {
        alert("Digite seu e-mail.");
    } else {
        alert("Link enviado para: " + email);
    }
}

/* =====================================================
   IMAGEM ALEATÓRIA NO LOGIN
===================================================== */

const imagemLogin = document.getElementById("imagemLogin");

const imagens = [
    "loginimg1.jpeg",
    "loginimg2.jpeg",
    "loginimg3.jpeg"
];

if (imagemLogin) {
    const indiceAleatorio = Math.floor(Math.random() * imagens.length);
    imagemLogin.src = imagens[indiceAleatorio];

    imagemLogin.onerror = function () {
        imagemLogin.src = "loginimg1.jpeg";
    };
}