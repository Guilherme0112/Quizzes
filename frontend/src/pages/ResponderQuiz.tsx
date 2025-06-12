import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../hooks/useQuiz';
import { Quiz, ResultadoQuiz } from '../types';

interface ResponderQuizProps {
  quiz: Quiz;
  mudarPagina: (pagina: string) => void;
}

export const ResponderQuiz: React.FC<ResponderQuizProps> = ({ quiz, mudarPagina }) => {
  const { usuarioAtual } = useAuth();
  const { salvarResultado } = useQuiz();
  
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [tempoInicio, setTempoInicio] = useState<Date>(new Date());
  const [tempoRestante, setTempoRestante] = useState(60); // 60 segundos por pergunta
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);

  useEffect(() => {
    if (quizFinalizado) return;

    const timer = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          proximaPergunta();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [perguntaAtual, quizFinalizado]);

  const proximaPergunta = () => {
    if (!respostas[perguntaAtual]) {
      setRespostas(prev => [...prev, -1]); // -1 significa não respondeu
    }

    if (perguntaAtual < quiz.perguntas.length - 1) {
      setPerguntaAtual(prev => prev + 1);
      setTempoRestante(60);
    } else {
      finalizarQuiz();
    }
  };

  const selecionarResposta = (alternativaIndex: number) => {
    const novasRespostas = [...respostas];
    novasRespostas[perguntaAtual] = alternativaIndex;
    setRespostas(novasRespostas);
  };

  const finalizarQuiz = () => {
    const tempoFim = new Date();
    const tempoTotal = Math.round((tempoFim.getTime() - tempoInicio.getTime()) / 1000);
    
    let acertos = 0;
    quiz.perguntas.forEach((pergunta, index) => {
      if (respostas[index] === pergunta.respostaCorreta) {
        acertos++;
      }
    });

    setPontuacao(acertos);
    setQuizFinalizado(true);

    const resultado: ResultadoQuiz = {
      id: Date.now().toString(),
      usuarioId: usuarioAtual!.id,
      quizId: quiz.id,
      pontuacao: acertos,
      totalPerguntas: quiz.perguntas.length,
      tempoGasto: tempoTotal,
      dataResposta: new Date()
    };

    salvarResultado(resultado);
  };

  const obterCorAlternativa = (alternativaIndex: number) => {
    if (!quizFinalizado) {
      return respostas[perguntaAtual] === alternativaIndex 
        ? 'bg-blue-600 border-blue-500 text-white' 
        : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600';
    }

    const pergunta = quiz.perguntas[perguntaAtual];
    if (alternativaIndex === pergunta.respostaCorreta) {
      return 'bg-green-600 border-green-500 text-white';
    } else if (respostas[perguntaAtual] === alternativaIndex) {
      return 'bg-red-600 border-red-500 text-white';
    }
    return 'bg-gray-700 border-gray-600 text-gray-300';
  };

  if (quizFinalizado) {
    const porcentagemAcertos = Math.round((pontuacao / quiz.perguntas.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
          <div className="mb-8">
            {porcentagemAcertos >= 70 ? (
              <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
            ) : (
              <XCircle className="mx-auto text-red-400 mb-4" size={64} />
            )}
            
            <h1 className="text-3xl font-bold text-white mb-4">
              {porcentagemAcertos >= 70 ? 'Parabéns!' : 'Quiz Finalizado'}
            </h1>
            
            <div className="text-6xl font-bold text-blue-400 mb-2">
              {porcentagemAcertos}%
            </div>
            
            <p className="text-xl text-gray-300 mb-6">
              Você acertou {pontuacao} de {quiz.perguntas.length} pergunta{quiz.perguntas.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Tempo Total</h3>
              <p className="text-2xl text-blue-400">
                {Math.floor((Date.now() - tempoInicio.getTime()) / 60000)}:
                {String(Math.floor(((Date.now() - tempoInicio.getTime()) % 60000) / 1000)).padStart(2, '0')}
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Precisão</h3>
              <p className="text-2xl text-green-400">{porcentagemAcertos}%</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => mudarPagina('ranking')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Ver Ranking
            </button>
            
            <button
              onClick={() => mudarPagina('inicio')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pergunta = quiz.perguntas[perguntaAtual];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => mudarPagina('inicio')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{quiz.titulo}</h1>
            <p className="text-gray-400">
              Pergunta {perguntaAtual + 1} de {quiz.perguntas.length}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-white">
            <Clock size={20} />
            <span className={`font-mono text-lg ${tempoRestante <= 10 ? 'text-red-400' : 'text-white'}`}>
              {String(Math.floor(tempoRestante / 60)).padStart(2, '0')}:
              {String(tempoRestante % 60).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-8">
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((perguntaAtual + 1) / quiz.perguntas.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Pergunta */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-8 leading-relaxed">
            {pergunta.texto}
          </h2>

          <div className="space-y-4">
            {pergunta.alternativas.map((alternativa, index) => (
              <button
                key={index}
                onClick={() => selecionarResposta(index)}
                className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ${obterCorAlternativa(index)}`}
                disabled={quizFinalizado}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg">{alternativa}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Botão de Próxima */}
        <div className="text-center">
          <button
            onClick={proximaPergunta}
            disabled={respostas[perguntaAtual] === undefined}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {perguntaAtual === quiz.perguntas.length - 1 ? 'Finalizar Quiz' : 'Próxima Pergunta'}
          </button>
        </div>
      </div>
    </div>
  );
};