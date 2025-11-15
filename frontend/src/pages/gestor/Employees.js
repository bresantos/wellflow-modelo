import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API } from '../../App';

const GestorEmployees = () => {
  const { token } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API}/employees`, { headers: { Authorization: `Bearer ${token}` } });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, [token]);

  return (
    <div className="space-y-6" data-testid="gestor-employees-page">
      <h1 className="text-3xl font-bold" style={{ color: '#2e2e2e' }}>Funcionários</h1>

      <div className="grid grid-cols-1 gap-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="p-6 rounded-2xl card-hover"
            style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}
            data-testid={`employee-row-${emp.id}`}
          >
            <div className="flex items-center gap-6">
              <img
                src={emp.photo}
                alt={emp.full_name}
                className="w-20 h-20 rounded-full"
                style={{ border: '1px solid rgba(178, 63, 230, 0.1)' }}
              />
              <div className="flex-1">
                <div className="font-semibold text-lg" style={{ color: '#2e2e2e' }}>{emp.full_name}</div>
                <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>{emp.position} - {emp.turno}</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-inter mb-1" style={{ color: '#2e2e2e' }}>Estresse Profissional</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(178, 63, 230, 0.1)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${((emp.stress_professional || 0) / 5) * 100}%`, background: '#B23FE6' }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#B23FE6' }}>{emp.stress_professional || 0}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-inter mb-1" style={{ color: '#2e2e2e' }}>Estresse Pessoal</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(178, 63, 230, 0.1)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${((emp.stress_personal || 0) / 5) * 100}%`, background: 'rgba(178, 63, 230, 0.6)' }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'rgba(178, 63, 230, 0.6)' }}>{emp.stress_personal || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestorEmployees;
