import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Inicio } from './pages/Inicio';
import { CriarQuiz } from './pages/CriarQuiz';
import { ResponderQuiz } from './pages/ResponderQuiz';
import { Ranking } from './pages/Ranking';
import { MeusQuizes } from './pages/MeusQuizes';
import { Admin } from './pages/Admin';
import { Quiz } from './types';

const AppContent: React.FC = () => {
  const { estaLogado, usuarioAtual } = useAuth();
  const [paginaAtual, setPaginaAtual] = useState('inicio');
  const [dadosPagina, setDadosPagina] = useState<any>(null);

  const mudarPagina = (pagina: string, dados?: any) => {
    setPaginaAtual(pagina);
    setDadosPagina(dados);
  };

  if (!estaLogado) {
    return <Login />;
  }

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'inicio':
        return <Inicio mudarPagina={mudarPagina} />;
      case 'criar-quiz':
        return <CriarQuiz mudarPagina={mudarPagina} />;
      case 'responder-quiz':
        return <ResponderQuiz quiz={dadosPagina as Quiz} mudarPagina={mudarPagina} />;
      case 'ranking':
        return <Ranking />;
      case 'meus-quizes':
        return <MeusQuizes mudarPagina={mudarPagina} />;
      case 'admin':
        return usuarioAtual?.tipo === 'admin' ? <Admin /> : <Inicio mudarPagina={mudarPagina} />;
      default:
        return <Inicio mudarPagina={mudarPagina} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header paginaAtual={paginaAtual} mudarPagina={mudarPagina} />
      {renderizarPagina()}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;