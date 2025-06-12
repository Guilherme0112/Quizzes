import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../hooks/useQuiz';

interface MeusQuizesProps {
  mudarPagina: (pagina: string) => void;
}

export const MeusQuizes: React.FC<MeusQuizesProps> = ({ mudarPagina }) => {
  const { usuarioAtual } = useAuth();
  const { obterQuizesPorUsuario } = useQuiz();
  const [filtro, setFiltro] = useState<'todos' | 'aprovados' | 'pendentes'>('todos');

  const meusQuizes = obterQuizesPorUsuario(usuarioAtual!.id);
  
  const quizesFiltrados = meusQuizes.filter(quiz => {
    switch (filtro) {
      case 'aprovados':
        return quiz.aprovado;
      case 'pendentes':
        return !quiz.aprovado;
      default:
        return true;
    }
  });

  const obterStatusInfo = (aprovado: boolean) => {
    if (aprovado) {
      return {
        icon: <CheckCircle size={16} className="text-green-400" />,
        texto: 'Aprovado',
        cor: 'text-green-400'
      };
    }
    return {
      icon: <AlertCircle size={16} className="text-yellow-400" />,
      texto: 'Pendente',
      cor: 'text-yellow-400'
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Meus Quizes</h1>
            <p className="text-gray-400">
              Gerencie todos os quizes que você criou
            </p>
          </div>
          
          <button
            onClick={() => mudarPagina('criar-quiz')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Novo Quiz</span>
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Quizes</p>
                <p className="text-2xl font-bold text-white">{meusQuizes.length}</p>
              </div>
              <div className="p-3 bg-blue-600 rounded-lg">
                <Eye className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Aprovados</p>
                <p className="text-2xl font-bold text-green-400">
                  {meusQuizes.filter(q => q.aprovado).length}
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
                <p className="text-gray-400 text-sm">Total de Jogadas</p>
                <p className="text-2xl font-bold text-blue-400">
                  {meusQuizes.reduce((acc, quiz) => acc + quiz.totalJogadas, 0)}
                </p>
              </div>
              <div className="p-3 bg-yellow-600 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1 border border-gray-700 w-fit">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'aprovados', label: 'Aprovados' },
            { id: 'pendentes', label: 'Pendentes' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFiltro(item.id as any)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                filtro === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Lista de Quizes */}
        {quizesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Eye className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {filtro === 'todos' ? 'Nenhum quiz criado' : `Nenhum quiz ${filtro === 'aprovados' ? 'aprovado' : 'pendente'}`}
            </h3>
            <p className="text-gray-400 mb-6">
              {filtro === 'todos' 
                ? 'Comece criando seu primeiro quiz!'
                : `Você não tem quizes ${filtro === 'aprovados' ? 'aprovados' : 'pendentes de aprovação'} no momento.`
              }
            </p>
            {filtro === 'todos' && (
              <button
                onClick={() => mudarPagina('criar-quiz')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Criar Primeiro Quiz
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {quizesFiltrados.map((quiz) => {
              const statusInfo = obterStatusInfo(quiz.aprovado);
              
              return (
                <div
                  key={quiz.id}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {quiz.titulo}
                        </h3>
                        <div className={`flex items-center space-x-1 ${statusInfo.cor}`}>
                          {statusInfo.icon}
                          <span className="text-sm font-medium">{statusInfo.texto}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {quiz.descricao}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="bg-blue-600 text-blue-100 px-2 py-1 rounded-full text-xs">
                          {quiz.categoria}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{quiz.perguntas.length} pergunta{quiz.perguntas.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{quiz.totalJogadas} jogada{quiz.totalJogadas !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {/* Implementar visualização */}}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button
                        onClick={() => {/* Implementar edição */}}
                        className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      
                      <button
                        onClick={() => {/* Implementar exclusão */}}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <div className="text-xs text-gray-400">
                      Criado em {quiz.dataCreacao.toLocaleDateString('pt-BR')}
                    </div>
                    
                    {quiz.aprovado && quiz.mediaAcertos > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-400">Média de acertos: </span>
                        <span className="text-green-400 font-medium">
                          {Math.round(quiz.mediaAcertos)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};