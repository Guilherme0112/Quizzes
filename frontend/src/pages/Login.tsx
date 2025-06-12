import React, { useState } from 'react';
import { Users, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { login, registrar } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modoRegistro) {
        const sucesso = await registrar(nome, email, senha);
        if (sucesso) {
          setModoRegistro(false);
          setEmail('');
          setSenha('');
          setNome('');
          alert('Conta criada com sucesso! Faça login agora.');
        } else {
          setErro('Este email já está em uso');
        }
      } else {
        const sucesso = await login(email, senha);
        if (!sucesso) {
          setErro('Email ou senha incorretos');
        }
      }
    } catch (error) {
      setErro('Erro interno. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Users className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">QuizMaster</h1>
            <p className="text-gray-400">
              {modoRegistro ? 'Crie sua conta' : 'Entre na sua conta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {modoRegistro && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Sua senha"
                />
              </div>
            </div>

            {erro && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {carregando ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  {modoRegistro ? <UserPlus size={20} /> : <LogIn size={20} />}
                  <span>{modoRegistro ? 'Criar conta' : 'Entrar'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setModoRegistro(!modoRegistro);
                setErro('');
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {modoRegistro
                ? 'Já tem uma conta? Faça login'
                : 'Não tem conta? Cadastre-se'}
            </button>
          </div>

          {/* Informações de demo */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center mb-2">Demo - Credenciais de teste:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p><strong>Admin:</strong> admin@quiz.com / admin123</p>
              <p><strong>Ou crie sua conta normalmente</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};