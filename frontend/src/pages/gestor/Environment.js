import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API } from '../../App';
import { IconTemperature, IconDroplet, IconWind } from '@tabler/icons-react';
import { toast } from 'sonner';

const GestorEnvironment = () => {
  const { token } = useContext(AuthContext);
  const [environment, setEnvironment] = useState({ temperature: 23.5, humidity: 65, air_quality: 85 });
  const [newData, setNewData] = useState({ temperature: '', humidity: '', air_quality: '' });

  useEffect(() => {
    const fetchEnvironment = async () => {
      try {
        const response = await axios.get(`${API}/environment`);
        setEnvironment(response.data);
        setNewData({
          temperature: response.data.temperature || 23.5,
          humidity: response.data.humidity || 65,
          air_quality: response.data.air_quality || 85
        });
      } catch (error) {
        console.error('Error fetching environment:', error);
      }
    };
    fetchEnvironment();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/environment`,
        {
          temperature: parseFloat(newData.temperature),
          humidity: parseFloat(newData.humidity),
          air_quality: parseInt(newData.air_quality)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Ambiente atualizado com sucesso!');
      setEnvironment({
        temperature: parseFloat(newData.temperature),
        humidity: parseFloat(newData.humidity),
        air_quality: parseInt(newData.air_quality)
      });
    } catch (error) {
      toast.error('Erro ao atualizar ambiente');
    }
  };

  return (
    <div className="space-y-8" data-testid="gestor-environment-page">
      <h1 className="text-3xl font-bold" style={{ color: '#2e2e2e' }}>Gestão de Ambiente</h1>

      {/* Current Environment */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#2e2e2e' }}>Condições Atuais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
            <div className="flex items-center gap-3">
              <IconTemperature size={32} stroke={2} style={{ color: '#B23FE6' }} />
              <div>
                <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Temperatura</div>
                <div className="text-2xl font-bold" style={{ color: '#B23FE6' }} data-testid="current-temperature">{environment.temperature}°C</div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
            <div className="flex items-center gap-3">
              <IconDroplet size={32} stroke={2} style={{ color: '#B23FE6' }} />
              <div>
                <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Umidade</div>
                <div className="text-2xl font-bold" style={{ color: '#B23FE6' }} data-testid="current-humidity">{environment.humidity}%</div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
            <div className="flex items-center gap-3">
              <IconWind size={32} stroke={2} style={{ color: '#B23FE6' }} />
              <div>
                <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Qualidade do Ar</div>
                <div className="text-2xl font-bold" style={{ color: '#B23FE6' }} data-testid="current-air-quality">{environment.air_quality}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#2e2e2e' }}>Atualizar Dados</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2e2e2e' }}>Temperatura (°C)</label>
            <input
              type="number"
              step="0.1"
              value={newData.temperature}
              onChange={(e) => setNewData({ ...newData, temperature: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{ borderColor: 'rgba(178, 63, 230, 0.2)' }}
              required
              data-testid="input-temperature"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2e2e2e' }}>Umidade (%)</label>
            <input
              type="number"
              step="1"
              value={newData.humidity}
              onChange={(e) => setNewData({ ...newData, humidity: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{ borderColor: 'rgba(178, 63, 230, 0.2)' }}
              required
              data-testid="input-humidity"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2e2e2e' }}>Qualidade do Ar (%)</label>
            <input
              type="number"
              step="1"
              value={newData.air_quality}
              onChange={(e) => setNewData({ ...newData, air_quality: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{ borderColor: 'rgba(178, 63, 230, 0.2)' }}
              required
              data-testid="input-air-quality"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-medium text-white"
            style={{ background: '#B23FE6' }}
            data-testid="update-environment-button"
          >
            Atualizar Ambiente
          </button>
        </form>
      </div>

      {/* Arduino Integration Info */}
      <div className="p-6 rounded-2xl" style={{ background: 'rgba(178, 63, 230, 0.05)', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#B23FE6' }}>Integração com Sensores IoT (Arduino)</h3>
        <p className="font-inter text-sm mb-3" style={{ color: '#2e2e2e' }}>
          Para integrar sensores reais do Arduino, configure seus sensores DHT22 e MQ-135 e envie os dados via HTTP POST para:
        </p>
        <code className="block p-3 rounded-lg font-inter text-sm" style={{ background: 'white', color: '#B23FE6' }}>
          POST {process.env.REACT_APP_BACKEND_URL}/api/environment
        </code>
        <p className="font-inter text-sm mt-3" style={{ color: '#2e2e2e' }}>
          Payload esperado: {`{ "temperature": 23.5, "humidity": 65, "air_quality": 85 }`}
        </p>
      </div>
    </div>
  );
};

export default GestorEnvironment;
