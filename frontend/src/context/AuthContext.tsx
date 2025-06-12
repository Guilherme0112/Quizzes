import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, ContextoAuth } from '../types';

const AuthContext = createContext<ContextoAuth | undefined>(undefined);

export const useAuth = () => {
  const contexto = useContext(AuthContext);
  if (contexto === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return contexto;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuarioAtual');
    if (usuarioSalvo) {
      setUsuarioAtual(JSON.parse(usuarioSalvo));
    }

    // Criar usuário admin padrão se não existir
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const adminExiste = usuarios.find((u: Usuario) => u.tipo === 'admin');
    
    if (!adminExiste) {
      const adminPadrao: Usuario = {
        id: 'admin-1',
        nome: 'Administrador',
        email: 'admin@quiz.com',
        senha: 'admin123',
        tipo: 'admin',
        pontuacaoTotal: 0,
        quizesRespondidos: []
      };
      usuarios.push(adminPadrao);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    const usuarios: Usuario[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuario) {
      setUsuarioAtual(usuario);
      localStorage.setItem('usuarioAtual', JSON.stringify(usuario));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuarioAtual(null);
    localStorage.removeItem('usuarioAtual');
  };

  const registrar = async (nome: string, email: string, senha: string): Promise<boolean> => {
    const usuarios: Usuario[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    if (usuarios.find(u => u.email === email)) {
      return false; // Email já existe
    }

    const novoUsuario: Usuario = {
      id: `user-${Date.now()}`,
      nome,
      email,
      senha,
      tipo: 'usuario',
      pontuacaoTotal: 0,
      quizesRespondidos: []
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return true;
  };

  const valor: ContextoAuth = {
    usuarioAtual,
    estaLogado: !!usuarioAtual,
    login,
    logout,
    registrar
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
};