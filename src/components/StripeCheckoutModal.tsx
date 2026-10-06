import React, { useState } from 'react';
import { CreditCard, QrCode, Lock, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: 'mensal' | 'anual') => void;
  user: UserProfile;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'mensal' | 'anual'>('mensal');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardName, setCardName] = useState(user.name || 'Dr. Advogado');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen) return null;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onSuccess(selectedPlan);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    }, 1800);
  };

  const amount = selectedPlan === 'mensal' ? '19,90' : '199,00';
  const originalAmount = selectedPlan === 'mensal' ? '29,90' : '358,80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#2B374E] bg-[#0C121E] p-5 sm:p-8 shadow-2xl">
        {/* Top subtle gold ambient glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          ✕
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Assinatura Ativada com Sucesso!
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Gatilho de webhook Stripe sincronizado com o CRM. Seu acesso ao Andrade Cardoso Club e todos os materiais foi liberado imediatamente.
            </p>
            <div className="font-mono-luxury text-[11px] text-[#C5A880]">
              ID Stripe: sub_live_89a4c31f6c0cf043
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-xs font-mono-luxury text-[#C5A880] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span>Checkout Seguro Criptografado · Stripe API</span>
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Andrade Cardoso Club
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Assinatura recorrente com acesso integral aos materiais de prática jurídica.
            </p>

            {/* Plan Selector */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedPlan('mensal')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPlan === 'mensal'
                    ? 'border-[#C5A880] bg-[#141E30]'
                    : 'border-[#1E2638] bg-[#090E18] hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-300">Plano Mensal</div>
                <div className="mt-2 text-xl font-bold font-mono-luxury text-white">
                  R$ 19,90<span className="text-xs text-slate-400 font-normal">/mês</span>
                </div>
                <div className="text-[11px] text-slate-500 line-through">
                  De R$ 29,90
                </div>
              </div>

              <div
                onClick={() => setSelectedPlan('anual')}
                className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                  selectedPlan === 'anual'
                    ? 'border-[#C5A880] bg-[#141E30]'
                    : 'border-[#1E2638] bg-[#090E18] hover:border-slate-700'
                }`}
              >
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-[#C5A880] text-[#0B0F17] font-bold text-[9px] uppercase">
                  Economize 33%
                </span>
                <div className="text-xs font-semibold text-slate-300">Plano Anual VIP</div>
                <div className="mt-2 text-xl font-bold font-mono-luxury text-white">
                  R$ 199,00<span className="text-xs text-slate-400 font-normal">/ano</span>
                </div>
                <div className="text-[11px] text-emerald-400">
                  R$ 16,58/mês
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="mt-6 flex border-b border-[#1E2638]">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                  paymentMethod === 'card'
                    ? 'border-[#C5A880] text-[#F3E5D0]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cartão de Crédito</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                  paymentMethod === 'pix'
                    ? 'border-[#C5A880] text-[#F3E5D0]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>PIX Instantâneo</span>
              </button>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' ? (
              <form onSubmit={handleProcessPayment} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B11] border border-[#232D42] text-xs font-mono-luxury text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                      Validade
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                      placeholder="MM/AA"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B11] border border-[#232D42] text-xs font-mono-luxury text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      required
                      placeholder="CVC"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B11] border border-[#232D42] text-xs font-mono-luxury text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Titular do Cartão
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-2 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#C5A880] hover:bg-[#D4AF37] text-[#0B0F17] transition-all shadow-lg hover:shadow-[#C5A880]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isProcessing ? 'Processando via Stripe...' : `Confirmar Assinatura (R$ ${amount})`}
                  </span>
                </button>
              </form>
            ) : (
              <div className="mt-6 text-center space-y-4">
                <div className="w-36 h-36 bg-white p-2 rounded-lg mx-auto flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white text-[10px] font-mono-luxury p-2">
                    <QrCode className="w-12 h-12 text-[#C5A880] mb-1" />
                    <span>QR CODE PIX STRIPE</span>
                  </div>
                </div>
                <div className="text-xs text-slate-300">
                  Escaneie o QR Code no app do seu banco ou use a chave Copia e Cola:
                </div>
                <div className="p-2.5 rounded bg-[#080B11] border border-[#1E2638] font-mono-luxury text-[11px] text-[#C5A880] truncate">
                  00020126580014br.gov.bcb.pix0136andrade-cardoso-stripe-live-key
                </div>
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#C5A880] hover:bg-[#D4AF37] text-[#0B0F17] transition-colors cursor-pointer"
                >
                  {isProcessing ? 'Confirmando pagamento...' : 'Já realizei o PIX (Liberar Acesso)'}
                </button>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Criptografia SSL 256-bit
              </span>
              <span>Garantia incondicional de 7 dias</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
