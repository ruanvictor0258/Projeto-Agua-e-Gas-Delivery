// pedidosGerente.js

const listaPedidos = document.getElementById("listaPedidos");
const token = localStorage.getItem("token"); // token do login

// Função para formatar valores em moeda
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2)}`;
}

// Função para carregar pedidos do back-end
async function carregarPedidos() {
    try {
        const res = await fetch("http://localhost:8080/pedidos/listar", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Erro ao buscar pedidos");
        }

        const pedidos = await res.json();

        listaPedidos.innerHTML = ""; 

        pedidos.forEach(pedido => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.usuario?.username || "—"}</td>
                <td>${pedido.produto?.nome || "—"}</td>
                <td>${pedido.quantidade}</td>
                <td>${pedido.valorTotal ? formatarMoeda(pedido.valorTotal) : "—"}</td>
                <td>${pedido.endereco || "—"}</td>
                <td>${pedido.telefone || "—"}</td>
                <td>${pedido.pagamento || "—"}</td>
                <td>
                   <button onclick="deletarPedido(${pedido.id})">APAGAR</button>
                </td>
            `;

            listaPedidos.appendChild(tr);
        });

    } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
        listaPedidos.innerHTML = `<tr><td colspan="9">Erro ao carregar pedidos</td></tr>`;
    }
}


function deletarPedido(id) {
    if (!confirm("Tem certeza que deseja apagar este pedido?")) return;

    fetch(`http://localhost:8080/pedidos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Pedido deletado!");
            document.getElementById(`pedido-${id}`).remove();
        } else {
            response.text().then(msg => alert("Erro: " + msg));
        }
    })
    .catch(error => console.error("Erro ao deletar:", error));
}


window.deletarPedido = deletarPedido;
// Inicialização
carregarPedidos();
