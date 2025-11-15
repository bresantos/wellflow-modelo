import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API } from '../App';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, { username, password });
      login(response.data.token, response.data.user);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f2e7' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#B23FE6' }}>WellFlow</h1>
          <p className="font-inter" style={{ color: '#2e2e2e' }}>Sistema de Monitoramento de Estresse</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2e2e2e' }}>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{ borderColor: 'rgba(178, 63, 230, 0.2)' }}
              placeholder="Digite seu usuário"
              required
              data-testid="login-username-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2e2e2e' }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{ borderColor: 'rgba(178, 63, 230, 0.2)' }}
              placeholder="Digite sua senha"
              required
              data-testid="login-password-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-medium text-white"
            style={{ background: '#B23FE6' }}
            data-testid="login-submit-button"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-inter" style={{ color: '#2e2e2e' }}>
          <p>Usuários de teste:</p>
          <p className="mt-2"><strong>Gestor:</strong> gestor / admin</p>
          <p><strong>Funcionário:</strong> funcionario / admin</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
