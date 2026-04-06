const Material = require('../models/Material');
const User = require('../models/User');

const getMaterials = async (req, res) => {
    try {
        const { search, subject, semester, type, uploader } = req.query;
        let query = {};
        
        if (search) query.title = { $regex: search, $options: 'i' };
        if (subject) query.subject = subject;
        if (semester) query.semester = semester;
        if (type) query.fileType = type;
        if (uploader) query.uploader = uploader;
        
        const materials = await Material.find(query)
            .populate('uploader', 'username email')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 });
            
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadMaterial = async (req, res) => {
    try {
        const { title, description, subject, semester, tags, fileType } = req.body;
        
        let parsedTags = [];
        try {
            parsedTags = tags ? JSON.parse(tags) : [];
        } catch(e) {
            parsedTags = typeof tags === 'string' ? tags.split(',').map(t=>t.trim()) : tags;
        }

        if (!req.file) return res.status(400).json({ message: 'Please upload a file' });
        
        const fileUrl = `/uploads/${req.file.filename}`;
        
        const material = await Material.create({
            title, description, subject, semester, tags: parsedTags,
            fileUrl, fileType: fileType || 'note', uploader: req.user.id
        });
        
        await User.findByIdAndUpdate(req.user.id, { $inc: { uploadsCount: 1 } });
        
        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMaterialById = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id)
            .populate('uploader', 'username')
            .populate('comments.user', 'username');
            
        if (!material) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleLike = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) return res.status(404).json({ message: 'Not found' });
        
        if (material.likes.includes(req.user.id)) {
            material.likes = material.likes.filter(id => id.toString() !== req.user.id.toString());
        } else {
            material.likes.push(req.user.id);
        }
        await material.save();
        res.status(200).json({ likes: material.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const material = await Material.findById(req.params.id);
        if (!material) return res.status(404).json({ message: 'Not found' });
        
        const comment = { user: req.user.id, text };
        material.comments.push(comment);
        await material.save();
        
        const populatedMaterial = await Material.findById(req.params.id).populate('comments.user', 'username');
        res.status(201).json({ comments: populatedMaterial.comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMaterials, uploadMaterial, getMaterialById, toggleLike, addComment };
