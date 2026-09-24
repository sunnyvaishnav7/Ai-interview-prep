import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import AppNav from '../../../components/AppNav'
import { Sparkles, Eye, EyeOff, AlertCircle, Code2, BriefcaseBusiness } from 'lucide-react'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!email.trim() || !password) {
            setError("Please fill in both email and password.")
            return
        }

        try {
            setSubmitting(true)
            await handleLogin({ email, password })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to sign in. Please check credentials.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="spinner-ring" />
                <h1>Authenticating...</h1>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <AppNav publicPage />

            <div className="auth-card-wrapper">
                <div className="auth-card">
                    <div className="auth-card__header">
                        <div className="auth-badge-icon">
                            <Sparkles size={22} strokeWidth={2} />
                        </div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to your AI Interview Copilot workspace</p>
                    </div>

                    {error && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            background: 'var(--color-danger-bg)',
                            border: '1px solid var(--color-danger-border)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-danger)',
                            fontSize: '0.84rem'
                        }}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="auth-card__form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                value={email}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                className={`form-input ${error && !email ? 'form-input--error' : ''}`}
                                required
                            />
                            <label className="form-label" htmlFor="email">Work or Personal Email</label>
                        </div>

                        <div className="form-group">
                            <input
                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                value={password}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className={`form-input ${error && !password ? 'form-input--error' : ''}`}
                                required
                            />
                            <label className="form-label" htmlFor="password">Password</label>
                            <button
                                type="button"
                                className="input-icon-btn"
                                onClick={() => setShowPassword(prev => !prev)}
                                tabIndex={-1}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary"
                            style={{ height: '48px', fontSize: '0.95rem' }}
                        >
                            {submitting ? (
                                <>
                                    <div className="spinner-ring" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                "Sign In to Copilot"
                            )}
                        </button>
                    </form>

                    <div className="social-auth">
                        <div className="divider">or continue with</div>
                        <div className="social-btn-grid">
                            <button type="button" className="social-btn" title="Sign in with Google">
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12 5c1.5 0 2.8.5 3.9 1.4l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.5 2.7C6.3 7.2 8.9 5 12 5z" />
                                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                                    <path fill="#FBBC05" d="M5.4 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.4C.7 9.8 0 12.5 0 15.5s.7 5.7 1.9 8.1l3.5-2.7c-.2-.7-.4-1.5-.4-2.3z" />
                                    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.1-6.6-5.1L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z" />
                                </svg>
                            </button>
                            <button type="button" className="social-btn" title="Sign in with GitHub">
                                <Code2 size={18} />
                            </button>
                            <button type="button" className="social-btn" title="Sign in with LinkedIn">
                                <BriefcaseBusiness size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="auth-card__footer">
                        Don't have an account? <Link to="/register">Create an account</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login