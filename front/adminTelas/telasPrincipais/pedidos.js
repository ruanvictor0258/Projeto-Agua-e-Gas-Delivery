let produtos = [];
let produtoSelecionado = null;
let quantidadeSelecionada = 1;

const token = localStorage.getItem("token"); // JWT do login

// Buscar produtos do back-end
async function fetchProdutos() {
    try {
        const res = await fetch("http://localhost:8080/api/produtos", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        produtos = await res.json();
        renderizarProdutos();
    } catch (err) {
        console.error("Erro ao buscar produtos:", err);
    }
}

// Renderiza cards de produtos
function renderizarProdutos() {
    const container = document.getElementById("product-list-container");
    container.innerHTML = "";

    produtos.forEach(prod => {
        const div = document.createElement("div");
        div.classList.add("produto-card");
        div.innerHTML = `
            <div>
                <h3 class="font-bold text-lg">${prod.nome}</h3>
                <p>${prod.descricao}</p>
                <p class="font-semibold">R$ ${prod.preco.toFixed(2)}</p>
            </div>
            <input type="radio" name="produto-radio">
        `;
        div.onclick = () => {
            produtoSelecionado = prod;
            quantidadeSelecionada = 1;
            // Limpar seleção visual
            document.querySelectorAll(".produto-card").forEach(c => c.classList.remove("selected"));
            div.classList.add("selected");
            atualizarTotal();
        };
        container.appendChild(div);
    });
}

// Atualiza subtotal e total
function atualizarTotal() {
    if (!produtoSelecionado) return;
    const quantityInput = document.getElementById("quantity") || criarInputQuantidade();
    const quantidade = parseInt(quantityInput.value) || 1;
    quantidadeSelecionada = quantidade;

    const subtotal = produtoSelecionado.preco * quantidade;
    document.getElementById("subtotal-display").innerText = formatarReais(subtotal);
    document.getElementById("total-display").innerText = formatarReais(subtotal);
}

// Cria input de quantidade se não existir
function criarInputQuantidade() {
    const div = document.createElement("div");
    div.classList.add("pt-4");
    div.innerHTML = `
        <label for="quantity" class="block text-sm font-medium text-gray-600 mb-2">Quantidade</label>
        <input type="number" id="quantity" value="1" min="1" class="input-style text-center font-bold text-lg">
    `;
    document.getElementById("product-list-container").appendChild(div);
    const quantityInput = document.getElementById("quantity");
    quantityInput.addEventListener("input", atualizarTotal);
    return quantityInput;
}

// Formata valores
function formatarReais(valor) { return `R$ ${valor.toFixed(2)}`; }

// Submete pedido
async function submitOrder() {
    if (!produtoSelecionado) {
        alert("Selecione um produto!");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const formaPagamento = document.getElementById("formaPagamentoz").value;

    if (!name || !phone || !address) {
        document.getElementById("error-message").classList.remove("hidden");
        return;
    }

    document.getElementById("error-message").classList.add("hidden");

    const pedido = {
        produto: produtoSelecionado,
        quantidade: quantidadeSelecionada,
        endereco: address,
        telefone: phone,
        pagamento: formaPagamento.toUpperCase(),
        valorTotal: produtoSelecionado.preco * quantidadeSelecionada
    };

    try {
        document.getElementById("submit-order-button").disabled = true;
        document.getElementById("loading-spinner").classList.remove("hidden");

        const res = await fetch("http://localhost:8080/pedidos/criar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(pedido)
        });

        if (!res.ok) throw new Error("Erro ao enviar pedido");
        const data = await res.json();
        document.getElementById("confirmation-message").classList.remove("hidden");
        console.log("Pedido enviado:", data);

    } catch (err) {
        document.getElementById("error-message").classList.remove("hidden");
        document.getElementById("error-text").innerText = "Erro ao enviar pedido!";
        console.error(err);
    } finally {
        document.getElementById("submit-order-button").disabled = false;
        document.getElementById("loading-spinner").classList.add("hidden");
    }
}

// Inicialização
fetchProdutos();
