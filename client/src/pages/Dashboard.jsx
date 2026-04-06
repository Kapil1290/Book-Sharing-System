import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MaterialCard from '../components/MaterialCard';

const Dashboard = () => {
    const { user, login, register, loading } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    // Form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    
    // Auth logic
    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(username, email, password);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Authentication failed");
        }
    };

    const [userMaterials, setUserMaterials] = useState([]);
    
    useEffect(() => {
        if (user) {
            const fetchUserMaterials = async () => {
                try {
                    const res = await api.get(`/materials?uploader=${user._id}`);
                    setUserMaterials(res.data);
                } catch (error) {
                    console.error('Error fetching user materials', error);
                }
            };
            fetchUserMaterials();
        }
    }, [user]);

    if (loading) return <div className="container"><p>Loading...</p></div>;

    if (!user) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="glass animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }} className="gradient-text">
                        {isLogin ? 'Welcome Back' : 'Join StudyShare'}
                    </h2>
                    <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {!isLogin && (
                            <input type="text" placeholder="Username" className="input-field" value={username} onChange={e => setUsername(e.target.value)} required />
                        )}
                        <input type="email" placeholder="Email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
                        
                        <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem' }}>
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Register here' : 'Login here'}
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    // Authenticated Dashboard
    return (
        <div className="container animate-fade-in">
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Welcome, {user.username}!</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--text-muted)' }}>Your Role</h3>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' , textTransform: 'capitalize'}}>{user.role}</p>
                </div>
                <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--text-muted)' }}>Your Uploads</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{userMaterials ? Math.max(userMaterials.length, user.uploadsCount || 0) : (user.uploadsCount || 0)}</p>
                </div>
                <div className="glass" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button className="btn" onClick={() => navigate('/upload')} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        + Upload Material
                    </button>
                </div>
            </div>
            
            {/* Uploaded Materials Section */}
            <div style={{ marginTop: '3rem' }}>
                <h2 className="gradient-text" style={{ marginBottom: '1.5rem' }}>Your Uploaded Materials</h2>
                {userMaterials.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>You haven't uploaded any materials yet.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {userMaterials.map(material => (
                            <MaterialCard key={material._id} material={material} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
