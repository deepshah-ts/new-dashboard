import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

// Mock auth for demo
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'admin@tiffinstash.com') {
        // In a real app, verify password with bcrypt
        // For the demo hint "Use any password", we'll just accept 'admin' or anything
        const user = {
            id: '1',
            email: 'admin@tiffinstash.com',
            name: 'System Admin',
            role: 'ADMIN'
        };

        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });

        return res.json({
            token,
            user
        });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
