import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, User, Calendar } from 'lucide-react';
import { useQuiz } from '../hooks/useQuiz';

export const Ranking: React.FC = () => {
  const { obterRanking, obterQuizesAprovados } = useQuiz();
  const [abaSelecionada, setAbaSelecionada] = useState<'usuarios' | 'quizes'>('usuarios');
  
  const ranking = obterRanking();
  const quizesAprovados = obterQuizesAprovados()
    .sort((a, b) => b.totalJogadas - a.totalJogadas)
    .slice(0, 10);

  const obterIconePosicao = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Trophy className="text-yellow-400" size={24} />;
      case 2:
        return <Medal className="text-gray-300" size={24} />;
      case 3:
        return <Award className="text-amber-600" size={24} />;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold text-white">{posicao}</div>;
    }
  };

  const obterCorPosicao = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'border-yellow-400 bg-yellow-400/10';
      case 2:
        return 'border-gray-300 bg-gray-300/10';
      case 3:
        return 'border-amber-600 bg-amber-600/10';
      default:
        return 'border-gray-700 bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <Trophy className="inline-block mr-3 text-yellow-400" size={40} />
            Ranking
          </h1>
          <p className="text-xl text-gray-400">
            Veja os melhores jogadores e quizes mais populares
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setAbaSelecionada('usuarios')}
              className={`w-full px-6 py-3 mb-1 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                abaSelecionada === 'usuarios'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <User size={18} />
              <span>Top Jogadores</span>
            </button>
            <button
              onClick={() => setAbaSelecionada('quizes')}
              className={`w-full px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                abaSelecionada === 'quizes'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <TrendingUp size={18} />
              <span>Quizes Populares</span>
            </button>
          </div>
        </div>

        {abaSelecionada === 'usuarios' ? (
          <div>
            {ranking.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="mx-auto text-gray-500 mb-4" size={64} />
                <p className="text-gray-400 text-lg">
                  Nenhum jogador no ranking ainda
                </p>
                <p className="text-gray-500 text-sm">
                  Seja o primeiro a responder um quiz!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ranking.map((usuario, index) => (
                  <div
                    key={usuario.id}
                    className={`rounded-xl border-2 p-6 transition-all duration-300 hover:transform hover:scale-[1.02] ${obterCorPosicao(index + 1)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {obterIconePosicao(index + 1)}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {usuario.nome}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {usuario.quizesRespondidos} quiz{usuario.quizesRespondidos !== 1 ? 'es' : ''} respondido{usuario.quizesRespondidos !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                          {usuario.pontuacaoTotal}
                        </div>
                        <div className="text-sm text-gray-400">
                          {usuario.mediaAcertos}% de precisão
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {quizesAprovados.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="mx-auto text-gray-500 mb-4" size={64} />
                <p className="text-gray-400 text-lg">
                  Nenhum quiz foi jogado ainda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizesAprovados.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {quiz.titulo}
                        </h3>
                        <span className="inline-block bg-blue-600 text-blue-100 px-2 py-1 rounded-full text-xs font-medium">
                          {quiz.categoria}
                        </span>
                      </div>
                      <div className="ml-2 text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          #{index + 1}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Jogadas</span>
                        <span className="text-white font-medium">{quiz.totalJogadas}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Média de Acertos</span>
                        <span className="text-green-400 font-medium">
                          {Math.round(quiz.mediaAcertos)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Perguntas</span>
                        <span className="text-blue-400 font-medium">{quiz.perguntas.length}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700 flex items-center text-xs text-gray-400">
                      <Calendar size={12} className="mr-1" />
                      Criado em {quiz.dataCreacao.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};