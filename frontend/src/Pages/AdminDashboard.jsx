import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <section className="adminDashboard">
                <div className="container">
                    <h1 className="heading">ADMIN DASHBOARD</h1>
                    <div className="dashboard_content">
                        <div className="welcome_box">
                            <h2>Welcome, {user.firstName} {user.lastName}!</h2>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                        </div>
                        <div className="dashboard_info">
                            <p>Admin dashboard features coming soon...</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
