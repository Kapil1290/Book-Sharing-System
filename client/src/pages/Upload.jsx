import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { UploadCloud } from 'lucide-react';

const Upload = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', subject: '', semester: '', tags: '', fileType: 'note'
    });
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <div className="container"><p>Please login to upload.</p></div>;
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFile = e => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!file) return alert('Please attach a file');
        
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('file', file);

        try {
            await api.post('/materials', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Upload successful!');
            navigate('/');
        } catch (error) {
            console.error('Upload Error', error);
            alert(error.response?.data?.message || 'Upload failed');
        }
        setLoading(false);
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
            <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
                <h1 className="gradient-text" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UploadCloud size={32} /> Contribute Material
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ color: 'var(--text-muted)' }}>Title *</label>
                            <input name="title" className="input-field" onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-muted)' }}>Material Type *</label>
                            <select name="fileType" className="input-field" onChange={handleChange}>
                                <option value="note">Class Notes</option>
                                <option value="book">eBook</option>
                                <option value="pdf">PDF Document</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-muted)' }}>Subject *</label>
                            <input name="subject" className="input-field" onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-muted)' }}>Semester/Class *</label>
                            <input name="semester" className="input-field" onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div>
                        <label style={{ color: 'var(--text-muted)' }}>Description *</label>
                        <textarea name="description" className="input-field" rows="4" onChange={handleChange} required></textarea>
                    </div>

                    <div>
                        <label style={{ color: 'var(--text-muted)' }}>Tags (comma separated)</label>
                        <input name="tags" className="input-field" placeholder="e.g. important, midterms, algorithms" onChange={handleChange} />
                    </div>

                    <div style={{ border: '2px dashed rgba(255,255,255,0.2)', padding: '2rem', textAlign: 'center', borderRadius: '12px' }}>
                        <input type="file" onChange={handleFile} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" required style={{ width: '100%' }} />
                    </div>

                    <button type="submit" className="btn" disabled={loading} style={{ justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}>
                        {loading ? 'Uploading...' : 'Publish Material'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;
