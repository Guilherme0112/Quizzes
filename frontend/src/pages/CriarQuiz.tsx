import React, { useState } from 'react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../hooks/useQuiz';
import { Quiz, Pergunta } from '../types';

interface CriarQuizProps {
  mudarPagina: (pagina: string) => void;
}

export const CriarQuiz: React.FC<CriarQuizProps> = ({ mudarPagina }) => {
  const { usuarioAtual } = useAuth();
  const { salvarQuiz } = useQuiz();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [perguntas, setPerguntas] = useState<Pergunta[]>([
    {
      id: '1',
      texto: '',
      alternativas: ['', '', '', ''],
      respostaCorreta: 0
    }
  ]);

  const adicionarPergunta = () => {
    const novaPergunta: Pergunta = {
      id: Date.now().toString(),
      texto: '',
      alternativas: ['', '', '', ''],
      respostaCorreta: 0
    };
    setPerguntas([...perguntas, novaPergunta]);
  };

  const removerPergunta = (index: number) => {
    if (perguntas.length > 1) {
      setPerguntas(perguntas.filter((_, i) => i !== index));
    }
  };

  const atualizarPergunta = (index: number, campo: keyof Pergunta, valor: any) => {
    const perguntasAtualizadas = [...perguntas];
    perguntasAtualizadas[index] = { ...perguntasAtualizadas[index], [campo]: valor };
    setPerguntas(perguntasAtualizadas);
  };

  const atualizarAlternativa = (perguntaIndex: number, alternativaIndex: number, valor: string) => {
    const perguntasAtualizadas = [...perguntas];
    perguntasAtualizadas[perguntaIndex].alternativas[alternativaIndex] = valor;
    setPerguntas(perguntasAtualizadas);
  };

  const validarFormulario = () => {
    if (!titulo.trim() || !descricao.trim() || !categoria.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    for (let i = 0; i < perguntas.length; i++) {
      const pergunta = perguntas[i];
      if (!pergunta.texto.trim()) {
        alert(`Pergunta ${i + 1} não pode estar vazia`);
        return false;
      }
      
      for (let j = 0; j < pergunta.alternativas.length; j++) {
        if (!pergunta.alternativas[j].trim()) {
          alert(`Todas as alternativas da pergunta ${i + 1} devem ser preenchidas`);
          return false;
        }
      }
    }

    return true;
  };

  const salvarQuizCompleto = () => {
    if (!validarFormulario()) return;

    const novoQuiz: Quiz = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria: categoria.trim(),
      perguntas,
      criadorId: usuarioAtual!.id,
      aprovado: usuarioAtual?.tipo === 'admin', // Admin não precisa de aprovação
      dataCreacao: new Date(),
      totalJogadas: 0,
      mediaAcertos: 0
    };

    salvarQuiz(novoQuiz);
    alert(usuarioAtual?.tipo === 'admin' 
      ? 'Quiz criado e aprovado automaticamente!' 
      : 'Quiz criado! Aguarde aprovação do administrador.'
    );
    mudarPagina('meus-quizes');
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => mudarPagina('inicio')}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-white">Criar Novo Quiz</h1>
          </div>
          
          <button
            onClick={salvarQuizCompleto}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Salvar Quiz</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título do Quiz *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Conhecimentos Gerais"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria *
              </label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Educação, Entretenimento, Ciências"
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição *
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Descreva brevemente sobre o que é este quiz..."
              maxLength={500}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Perguntas ({perguntas.length})
            </h2>
            <button
              onClick={adicionarPergunta}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Adicionar Pergunta</span>
            </button>
          </div>

          {perguntas.map((pergunta, perguntaIndex) => (
            <div key={pergunta.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">
                  Pergunta {perguntaIndex + 1}
                </h3>
                {perguntas.length > 1 && (
                  <button
                    onClick={() => removerPergunta(perguntaIndex)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Texto da Pergunta *
                </label>
                <textarea
                  value={pergunta.texto}
                  onChange={(e) => atualizarPergunta(perguntaIndex, 'texto', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Digite sua pergunta aqui..."
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Alternativas (marque a resposta correta)
                </label>
                <div className="space-y-3">
                  {pergunta.alternativas.map((alternativa, alternativaIndex) => (
                    <div key={alternativaIndex} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`resposta-${pergunta.id}`}
                        checked={pergunta.respostaCorreta === alternativaIndex}
                        onChange={() => atualizarPergunta(perguntaIndex, 'respostaCorreta', alternativaIndex)}
                        className="w-5 h-5 text-green-500 focus:ring-green-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={alternativa}
                          onChange={(e) => atualizarAlternativa(perguntaIndex, alternativaIndex, e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Alternativa ${String.fromCharCode(65 + alternativaIndex)}`}
                          maxLength={200}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            {usuarioAtual?.tipo === 'admin' 
              ? 'Como administrador, seu quiz será aprovado automaticamente'
              : 'Seu quiz será enviado para aprovação antes de ficar disponível'
            }
          </p>
        </div>
      </div>
    </div>
  );
};