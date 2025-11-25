// URL do backend
const LOGIN_API_URL = 'http://localhost:8080/usuarios/login';


// Seleção de elementos
const loginForm = document.getElementById('login-form');
const messageElement = document.getElementById('login-message');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (messageElement) {
            messageElement.textContent = 'Verificando credenciais...';
            messageElement.style.color = 'gray';
        }

        try {
            const response = await fetch(`${LOGIN_API_URL}?t=${Date.now()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const responseData = await response.json();

                
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('username', responseData.usuario.username);
                localStorage.setItem('tipoUsuario', responseData.usuario.tipoUsuario);

                // Define a URL de redirecionamento
                let redirectUrl = '../telasPrincipais/telaIniUser.html';
                if (responseData.usuario.tipoUsuario.toUpperCase() === 'ADMIN') {
                    redirectUrl = '../gerente/gerente/painelC.html';
                }

                if (messageElement) {
                    messageElement.textContent = 'Login realizado com sucesso! Redirecionando...';
                    messageElement.style.color = 'green';
                }

                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1000);
            } else {
                const errorJson = await response.json().catch(() => ({ erro: "Resposta inválida" }));
                const errorMessage = errorJson.erro || 'Usuário ou senha inválidos.';
                if (messageElement) {
                    messageElement.textContent = ` Erro: ${errorMessage}`;
                    messageElement.style.color = 'red';
                }
            }
        } catch (error) {
            console.error('Erro na conexão:', error);
            if (messageElement) {
                messageElement.textContent = ' Não foi possível conectar ao servidor.';
                mensagemStatus.style.color = 'red';
            }
        }
    });
}

// Logout

const LOGOUT_API_URL = 'http://localhost:8080/usuarios/logout';

async function logout(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');

    try {
       
        await fetch(LOGOUT_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.warn('Não foi possível chamar /logout no servidor:', err);
    }

    // Remove token e dados do usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('tipoUsuario');

    // Redireciona para a página de login
     window.location.href = '../TelasLogin/login.html';
}


const logoutLink = document.getElementById('logout-button');
if (logoutLink) {
    logoutLink.addEventListener('click', logout);
}