import { useState, useEffect } from 'react';
import api from '../api/axios';
import MaterialCard from '../components/MaterialCard';
import { Search } from 'lucide-react';

const Home = () => {
    const [materials, setMaterials] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/materials${search ? `?search=${search}` : ''}`);
            setMaterials(res.data);
        } catch (error) {
            console.error('Error fetching materials', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMaterials();
    }, [search]);

    return (
        <div className="container animate-fade-in">
            {/* Hero Section */}
            <header className="glass" style={{ padding: '3rem', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ zIndex: 1, maxWidth: '50%' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }} className="gradient-text">Share Knowledge,<br/>Shape the Future</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                        Join the premier student platform to upload, search, and download high-quality study materials, notes, and books.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Search style={{ margin: 'auto 0 auto 10px', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Search by title, subject or keywords..." 
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                {/* Dynamically Generated Study Image */}
                <div style={{ zIndex: 1, maxWidth: '40%' }}>
                    <img src="/study_hero.png" alt="Study Dashboard Illustration" style={{ width: '100%', filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))' }} />
                </div>
            </header>

            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Latest Materials</h2>
            
            {loading ? (
                <p>Loading materials...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {materials.map(mat => (
                        <MaterialCard key={mat._id} material={mat} />
                    ))}
                    {materials.length === 0 && <p>No materials found.</p>}
                </div>
            )}
        </div>
    );
};

export default Home;
