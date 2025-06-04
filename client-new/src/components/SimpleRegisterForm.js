import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';  // 🔥 Add this to handle redirects

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { error, status } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const action = await dispatch(registerUser(formData));
            if (registerUser.fulfilled.match(action)) {
                // Registration was successful 🎉
                alert('Registration successful! Please log in.');
                navigate('/login');  // Redirect to login
            } else {
                // Registration failed 🚨
                console.error(action.payload || 'Registration failed');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
            <button type="submit">Register</button>
            {status === 'failed' && <p style={{ color: 'red' }}>{error || 'Registration failed. Please try again.'}</p>}
        </form>
    );
};

export default RegisterForm;
