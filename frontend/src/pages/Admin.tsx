import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, User, BarChart3 } from 'lucide-react';
import { useQuiz } from '../hooks/useQuiz';

export const Admin: React.FC = () => {
  const { obterQuizesPendentes, aprovarQuiz, obterRanking } = useQuiz();
  const [abaSelecionada, setAbaSelecionada] = useState<'pendentes' | 'estatisticas'>('pendentes');

  const quizesPendentes = obterQuizesPendentes();
  const ranking = obterRanking();
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

  const handleAprovarQuiz = (quizId: string) => {
    if (confirm('Tem certeza que deseja aprovar este quiz?')) {
      aprovarQuiz(quizId);
      alert('Quiz aprovado com sucesso!');
    }
  };

  const obterCriadorNome = (criadorId: string) => {
    const usuario = usuarios.find((u: any) => u.id === criadorId);
    return usuario ? usuario.nome : 'Usuário não encontrado';
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-gray-400">
            Gerencie quizes pendentes e visualize estatísticas da plataforma
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1 border border-gray-700 w-fit">
          <button
            onClick={() => setAbaSelecionada('pendentes')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
              abaSelecionada === 'pendentes'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <XCircle size={18} />
            <span>Pendentes ({quizesPendentes.length})</span>
          </button>
          <button
            onClick={() => setAbaSelecionada('estatisticas')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
              abaSelecionada === 'estatisticas'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <BarChart3 size={18} />
            <span>Estatísticas</span>
          </button>
        </div>

        {abaSelecionada === 'pendentes' ? (
          <div>
            {quizesPendentes.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum quiz pendente
                </h3>
                <p className="text-gray-400">
                  Todos os quizes foram revisados e aprovados!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {quizesPendentes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-gray-800 rounded-xl border border-yellow-500/30 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {quiz.titulo}
                          </h3>
                          <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
                            Pendente
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3">
                          {quiz.descricao}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                          <span className="bg-blue-600 text-blue-100 px-2 py-1 rounded-full text-xs">
                            {quiz.categoria}
                          </span>
                          <div className="flex items-center space-x-1">
                            <User size={14} />
                            <span>Por {obterCriadorNome(quiz.criadorId)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{quiz.dataCreacao.toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-4 mb-4">
                          <h4 className="text-white font-medium mb-2">
                            Perguntas ({quiz.perguntas.length})
                          </h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {quiz.perguntas.map((pergunta, index) => (
                              <div key={pergunta.id} className="text-sm">
                                <p className="text-gray-300 font-medium">
                                  {index + 1}. {pergunta.texto.substring(0, 100)}
                                  {pergunta.texto.length > 100 ? '...' : ''}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                  Resposta: {String.fromCharCode(65 + pergunta.respostaCorreta)} - {pergunta.alternativas[pergunta.respostaCorreta]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
                      <button
                        onClick={() => {/* Implementar preview */}}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                      >
                        <Eye size={16} />
                        <span>Preview</span>
                      </button>
                      
                      <button
                        onClick={() => handleAprovarQuiz(quiz.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <CheckCircle size={16} />
                        <span>Aprovar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Usuários</p>
                    <p className="text-2xl font-bold text-white">
                      {usuarios.filter((u: any) => u.tipo === 'usuario').length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <User className="text-white" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Quizes</p>
                    <p className="text-2xl font-bold text-white">
                      {JSON.parse(localStorage.getItem('quizes') || '[]').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-600 rounded-lg">
                    <CheckCircle className="text-white" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {quizesPendentes.length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-600 rounded-lg">
                    <XCircle className="text-white" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Jogadas</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {JSON.parse(localStorage.getItem('resultados') || '[]').length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Usuários */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Top 10 Usuários</h3>
              
              {ranking.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Nenhum usuário ativo ainda
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">#</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Nome</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Pontuação</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Quizes</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Precisão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.slice(0, 10).map((usuario, index) => (
                        <tr key={usuario.id} className="border-b border-gray-700/50">
                          <td className="py-3 px-4 text-white font-medium">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4 text-white">{usuario.nome}</td>
                          <td className="py-3 px-4 text-gray-400">{usuario.email}</td>
                          <td className="py-3 px-4 text-blue-400 font-medium">
                            {usuario.pontuacaoTotal}
                          </td>
                          <td className="py-3 px-4 text-white">
                            {usuario.quizesRespondidos}
                          </td>
                          <td className="py-3 px-4 text-green-400 font-medium">
                            {usuario.mediaAcertos}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};