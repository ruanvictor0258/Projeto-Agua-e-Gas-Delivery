
// URL do endpoint GET para listar todos os produtos
const LISTAR_PRODUTOS_API_URL = 'http://localhost:8080/api/produtos'; 
// URL base para DELETAR um produto: http://localhost:8080/api/produtos/{id}
const DELETAR_PRODUTO_API_URL = 'http://localhost:8080/api/produtos';




async function carregarProdutos() {
    
    const container = document.getElementById('containerProdutos');

    if (!container) {
       
        console.error("Container de produtos não encontrado (ID: containerProdutos).");
        return;
    }

    // Define o conteúdo do container como uma mensagem de feedback enquanto a requisição está em andamento.
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


// Função para deletar um produto
async function deletarProduto(produtoId) {

    const divMensagem = document.getElementById("mensagemErro");

    try {
        const response = await fetch(`${DELETAR_PRODUTO_API_URL}/${produtoId}`, {
            method: 'DELETE'
        });

        // caso o produto esteja vinculado a algum pedido
        if (response.status === 409) {
            const mensagem = await response.text();

            divMensagem.style.display = "block";
            divMensagem.textContent = mensagem;

            return;
        }

     
        if (response.ok || response.status === 204) { 
            divMensagem.style.display = "none"; 
            carregarProdutos();
            return;
        }

        // Outros erros
        divMensagem.style.display = "block";
        divMensagem.textContent = `Erro ao excluir. Status: ${response.status}`;

    } catch (error) {
        console.error("Erro ao deletar produto:", error);

        divMensagem.style.display = "block";
        divMensagem.textContent = "Erro de conexão ao tentar excluir o produto.";
    }
}


// Função que recebe a lista de produtos e constrói os elementos HTML (cards).
function exibirProdutosNoFrontend(produtos, containerProdutos) {
    
    containerProdutos.innerHTML = ''; 
    containerProdutos.style.display = 'flex';
    containerProdutos.style.flexWrap = 'wrap';
    containerProdutos.style.gap = '20px';

    if (produtos.length === 0) {
        // Caso a lista do backend esteja vazia.
        containerProdutos.innerHTML = '<p>Nenhum produto encontrado no momento.</p>';
        return;
    }

    // Itera sobre cada produto recebido do backend.
    produtos.forEach(produto => {
        // Formata os dados para exibição 
        const precoFormatado = produto.preco ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}` : 'Preço não disponível';
        const descricaoFormatada = produto.descricao || 'Sem detalhes.';
        const imagem = produto.imagem || 'placeholder.png'; 

        // 1. Cria o elemento principal do card divv para inserção.
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.style.width = '18rem';
        
        // Define o conteúdo HTML interno do card 
        cardDiv.innerHTML = `
            <img src="${imagem}" class="card-img-top" alt="Imagem de ${produto.nome}">
            <div class="card-body">
                <h4 class="card-title">${produto.nome} (ID: ${produto.id})</h4>
                <p>${descricaoFormatada}</p>
                <p>VALOR: ${precoFormatado}</p>
            </div>
        `;
        
        // 2. Cria o botão de forma programática.
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger'; // Classe para botão vermelho
        deleteButton.textContent = 'Excluir Produto';
        
        // 3. Adiciona o evento de clique.
        deleteButton.addEventListener('click', () => {
            // Chama a função de deleção passando o ID do produto.
            deletarProduto(produto.id);
        });

        // 4. Insere o botão dentro da div 'card-body'.
        cardDiv.querySelector('.card-body').appendChild(deleteButton);
        
        // 5. Adiciona o card completo (com o botão) ao container principal na tela.
        containerProdutos.appendChild(cardDiv);
    });
}

// Garante que a função 'carregarProdutos' só será executada após o HTML estar completamente carregado
document.addEventListener('DOMContentLoaded', carregarProdutos); 