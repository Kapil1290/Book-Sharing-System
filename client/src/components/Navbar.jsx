import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen color="var(--primary)" size={28} />
                <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>StudyShare</h1>
            </Link>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/" style={{ fontWeight: '500' }}>Explore</Link>
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <UserIcon size={18} /> Dashboard
                        </Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <button className="btn" onClick={() => navigate('/dashboard')}>
                        Login / Register
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
