import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API } from '../../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const GestorReports = () => {
  const { token } = useContext(AuthContext);
  const [stressData, setStressData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/stats/employee-stress`, { headers: { Authorization: `Bearer ${token}` } });
        setStressData(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchData();
  }, [token]);

  // Dados mockados para tendência anual
  const annualData = [
    { month: 'Jan', professional: 2.5, personal: 2.0 },
    { month: 'Fev', professional: 2.8, personal: 2.3 },
    { month: 'Mar', professional: 3.2, personal: 2.7 },
    { month: 'Abr', professional: 2.9, personal: 2.5 },
    { month: 'Mai', professional: 3.5, personal: 3.0 },
    { month: 'Jun', professional: 3.1, personal: 2.8 },
    { month: 'Jul', professional: 2.7, personal: 2.4 },
    { month: 'Ago', professional: 2.9, personal: 2.6 },
    { month: 'Set', professional: 3.3, personal: 2.9 },
    { month: 'Out', professional: 3.0, personal: 2.7 },
    { month: 'Nov', professional: 2.8, personal: 2.5 },
    { month: 'Dez', professional: 2.5, personal: 2.2 }
  ];

  return (
    <div className="space-y-8" data-testid="gestor-reports-page">
      <h1 className="text-3xl font-bold" style={{ color: '#2e2e2e' }}>Relatórios e Gráficos</h1>

      {/* Monthly Bar Chart */}
      <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2e2e2e' }}>Média Mensal de Estresse - Equipe</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(178, 63, 230, 0.1)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="professional" fill="#B23FE6" name="Profissional" />
            <Bar dataKey="personal" fill="rgba(178, 63, 230, 0.6)" name="Pessoal" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Annual Trend Line Chart */}
      <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2e2e2e' }}>Tendência Anual de Estresse</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={annualData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(178, 63, 230, 0.1)" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="professional" stroke="#B23FE6" strokeWidth={2} name="Profissional" />
            <Line type="monotone" dataKey="personal" stroke="rgba(178, 63, 230, 0.6)" strokeWidth={2} name="Pessoal" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl text-center" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <div className="text-4xl font-bold mb-2" style={{ color: '#B23FE6' }}>8</div>
          <div className="font-inter" style={{ color: '#2e2e2e' }}>Funcionários Ativos</div>
        </div>
        <div className="p-6 rounded-2xl text-center" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <div className="text-4xl font-bold mb-2" style={{ color: '#B23FE6' }}>2.8</div>
          <div className="font-inter" style={{ color: '#2e2e2e' }}>Média Estresse Profissional</div>
        </div>
        <div className="p-6 rounded-2xl text-center" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <div className="text-4xl font-bold mb-2" style={{ color: '#B23FE6' }}>2.5</div>
          <div className="font-inter" style={{ color: '#2e2e2e' }}>Média Estresse Pessoal</div>
        </div>
      </div>
    </div>
  );
};

export default GestorReports;
