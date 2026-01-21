import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

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
                        <div className="dashboard_actions">
                            <Link to="/admin/orders" className="dashboard_link">
                                Manage Pending Orders <HiOutlineArrowNarrowRight />
                            </Link>
                            <Link to="/admin/reservations" className="dashboard_link">
                                Manage Reservations <HiOutlineArrowNarrowRight />
                            </Link>
                            <Link to="/order-history" className="dashboard_link">
                                View All Orders <HiOutlineArrowNarrowRight />
                            </Link>
                            <Link to="/admin/reservation-history" className="dashboard_link">
                                Reservation History <HiOutlineArrowNarrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
