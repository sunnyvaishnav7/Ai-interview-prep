import React, { useContext } from "react"
import { Link, useNavigate } from "react-router"
import { AuthContext } from "../features/auth/auth.context"
import { logout } from "../features/auth/services/auth.api"
import { Sparkles, Compass, History, PlusCircle, LogOut, LogIn } from "lucide-react"

const AppNav = ({ publicPage = false }) => {
    const { user, setUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (e) {
            console.error("Logout error", e)
        }
        setUser(null)
        navigate('/login')
    }

    const userInitial = (user?.username || user?.email || "U").charAt(0).toUpperCase()

    return (
        <header className={`app-nav ${publicPage ? "app-nav--public" : ""}`}>
            <Link className="app-nav__brand" to="/">
                <div className="brand-mark">
                    <Sparkles size={18} strokeWidth={2} />
                </div>
                <span>AI Interview <span style={{ color: "var(--orange-500)" }}>Copilot</span></span>
            </Link>

            {!publicPage && (
                <nav className="app-nav__links" aria-label="Main navigation">
                    <Link to="/">
                        <Compass size={16} strokeWidth={1.5} />
                        <span>Workspace</span>
                    </Link>
                    <a href="#recent-reports">
                        <History size={16} strokeWidth={1.5} />
                        <span>Recent Plans</span>
                    </a>
                    <Link to="/">
                        <PlusCircle size={16} strokeWidth={1.5} />
                        <span>New Strategy</span>
                    </Link>
                </nav>
            )}

            <div className="app-nav__actions">
                {user && !publicPage ? (
                    <>
                        <div className="user-badge" title={user.email || user.username}>
                            <span className="avatar-circle">{userInitial}</span>
                            <span className="username-text">{user.username || user.email?.split('@')[0]}</span>
                        </div>
                        <button className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: "0.82rem" }} onClick={handleLogout}>
                            <LogOut size={14} strokeWidth={1.5} />
                            <span>Sign out</span>
                        </button>
                    </>
                ) : (
                    <Link className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }} to="/login">
                        <LogIn size={15} strokeWidth={1.5} />
                        <span>Sign in</span>
                    </Link>
                )}
            </div>
        </header>
    )
}

export default AppNav
