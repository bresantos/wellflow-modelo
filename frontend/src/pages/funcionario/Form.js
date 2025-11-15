import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API } from '../../App';
import { Slider } from '../../components/ui/slider';
import { toast } from 'sonner';

const FuncionarioForm = () => {
  const { token } = useContext(AuthContext);
  const [responses, setResponses] = useState({
    q1: 3,
    q2: 3,
    q3: 3,
    q4: 3,
    q5: 3,
    q6: 3,
    q7: 3
  });

  const questions = [
    { id: 'q1', category: 'Pessoal', text: 'Como você avalia seu nível de estresse pessoal esta semana?' },
    { id: 'q2', category: 'Pessoal', text: 'Como está sua qualidade de sono?' },
    { id: 'q3', category: 'Pessoal', text: 'Como está seu equilíbrio entre vida pessoal e trabalho?' },
    { id: 'q4', category: 'Profissional', text: 'Como você avalia sua carga de trabalho?' },
    { id: 'q5', category: 'Profissional', text: 'Como está sua relação com os colegas?' },
    { id: 'q6', category: 'Profissional', text: 'Como você se sente em relação ao seu gestor?' },
    { id: 'q7', category: 'Profissional', text: 'Qual seu nível de satisfação com o ambiente de trabalho?' }
  ];

  const handleSliderChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value[0] });
  };

  const allAnswered = Object.values(responses).every(v => v > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/forms`,
        {
          week: new Date().toISOString().slice(0, 10),
          responses
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Formulário enviado com sucesso!');
      // Reset form
      setResponses({
        q1: 3,
        q2: 3,
        q3: 3,
        q4: 3,
        q5: 3,
        q6: 3,
        q7: 3
      });
    } catch (error) {
      toast.error('Erro ao enviar formulário');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" data-testid="funcionario-form-page">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2e2e2e' }}>Formulário Semanal</h1>
        <p className="font-inter" style={{ color: '#2e2e2e' }}>Avalie seu bem-estar de 1 a 5 (1 = Péssimo, 5 = Excelente)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Questions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold" style={{ color: '#B23FE6' }}>Questões Pessoais</h3>
            {questions.filter(q => q.category === 'Pessoal').map((question) => (
              <div key={question.id} className="p-4 rounded-xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
                <label className="block text-sm font-medium mb-3" style={{ color: '#2e2e2e' }}>
                  {question.text}
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[responses[question.id]]}
                    onValueChange={(value) => handleSliderChange(question.id, value)}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                    data-testid={`slider-${question.id}`}
                  />
                  <span className="text-xl font-bold" style={{ color: '#B23FE6' }} data-testid={`value-${question.id}`}>
                    {responses[question.id]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Professional Questions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold" style={{ color: '#B23FE6' }}>Questões Profissionais</h3>
            {questions.filter(q => q.category === 'Profissional').map((question) => (
              <div key={question.id} className="p-4 rounded-xl" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
                <label className="block text-sm font-medium mb-3" style={{ color: '#2e2e2e' }}>
                  {question.text}
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[responses[question.id]]}
                    onValueChange={(value) => handleSliderChange(question.id, value)}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                    data-testid={`slider-${question.id}`}
                  />
                  <span className="text-xl font-bold" style={{ color: '#B23FE6' }} data-testid={`value-${question.id}`}>
                    {responses[question.id]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!allAnswered}
          className="w-full py-4 rounded-xl font-medium text-white"
          style={{ background: allAnswered ? '#B23FE6' : '#ccc' }}
          data-testid="submit-form-button"
        >
          Enviar Formulário
        </button>
      </form>
    </div>
  );
};

export default FuncionarioForm;
