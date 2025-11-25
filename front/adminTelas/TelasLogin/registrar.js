const REGISTER_API_URL = 'http://localhost:8080/usuarios';
// 1 Seleciona o formulário de cadastro

const registerForm = document.getElementById('register-form');
const messageElement = document.getElementById('form-message');

// 2. Adiciona um "ouvinte" de evento para quando o formulário for submetido
registerForm.addEventListener('submit', async (event) => {
    // Impede o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    // 3. Coleta os dados do formulário
    const email=document.getElementById('register-email').value;
    const password=document.getElementById('register-password').value;
    const confirmPassword=document.getElementById('register-confirm-password').value;

    // 4. Valida os dados 
    if (password !== confirmPassword) {
        messageElement.textContent = 'As senhas não coincidem.';
        messageElement.style.color = 'red'; 
        return;
    }
    // Limpa mensagens anteriores
    messageElement.textContent = '';

    // 5. Prepara o objeto de dados a ser enviado
    const userData = {
      
      username: email, 
      password: password
    };
    // 6. Faz a requisição POST para o Spring Boot
    try {
        const response = await fetch(REGISTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Informa o formato de envio
            },
            body: JSON.stringify(userData) // Converte o objeto JavaScript para JSON
        });


        // 7. Processa a resposta do servidor
        const status = response.status;
        if (status===201) {
            // Cadastro bem-sucedido 
            messageElement.textContent = 'Cadastro realizado com sucesso!';
            messageElement.style.color = 'green';
            
            //  Redirecionar para a página de login após o sucesso
            setTimeout(() => {
                window.location.href = 'login.html'; 
            }, 2000); 

        } else if (status === 400 || status === 409) { 
      
        const errorData = await response.json(); 
        const errorMessage = errorData.erro || `Falha no cadastro. Status: ${status}`; 
        
        messageElement.textContent = `Erro: ${errorMessage}`;
        messageElement.style.color = 'red';
    
}    else {
            
            const errorData = await response.json(); 
            const errorMessage = errorData.message || `Falha no cadastro. Status: ${response.status}`;
            
            messageElement.textContent = `Erro: ${errorMessage}`;
            messageElement.style.color = 'red';
        }

    } catch (error) {
        // Erro de rede (servidor fora do ar, CORS bloqueado, etc.)
        console.error('Erro de rede ou na requisição:', error);
        messageElement.textContent = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
        messageElement.style.color = 'red';
    }
});
