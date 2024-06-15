import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const UserList = ({ users, setUsers }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/User');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const openEditModal = (index) => {
    const user = users[index];
    setUserToEdit(user);
    setNewName(user.name);
    setNewEmail(user.email);
    setShowEditModal(true);
  };

  const handleEditUser = async () => {
    if (newName && newEmail && userToEdit) {
      try {
        const response = await axios.put(`http://localhost:3000/api/User/${userToEdit.id}`, {
          id: userToEdit.id,
          name: newName,
          email: newEmail,
        });

        if (response.status === 200) {
          const updatedUser = response.data;
          const updatedUsers = users.map((user) => (user.id === userToEdit.id ? updatedUser : user));
          setUsers(updatedUsers);
          setShowEditModal(false);
          setUserToEdit(null);
        } else {
          console.error('Erro ao editar usuário 1:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao editar usuário 2:', error);
      }
    } else {
      console.log('Valores inválidos para edição');
    }
  };

  const confirmDeleteUser = (index) => {
    setUserToDelete(users[index]);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/User/${userToDelete.id}`);
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setUserToDelete(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Editar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => openEditModal(users.indexOf(user))}>Editar</button>
              </td>
              <td>
                <button onClick={() => confirmDeleteUser(users.indexOf(user))}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmação de exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza de que deseja excluir o usuário "{userToDelete ? userToDelete.name : ''}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edição de usuário */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditUser}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserList;