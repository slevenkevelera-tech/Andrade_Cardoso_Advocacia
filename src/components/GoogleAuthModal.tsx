import React from 'react';
import { UserProfile } from '../types';
import { Shield, Sparkles, Check, LogOut, Lock } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (newUser: UserProfile) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  if (!isOpen) return null;

  const handleSignInGoogle = () => {
    onUpdateUser({
      name: 'Dr. Sleven Kevelera',
      email: 'slevenkevelera@gmail.com',
      role: 'subscriber',
      hasActiveSubscription: true,
      planName: 'Andrade Cardoso Club VIP (R$ 19,90)',
    });
    onClose();
  };

  const handleSetRole = (role: 'admin' | 'subscriber' | 'guest') => {
    if (role === 'admin') {
      onUpdateUser({
        name: 'Dr. Maurilo Cardoso',
        email: 'maurilo@andradecardoso.adv.br',
        role: 'admin',
        hasActiveSubscription: true,
        planName: 'Gabinete Executivo / OAB Cametá',
      });
    } else if (role === 'subscriber') {
      onUpdateUser({
        name: 'Dr. Sleven Kevelera',
        email: 'slevenkevelera@gmail.com',
        role: 'subscriber',
        hasActiveSubscription: true,
        planName: 'Andrade Cardoso Club VIP (R$ 19,90)',
      });
    } else {
      onUpdateUser({
        name: 'Visitante Institucional',
        email: 'visitante@corporativo.com.br',
        role: 'guest',
        hasActiveSubscription: false,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#2B374E] bg-[#0C121E] p-5 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#121A2C] border border-[#232F47] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-[#C5A880]" />
          </div>
          <h3 className="font-cinzel text-xl font-bold text-white">
            Autenticação & Acesso Seguro
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Conecte sua conta Google para gerenciar assinaturas, materiais e consultas jurídicas.
          </p>
        </div>

        {/* Current User Status Box */}
        <div className="mt-6 p-4 rounded-xl border border-[#1E2638] bg-[#080B11] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#182338] border border-[#293852] flex items-center justify-center font-bold text-sm text-[#C5A880]">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{user.name}</div>
              <div className="text-[11px] text-slate-400 font-mono-luxury">{user.email}</div>
            </div>
          </div>
          <span className="text-[10px] font-mono-luxury px-2 py-0.5 rounded bg-[#131D2E] text-[#C5A880] border border-[#223149]">
            {user.role.toUpperCase()}
          </span>
        </div>

        {/* Google OAuth Button */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleSignInGoogle}
            className="w-full py-3 px-4 rounded-xl border border-slate-700 bg-white hover:bg-slate-100 text-slate-900 font-medium text-xs flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer"
          >
            {/* Google G SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Entrar com conta Google ({user.email})</span>
          </button>
        </div>

        {/* Fast Role Simulator for Testing */}
        <div className="mt-6 pt-5 border-t border-[#1E2638]">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2 font-medium">
            Alternar Perfil para Teste & Demonstração:
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleSetRole('admin')}
              className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                user.role === 'admin'
                  ? 'border-[#C5A880] bg-[#172133] text-[#F3E5D0] font-semibold'
                  : 'border-[#1E2638] bg-[#080B11] text-slate-400 hover:text-white'
              }`}
            >
              Dr. Maurilo (Admin)
            </button>
            <button
              onClick={() => handleSetRole('subscriber')}
              className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                user.role === 'subscriber'
                  ? 'border-[#C5A880] bg-[#172133] text-[#F3E5D0] font-semibold'
                  : 'border-[#1E2638] bg-[#080B11] text-slate-400 hover:text-white'
              }`}
            >
              Assinante (R$ 19,90)
            </button>
            <button
              onClick={() => handleSetRole('guest')}
              className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                user.role === 'guest'
                  ? 'border-[#C5A880] bg-[#172133] text-[#F3E5D0] font-semibold'
                  : 'border-[#1E2638] bg-[#080B11] text-slate-400 hover:text-white'
              }`}
            >
              Visitante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
