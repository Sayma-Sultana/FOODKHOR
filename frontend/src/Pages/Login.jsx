import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success(result.message);
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <section className="auth">
                <div className="container">
                    <div className="banner">
                        <img src="/pancake.png" alt="login" />
                    </div>
                    <div className="banner">
                        <div className="auth_form_box">
                            <h1>LOGIN</h1>
                            <p>Welcome back! Please login to your account.</p>
                            <form onSubmit={handleLogin}>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit">
                                    LOGIN{" "}
                                    <span>
                                        <HiOutlineArrowNarrowRight />
                                    </span>
                                </button>
                                <p className="auth_link">
                                    Don't have an account?{' '}
                                    <Link to="/signup">Sign Up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Login;
