// URL do endpoint GET para listar todos os produtos 
const LISTAR_PRODUTOS_API_URL = 'http://localhost:8080/api/produtos'; 

// Função para buscar os dados e chamar a função de exibição
async function carregarProdutos() {
    const container = document.getElementById('containerProdutos');

    if (!container) {
        console.error("Container de produtos não encontrado (ID: containerProdutos).");
        return;
    }

    container.innerHTML = '<p>Carregando produtos...</p>'; 

    try {
        const response = await fetch(LISTAR_PRODUTOS_API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const listaProdutos = await response.json(); 
            
            // Chama a função para montar o HTML
            exibirProdutosNoFrontend(listaProdutos, container); 
            
        } else {
            console.error(`Falha ao buscar produtos. Status: ${response.status}`);
            container.innerHTML = '<p>Erro ao carregar a lista de produtos do servidor.</p>';
        }

    } catch (error) {
        console.error('Erro de conexão:', error);
        container.innerHTML = '<p>Não foi possível conectar ao servidor (Backend offline).</p>';
    }
}


function exibirProdutosNoFrontend(produtos, containerProdutos) {
    
    // Limpa o conteúdo antigo
    containerProdutos.innerHTML = ''; 
    
    // Configura o container para exibir os cards lado a lado 
    containerProdutos.style.display = 'flex';
    containerProdutos.style.flexWrap = 'wrap';
    containerProdutos.style.gap = '20px'; // Espaçamento entre os cards

    if (produtos.length === 0) {
        containerProdutos.innerHTML = '<p>Nenhum produto encontrado no momento.</p>';
        return;
    }

    // Cria os elementos HTML para cada produto
    produtos.forEach(produto => {
        const precoFormatado = produto.preco ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}` : 'Preço não disponível';
        const descricaoFormatada = produto.descricao || 'Sem detalhes.';
        const imagem = produto.imagem || 'placeholder.png'; 

        const cardHTML = `
            <div class="card" style="width: 18rem;">
                <img src="${imagem}" class="card-img-top" alt="Imagem de ${produto.nome}">
                <div class="card-body">
                    <h4 class="card-title">${produto.nome}</h4>
                    <p>${descricaoFormatada}</p>
                    <p>VALOR: ${precoFormatado}</p>
                    <a href="pedidos.html?produtoId=${produto.id}" class="btn btn-primary">🛒 Realizar Pedido</a>
                </div>
            </div>
        `;
        // Adiciona o novo HTML ao container (usando insertAdjacentHTML é mais eficiente)
        containerProdutos.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// Chamar a função principal para iniciar o carregamento
document.addEventListener('DOMContentLoaded', carregarProdutos);