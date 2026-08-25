import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Layers, ArrowRight, ShieldCheck, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const { login, loginAsDemo } = useAuth();
  const { addToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Veuillez renseigner vos identifiants', 'warning');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      addToast('Connexion réussie', 'success');
    } catch (err) {
      addToast(err.message || 'Identifiants invalides', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    try {
      setLoading(true);
      await loginAsDemo(demoEmail);
      addToast('Connexion démo réussie', 'success');
    } catch (err) {
      addToast(err.message || 'Erreur de connexion démo', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0b0f19 70%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '1000px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
          zIndex: 10
        }}
      >
        {/* Left Side: Brand presentation & Demo accounts */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
                }}
              >
                <Layers size={24} />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#ffffff' }}>
                Co<span style={{ color: 'var(--primary)' }}>Pilote</span> Entreprise
              </h1>
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Votre allié au quotidien pour la gestion, la validation hiérarchique et le suivi de toutes les opérations de l'entreprise.
            </p>
          </div>

          {/* Quick Demo Login Cards */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)' }}>
                Accès Rapide Démo (1-Clic par Rôle)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleDemoLogin(acc.email)}
                  disabled={loading}
                  className="glass-card"
                  style={{
                    padding: '0.875rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = acc.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        color: acc.color,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {acc.role}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {acc.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {acc.department}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Standard Login Card */}
        <div
          className="glass-card"
          style={{
            padding: '2.25rem',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '0.35rem' }}>
              Connexion Sécurisée
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Accédez à votre espace opérationnel avec vos identifiants JWT.
            </p>
          </div>

          <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Adresse Email Professionnelle :</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="var(--text-dim)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="nom@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mot de Passe :</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="var(--text-dim)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', height: '44px', marginTop: '0.5rem', fontSize: '0.95rem' }}
            >
              <span>{loading ? 'Authentification...' : 'Se Connecter'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-dim)'
            }}
          >
            Sécurité renforcée par hachage bcrypt & jetons signés JSON Web Token (JWT).
          </div>
        </div>
      </div>
    </div>
  );
};
