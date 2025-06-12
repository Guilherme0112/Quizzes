// Tipos para o sistema de quiz
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: 'admin' | 'usuario';
  pontuacaoTotal: number;
  quizesRespondidos: string[];
}

export interface Pergunta {
  id: string;
  texto: string;
  alternativas: string[];
  respostaCorreta: number; // índice da resposta correta (0-3)
}

export interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  perguntas: Pergunta[];
  criadorId: string;
  aprovado: boolean;
  dataCreacao: Date;
  totalJogadas: number;
  mediaAcertos: number;
}

export interface ResultadoQuiz {
  id: string;
  usuarioId: string;
  quizId: string;
  pontuacao: number;
  totalPerguntas: number;
  tempoGasto: number; // em segundos
  dataResposta: Date;
}

export interface ContextoAuth {
  usuarioAtual: Usuario | null;
  estaLogado: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  registrar: (nome: string, email: string, senha: string) => Promise<boolean>;
}