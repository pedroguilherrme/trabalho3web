import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserEditModal = ({ user, onUserUpdated }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (name.trim() && email.trim()) {
            try {
                const payload = { user: { name, email } };
                console.log('URL:', `/api/users/${user.id}`);
                console.log('Payload:', payload);

                const response = await axios.put(`/api/users/${user.id}`, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    onUserUpdated(response.data);
                    setErrorMessage(''); // Limpar mensagem de erro em caso de sucesso
                } else {
                    console.error('Erro ao editar usuário 1:', response.statusText);
                    setErrorMessage('Erro ao editar usuário. Por favor, tente novamente.');
                }
            } catch (error) {
                console.error('Erro ao editar usuário 2:', error);
                if (error.response) {
                    // O servidor respondeu com um status fora do intervalo de 2xx
                    console.error('Resposta do servidor:', error.response.data);
                    console.error('Status:', error.response.status);
                    console.error('Headers:', error.response.headers);
                    setErrorMessage(`Erro: ${error.response.data.message || error.response.statusText}`);
                } else if (error.request) {
                    // A solicitação foi feita, mas nenhuma resposta foi recebida
                    console.error('Nenhuma resposta recebida:', error.request);
                    setErrorMessage('Erro na comunicação com o servidor. Por favor, tente novamente.');
                } else {
                    // Algo aconteceu ao configurar a solicitação que desencadeou um erro
                    console.error('Erro inesperado:', error.message);
                    setErrorMessage('Erro inesperado. Por favor, tente novamente.');
                }
            }
        } else {
            setErrorMessage('Valores inválidos para edição');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Salvar</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default UserEditModal;