const ADD_PRODUTO_API_URL = "http://localhost:8080/api/produtos";

const formProduto = document.getElementById("form-produto");
const mensagemStatus = document.getElementById("mensagemStatus");

if (formProduto) {
    formProduto.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const preco = parseFloat(document.getElementById("preco").value);
        const descricao = document.getElementById("descricao").value;
        const imagem = document.getElementById("urlImagem").value;

        const token = localStorage.getItem("token");

        if (!token) {
            mensagemStatus.textContent = "Usuário não logado!";
            mensagemStatus.style.color = "red";
            return;
        }

        try {
            const response = await fetch(ADD_PRODUTO_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ nome, preco, descricao, imagem })
            });

            if (response.ok) {
                mensagemStatus.textContent = " Produto cadastrado!";
                mensagemStatus.style.color = "green";
                formProduto.reset();
            } else {
                mensagemStatus.textContent = " Erro ao cadastrar produto.";
                mensagemStatus.style.color = "red";
            }
        } catch (err) {
            mensagemStatus.textContent = " Erro de conexão.";
            mensagemStatus.style.color = "red";
        }
    });
}
