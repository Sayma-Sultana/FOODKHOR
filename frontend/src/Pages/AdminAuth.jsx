import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const AdminAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            const result = await login(email, password, 'admin');
            if (result.success) {
                toast.success(result.message);
                navigate('/admin/dashboard');
            } else {
                toast.error(result.message);
            }
        } else {
            const result = await register({
                firstName,
                lastName,
                email,
                phone,
                password,
                role: 'admin',
            });
            if (result.success) {
                toast.success(result.message);
                navigate('/admin/dashboard');
            } else {
                toast.error(result.message);
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <section className="auth">
                <div className="container">
                    <div className="banner">
                        <img src="/pancake.png" alt="admin" />
                    </div>
                    <div className="banner">
                        <div className="auth_form_box">
                            <h1>{isLogin ? 'ADMIN LOGIN' : 'ADMIN REGISTER'}</h1>
                            <p>{isLogin ? 'Admin access only. Please login.' : 'Register as admin.'}</p>
                            <form onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required={!isLogin}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required={!isLogin}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required={!isLogin}
                                            />
                                        </div>
                                    </>
                                )}
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
                                    {isLogin ? 'LOGIN' : 'REGISTER'}{' '}
                                    <span>
                                        <HiOutlineArrowNarrowRight />
                                    </span>
                                </button>
                                <p className="auth_link">
                                    {isLogin ? (
                                        <>
                                            Need to register?{' '}
                                            <button
                                                type="button"
                                                onClick={() => setIsLogin(false)}
                                                className="link_button"
                                            >
                                                Register
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?{' '}
                                            <button
                                                type="button"
                                                onClick={() => setIsLogin(true)}
                                                className="link_button"
                                            >
                                                Login
                                            </button>
                                        </>
                                    )}
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

export default AdminAuth;
