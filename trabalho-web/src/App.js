import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

const App = () => {
  const [users, setUsers] = useState([]); // Inicialize como array vazio

  const addUser = (user) => {
    setUsers([...users, user]);
  };

  return (
    <div>
      <h1>Pedro Guilherme Dias Aragão</h1>
      <UserForm addUser={addUser} />
      <UserList users={users} setUsers={setUsers} />
    </div>
  );
};

export default App;