import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API } from '../../App';
import { IconTemperature, IconDroplet, IconWind } from '@tabler/icons-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const GestorHome = () => {
  const { token } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [environment, setEnvironment] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [stressData, setStressData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, envRes, stressRes] = await Promise.all([
          axios.get(`${API}/employees`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/environment`),
          axios.get(`${API}/stats/employee-stress`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setEmployees(empRes.data);
        setEnvironment(envRes.data);
        setStressData(stressRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [token]);

  const openEmployeeModal = async (employee) => {
    try {
      const response = await axios.get(`${API}/employees/${employee.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setEmployeeDetails(response.data);
      setSelectedEmployee(employee);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const COLORS = ['#B23FE6', 'rgba(178, 63, 230, 0.6)', 'rgba(178, 63, 230, 0.3)'];

  const environmentAvg = {
    temperature: environment.temperature || 0,
    humidity: environment.humidity || 0,
    airQuality: environment.air_quality || 0
  };

  const convivenceData = [
    { name: 'Excelente', value: 45 },
    { name: 'Bom', value: 35 },
    { name: 'Regular', value: 20 }
  ];

  return (
    <div className="space-y-8" data-testid="gestor-home-page">
      <h1 className="text-3xl font-bold" style={{ color: '#2e2e2e' }}>Dashboard Gestor</h1>

      {/* Employee Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#2e2e2e' }}>Funcionários</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => openEmployeeModal(emp)}
              className="p-4 rounded-2xl card-hover cursor-pointer"
              style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}
              data-testid={`employee-card-${emp.id}`}
            >
              <img
                src={emp.photo}
                alt={emp.full_name}
                className="w-16 h-16 rounded-full mx-auto mb-3"
                style={{ border: '1px solid rgba(178, 63, 230, 0.1)' }}
              />
              <div className="text-center">
                <div className="font-semibold mb-1" style={{ color: '#2e2e2e' }} data-testid={`employee-name-${emp.id}`}>{emp.full_name}</div>
                <div className="text-sm font-inter mb-3" style={{ color: '#2e2e2e' }}>{emp.position}</div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-xs font-inter mb-1" style={{ color: '#2e2e2e' }}>Estresse Pessoal</div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'rgba(178, 63, 230, 0.1)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${((emp.stress_personal || 0) / 5) * 100}%`, background: 'rgba(178, 63, 230, 0.6)' }}
                        data-testid={`employee-personal-stress-${emp.id}`}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-inter mb-1" style={{ color: '#2e2e2e' }}>Estresse Profissional</div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'rgba(178, 63, 230, 0.1)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${((emp.stress_professional || 0) / 5) * 100}%`, background: '#B23FE6' }}
                        data-testid={`employee-professional-stress-${emp.id}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2e2e2e' }}>Ações Rápidas</h3>
        <p className="font-inter" style={{ color: '#2e2e2e' }}>
          • Ajustar temperatura do ambiente
          <br />
          • Melhorar comunicação da equipe
          <br />
          • Realizar reunião de feedback
        </p>
      </div>

      {/* Environment Indicators */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#2e2e2e' }}>Indicadores do Ambiente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
            <div className="flex items-center gap-3 mb-2">
              <IconTemperature size={32} stroke={2} style={{ color: '#B23FE6' }} />
              <div>
                <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Temperatura</div>
                <div className="text-2xl font-bold" style={{ color: '#B23FE6' }} data-testid="env-temperature">{environmentAvg.temperature}°C</div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
            <div className="flex items-center gap-3 mb-2">
              <IconDroplet size={32} stroke={2} style={{ color: '#B23FE6' }} />
              <div>
                <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Umidade</div>
                <div className="text-2xl font-bold" style={{ color: '#B23FE6' }} data-testid="env-humidity">{environmentAvg.humidity}%</div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
            <div className="flex items-center gap-3 mb-2">
              <IconWind size={32} stroke={2} style={{ color: '#B23FE6' }} />
              <div>
                <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Qualidade do Ar</div>
                <div className="text-2xl font-bold" style={{ color: '#B23FE6' }} data-testid="env-air-quality">{environmentAvg.airQuality}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#2e2e2e' }}>Níveis de Estresse por Funcionário</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(178, 63, 230, 0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="professional" fill="#B23FE6" name="Profissional" />
              <Bar dataKey="personal" fill="rgba(178, 63, 230, 0.6)" name="Pessoal" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#2e2e2e' }}>Convivência entre Colegas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={convivenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {convivenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Detail Modal */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl" data-testid="employee-detail-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ color: '#2e2e2e' }}>
              {employeeDetails?.full_name}
            </DialogTitle>
          </DialogHeader>
          {employeeDetails && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#B23FE6' }}>Rotina</h4>
                <p className="font-inter text-sm" style={{ color: '#2e2e2e' }}>
                  Turno: {employeeDetails.turno} | Idade: {employeeDetails.age} anos
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#B23FE6' }}>Estresse Detalhado</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Profissional: </span>
                    <span className="font-bold" style={{ color: '#B23FE6' }}>{employeeDetails.stress_professional || 0}/5</span>
                  </div>
                  <div>
                    <span className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Pessoal: </span>
                    <span className="font-bold" style={{ color: 'rgba(178, 63, 230, 0.6)' }}>{employeeDetails.stress_personal || 0}/5</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#B23FE6' }}>Observações</h4>
                <p className="font-inter text-sm" style={{ color: '#2e2e2e' }}>
                  Monitorar níveis de estresse. Considerar feedback individual.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#B23FE6' }}>Recomendações</h4>
                <p className="font-inter text-sm" style={{ color: '#2e2e2e' }}>
                  • Oferecer pausa adicional
                  <br />
                  • Reunião 1:1 para feedback
                  <br />
                  • Avaliar carga de trabalho
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestorHome;
