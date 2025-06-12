import React, { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { CardQuiz } from '../components/CardQuiz';
import { useQuiz } from '../hooks/useQuiz';

interface InicioProps {
  mudarPagina: (pagina: string, dados?: any) => void;
}

export const Inicio: React.FC<InicioProps> = ({ mudarPagina }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const { obterQuizesAprovados } = useQuiz();

  const quizesAprovados = obterQuizesAprovados();

  const categorias = useMemo(() => {
    const cats = quizesAprovados.map(quiz => quiz.categoria);
    return Array.from(new Set(cats)).sort();
  }, [quizesAprovados]);

  const quizesFiltrados = useMemo(() => {
    return quizesAprovados.filter(quiz => {
      const matcheBusca = quiz.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
                          quiz.descricao.toLowerCase().includes(termoBusca.toLowerCase());
      const matcheCategoria = !categoriaFiltro || quiz.categoria === categoriaFiltro;
      return matcheBusca && matcheCategoria;
    });
  }, [quizesAprovados, termoBusca, categoriaFiltro]);

  const quizesPopulares = useMemo(() => {
    return quizesAprovados
      .filter(quiz => quiz.totalJogadas > 0)
      .sort((a, b) => b.totalJogadas - a.totalJogadas)
      .slice(0, 3);
  }, [quizesAprovados]);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Teste Seus <span className="text-blue-400">Conhecimentos</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Descubra novos assuntos, desafie seus amigos e suba no ranking dos melhores jogadores
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="pl-11 pr-8 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[200px]"
              >
                <option value="">Todas as categorias</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quizes Populares */}
        {quizesPopulares.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="text-yellow-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Mais Populares</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizesPopulares.map(quiz => (
                <CardQuiz
                  key={quiz.id}
                  quiz={quiz}
                  aoClicar={() => mudarPagina('responder-quiz', quiz)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Todos os Quizes */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {termoBusca || categoriaFiltro ? 'Resultados da Busca' : 'Todos os Quizes'}
            </h2>
            <span className="text-gray-400 text-sm">
              {quizesFiltrados.length} quiz{quizesFiltrados.length !== 1 ? 'es' : ''} encontrado{quizesFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>

          {quizesFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                {termoBusca || categoriaFiltro
                  ? 'Nenhum quiz encontrado com os filtros aplicados'
                  : 'Nenhum quiz disponível no momento'}
              </p>
              <button
                onClick={() => mudarPagina('criar-quiz')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Criar o primeiro quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quizesFiltrados.map(quiz => (
                <CardQuiz
                  key={quiz.id}
                  quiz={quiz}
                  aoClicar={() => mudarPagina('responder-quiz', quiz)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};