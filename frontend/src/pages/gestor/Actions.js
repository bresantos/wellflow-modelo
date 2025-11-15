import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API } from '../../App';
import { toast } from 'sonner';

const GestorActions = () => {
  const { token } = useContext(AuthContext);
  const [actions, setActions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newAction, setNewAction] = useState({ action: '', description: '', target_user_id: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actionsRes, employeesRes] = await Promise.all([
          axios.get(`${API}/actions`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/employees`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setActions(actionsRes.data);
        setEmployees(employeesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/actions`,
        {
          action: newAction.action,
          description: newAction.description,
          target_user_id: newAction.target_user_id || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Ação criada com sucesso!');
      setNewAction({ action: '', description: '', target_user_id: '' });
      // Refresh actions
      const response = await axios.get(`${API}/actions`, { headers: { Authorization: `Bearer ${token}` } });
      setActions(response.data);
    } catch (error) {
      toast.error('Erro ao criar ação');
    }
  };

  return (
    <div className="space-y-8" data-testid="gestor-actions-page">
      <h1 className="text-3xl font-bold" style={{ color: '#2e2e2e' }}>Ações Corretivas</h1>

      {/* Create Action Form */}
      <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#2e2e2e' }}>Criar Nova Ação</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2e2e2e' }}>Ação</label>
            <input
              type="text"
              value={newAction.action}
              onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{ borderColor: 'rgba(178, 63, 230, 0.2)' }}
              placeholder="Ex: Ajustar temperatura, Melhorar comunicação"
              required
              data-testid="input-action"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2e2e2e' }}>Descrição</label>
            <textarea
              value={newAction.description}
              onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{ borderColor: 'rgba(178, 63, 230, 0.2)' }}
              rows="3"
              placeholder="Detalhes da ação..."
              required
              data-testid="input-description"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2e2e2e' }}>Destinatário</label>
            <select
              value={newAction.target_user_id}
              onChange={(e) => setNewAction({ ...newAction, target_user_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{ borderColor: 'rgba(178, 63, 230, 0.2)' }}
              data-testid="select-target"
            >
              <option value="">Todos (Geral)</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-medium text-white"
            style={{ background: '#B23FE6' }}
            data-testid="create-action-button"
          >
            Criar Ação
          </button>
        </form>
      </div>

      {/* Actions History */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#2e2e2e' }}>Histórico de Ações</h2>
        <div className="space-y-3">
          {actions.map((action) => {
            const targetEmployee = employees.find(e => e.id === action.target_user_id);
            return (
              <div
                key={action.id}
                className="p-4 rounded-2xl"
                style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}
                data-testid={`action-item-${action.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: '#B23FE6' }}>{action.action}</div>
                    <p className="text-sm font-inter mt-1" style={{ color: '#2e2e2e' }}>{action.description}</p>
                    <div className="text-xs font-inter mt-2" style={{ color: '#2e2e2e' }}>
                      {targetEmployee ? `Para: ${targetEmployee.full_name}` : 'Para: Todos'} | {new Date(action.timestamp).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {actions.length === 0 && (
            <div className="text-center py-8 font-inter" style={{ color: '#2e2e2e' }}>Nenhuma ação registrada</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestorActions;
