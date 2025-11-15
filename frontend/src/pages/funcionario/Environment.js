import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../App';
import { IconTemperature, IconDroplet, IconWind } from '@tabler/icons-react';

const FuncionarioEnvironment = () => {
  const [environment, setEnvironment] = useState({ temperature: 0, humidity: 0, air_quality: 0 });

  useEffect(() => {
    const fetchEnvironment = async () => {
      try {
        const response = await axios.get(`${API}/environment`);
        setEnvironment(response.data);
      } catch (error) {
        console.error('Error fetching environment:', error);
      }
    };
    fetchEnvironment();

    // Poll every 30 seconds
    const interval = setInterval(fetchEnvironment, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (type, value) => {
    if (type === 'temperature') {
      if (value >= 20 && value <= 24) return { text: 'Ideal', color: '#4ade80' };
      if (value >= 18 && value <= 26) return { text: 'Bom', color: '#fbbf24' };
      return { text: 'Atenção', color: '#ef4444' };
    }
    if (type === 'humidity') {
      if (value >= 40 && value <= 60) return { text: 'Ideal', color: '#4ade80' };
      if (value >= 30 && value <= 70) return { text: 'Bom', color: '#fbbf24' };
      return { text: 'Atenção', color: '#ef4444' };
    }
    if (type === 'air_quality') {
      if (value >= 80) return { text: 'Excelente', color: '#4ade80' };
      if (value >= 60) return { text: 'Bom', color: '#fbbf24' };
      return { text: 'Atenção', color: '#ef4444' };
    }
  };

  const tempStatus = getStatus('temperature', environment.temperature);
  const humidityStatus = getStatus('humidity', environment.humidity);
  const airStatus = getStatus('air_quality', environment.air_quality);

  return (
    <div className="space-y-8" data-testid="funcionario-environment-page">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2e2e2e' }}>Ambiente de Trabalho</h1>
        <p className="font-inter" style={{ color: '#2e2e2e' }}>Monitore as condições do ambiente em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <div className="flex items-center gap-3 mb-4">
            <IconTemperature size={32} stroke={2} style={{ color: '#B23FE6' }} />
            <div>
              <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Temperatura</div>
              <div className="text-2xl font-bold" style={{ color: '#B23FE6' }} data-testid="environment-temperature">{environment.temperature}°C</div>
            </div>
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ background: `${tempStatus.color}20`, color: tempStatus.color }}>
            {tempStatus.text}
          </div>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <div className="flex items-center gap-3 mb-4">
            <IconDroplet size={32} stroke={2} style={{ color: '#B23FE6' }} />
            <div>
              <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Umidade</div>
              <div className="text-2xl font-bold" style={{ color: '#B23FE6' }} data-testid="environment-humidity">{environment.humidity}%</div>
            </div>
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ background: `${humidityStatus.color}20`, color: humidityStatus.color }}>
            {humidityStatus.text}
          </div>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <div className="flex items-center gap-3 mb-4">
            <IconWind size={32} stroke={2} style={{ color: '#B23FE6' }} />
            <div>
              <div className="text-sm font-inter" style={{ color: '#2e2e2e' }}>Qualidade do Ar</div>
              <div className="text-2xl font-bold" style={{ color: '#B23FE6' }} data-testid="environment-air-quality">{environment.air_quality}%</div>
            </div>
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ background: `${airStatus.color}20`, color: airStatus.color }}>
            {airStatus.text}
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#B23FE6' }}>Temperatura Ideal</h3>
          <p className="font-inter text-sm" style={{ color: '#2e2e2e' }}>
            A temperatura ideal para ambientes de trabalho é entre 20°C e 24°C. Temperaturas fora dessa faixa podem afetar o conforto e a produtividade.
          </p>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#B23FE6' }}>Umidade e Qualidade do Ar</h3>
          <p className="font-inter text-sm" style={{ color: '#2e2e2e' }}>
            A umidade ideal é entre 40% e 60%. A qualidade do ar acima de 80% é excelente. Esses fatores são essenciais para sua saúde respiratória.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FuncionarioEnvironment;
