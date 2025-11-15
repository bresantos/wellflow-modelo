import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconFileText, IconWind, IconBulb } from '@tabler/icons-react';

const FuncionarioHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: IconFileText,
      title: 'Formulário Semanal',
      description: 'Preencha sua avaliação semanal de bem-estar',
      action: () => navigate('/funcionario/form'),
      color: '#B23FE6'
    },
    {
      icon: IconWind,
      title: 'Ambiente',
      description: 'Veja as condições do ambiente de trabalho',
      action: () => navigate('/funcionario/environment'),
      color: 'rgba(178, 63, 230, 0.7)'
    },
    {
      icon: IconBulb,
      title: 'Dicas',
      description: 'Dicas para melhorar seu bem-estar',
      action: () => navigate('/funcionario/tips'),
      color: 'rgba(178, 63, 230, 0.5)'
    }
  ];

  return (
    <div className="space-y-8" data-testid="funcionario-home-page">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2e2e2e' }}>Bem-vindo ao WellFlow</h1>
        <p className="font-inter" style={{ color: '#2e2e2e' }}>Seu espaço para monitoramento de bem-estar</p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={idx}
              onClick={card.action}
              className="p-8 rounded-2xl card-hover text-left"
              style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}
              data-testid={`quick-access-${idx}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-full" style={{ background: `${card.color}15` }}>
                  <Icon size={48} stroke={2} style={{ color: card.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#2e2e2e' }}>{card.title}</h3>
                <p className="font-inter text-sm" style={{ color: '#2e2e2e' }}>{card.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#B23FE6' }}>Por que preencher o formulário?</h3>
          <ul className="space-y-2 font-inter text-sm" style={{ color: '#2e2e2e' }}>
            <li>• Ajuda a identificar fontes de estresse</li>
            <li>• Permite que gestores melhorem o ambiente</li>
            <li>• Contribui para seu bem-estar</li>
            <li>• Dados confidenciais e seguros</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#B23FE6' }}>Suas metas semanais</h3>
          <ul className="space-y-2 font-inter text-sm" style={{ color: '#2e2e2e' }}>
            <li>• Preencher formulário até sexta-feira</li>
            <li>• Verificar ambiente diariamente</li>
            <li>• Aplicar dicas de bem-estar</li>
            <li>• Comunicar preocupações ao gestor</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FuncionarioHome;
