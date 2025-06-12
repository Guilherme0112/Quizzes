import { useState, useEffect } from 'react';
import { Quiz, ResultadoQuiz } from '../types';

export const useQuiz = () => {
  const [quizes, setQuizes] = useState<Quiz[]>([]);
  const [resultados, setResultados] = useState<ResultadoQuiz[]>([]);

  useEffect(() => {
    carregarQuizes();
    carregarResultados();
  }, []);

  const carregarQuizes = () => {
    const quizesSalvos = localStorage.getItem('quizes');
    if (quizesSalvos) {
      const quizesParseados = JSON.parse(quizesSalvos).map((quiz: any) => ({
        ...quiz,
        dataCreacao: new Date(quiz.dataCreacao)
      }));
      setQuizes(quizesParseados);
    }
  };

  const carregarResultados = () => {
    const resultadosSalvos = localStorage.getItem('resultados');
    if (resultadosSalvos) {
      const resultadosParseados = JSON.parse(resultadosSalvos).map((resultado: any) => ({
        ...resultado,
        dataResposta: new Date(resultado.dataResposta)
      }));
      setResultados(resultadosParseados);
    }
  };

  const salvarQuiz = (quiz: Quiz) => {
    const novosQuizes = [...quizes, quiz];
    setQuizes(novosQuizes);
    localStorage.setItem('quizes', JSON.stringify(novosQuizes));
  };

  const aprovarQuiz = (quizId: string) => {
    const quizesAtualizados = quizes.map(quiz =>
      quiz.id === quizId ? { ...quiz, aprovado: true } : quiz
    );
    setQuizes(quizesAtualizados);
    localStorage.setItem('quizes', JSON.stringify(quizesAtualizados));
  };

  const salvarResultado = (resultado: ResultadoQuiz) => {
    const novosResultados = [...resultados, resultado];
    setResultados(novosResultados);
    localStorage.setItem('resultados', JSON.stringify(novosResultados));
    
    // Atualizar estatísticas do quiz
    const quizIndex = quizes.findIndex(q => q.id === resultado.quizId);
    if (quizIndex !== -1) {
      const quizAtualizado = { ...quizes[quizIndex] };
      quizAtualizado.totalJogadas += 1;
      
      const resultadosDoQuiz = novosResultados.filter(r => r.quizId === resultado.quizId);
      const mediaAcertos = resultadosDoQuiz.reduce((acc, r) => acc + (r.pontuacao / r.totalPerguntas), 0) / resultadosDoQuiz.length;
      quizAtualizado.mediaAcertos = mediaAcertos * 100;
      
      const quizesAtualizados = [...quizes];
      quizesAtualizados[quizIndex] = quizAtualizado;
      setQuizes(quizesAtualizados);
      localStorage.setItem('quizes', JSON.stringify(quizesAtualizados));
    }
  };

  const obterQuizesAprovados = () => quizes.filter(quiz => quiz.aprovado);
  
  const obterQuizesPendentes = () => quizes.filter(quiz => !quiz.aprovado);
  
  const obterQuizesPorUsuario = (usuarioId: string) => 
    quizes.filter(quiz => quiz.criadorId === usuarioId);

  const obterRanking = () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    return usuarios
      .filter((u: any) => u.tipo === 'usuario')
      .map((usuario: any) => {
        const resultadosUsuario = resultados.filter(r => r.usuarioId === usuario.id);
        const pontuacaoTotal = resultadosUsuario.reduce((acc, r) => acc + r.pontuacao, 0);
        const quizesRespondidos = resultadosUsuario.length;
        const mediaAcertos = quizesRespondidos > 0 
          ? resultadosUsuario.reduce((acc, r) => acc + (r.pontuacao / r.totalPerguntas), 0) / quizesRespondidos * 100
          : 0;

        return {
          ...usuario,
          pontuacaoTotal,
          quizesRespondidos,
          mediaAcertos: Math.round(mediaAcertos)
        };
      })
      .sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);
  };

  return {
    quizes,
    resultados,
    salvarQuiz,
    aprovarQuiz,
    salvarResultado,
    obterQuizesAprovados,
    obterQuizesPendentes,
    obterQuizesPorUsuario,
    obterRanking,
    carregarQuizes
  };
};