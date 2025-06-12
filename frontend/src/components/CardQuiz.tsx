import { Clock, Users, Star, Play } from 'lucide-react';
import { Quiz } from '../types';

interface CardQuizProps {
  quiz: Quiz;
  aoClicar: () => void;
}

export const CardQuiz: React.FC<CardQuizProps> = ({ quiz, aoClicar }) => {
  const tempoEstimado = Math.ceil(quiz.perguntas.length * 1.5); // 1.5 min por pergunta

  return (
    <div 
      className="bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 p-6 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl group"
      onClick={aoClicar}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {quiz.titulo}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {quiz.descricao}
          </p>
          <span className="inline-block bg-blue-600 text-blue-100 px-3 py-1 rounded-full text-xs font-medium">
            {quiz.categoria}
          </span>
        </div>
        <div className="ml-4 text-blue-400 group-hover:text-blue-300 transition-colors">
          <Play size={24} />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>~{tempoEstimado} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{quiz.totalJogadas}</span>
          </div>
        </div>
        
        {quiz.mediaAcertos > 0 && (
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400" />
            <span>{Math.round(quiz.mediaAcertos)}%</span>
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        <span className="text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
          {quiz.perguntas.length} pergunta{quiz.perguntas.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};