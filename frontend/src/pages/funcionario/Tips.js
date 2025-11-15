import React from 'react';
import { IconBulb, IconClock, IconHeart, IconBrain } from '@tabler/icons-react';

const FuncionarioTips = () => {
  const tips = [
    {
      icon: IconBrain,
      category: 'Gestão de Estresse',
      items: [
        'Pratique respiração profunda por 5 minutos durante o dia',
        'Faça pequenas pausas a cada 2 horas de trabalho',
        'Organize suas tarefas por prioridade',
        'Comunique-se quando sentir sobrecarga'
      ]
    },
    {
      icon: IconClock,
      category: 'Imprevistos e Transporte',
      items: [
        'Saia de casa 15 minutos mais cedo do que o habitual',
        'Tenha sempre um plano B de transporte',
        'Use aplicativos de trânsito em tempo real',
        'Comunique atrasos ao gestor o quanto antes'
      ]
    },
    {
      icon: IconHeart,
      category: 'Bem-estar Pessoal',
      items: [
        'Mantenha uma rotina de sono regular (7-8 horas)',
        'Pratique exercícios físicos regularmente',
        'Mantenha-se hidratado durante o dia',
        'Reserve tempo para hobbies e lazer'
      ]
    },
    {
      icon: IconBulb,
      category: 'Produtividade',
      items: [
        'Use a técnica Pomodoro (25min trabalho + 5min pausa)',
        'Mantenha sua área de trabalho organizada',
        'Evite multitarefas, foque em uma atividade por vez',
        'Peça feedback regularmente sobre seu desempenho'
      ]
    }
  ];

  return (
    <div className="space-y-8" data-testid="funcionario-tips-page">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2e2e2e' }}>Dicas de Bem-estar</h1>
        <p className="font-inter" style={{ color: '#2e2e2e' }}>Dicas práticas para melhorar sua qualidade de vida</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl"
              style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}
              data-testid={`tip-category-${idx}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full" style={{ background: 'rgba(178, 63, 230, 0.1)' }}>
                  <Icon size={28} stroke={2} style={{ color: '#B23FE6' }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: '#B23FE6' }}>{tip.category}</h3>
              </div>
              <ul className="space-y-2">
                {tip.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="font-inter text-sm" style={{ color: '#2e2e2e' }}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Additional Resources */}
      <div className="p-6 rounded-2xl" style={{ background: 'rgba(178, 63, 230, 0.05)', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#B23FE6' }}>Precisa de Ajuda?</h3>
        <p className="font-inter text-sm" style={{ color: '#2e2e2e' }}>
          Se você está enfrentando dificuldades persistentes com estresse ou bem-estar, não hesite em conversar com seu gestor ou procurar apoio profissional. Sua saúde mental é prioridade!
        </p>
      </div>
    </div>
  );
};

export default FuncionarioTips;
