import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminReservationHistory = () => {
    const { user, loading: authLoading } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchAllReservations();
        }
    }, [user]);

    const fetchAllReservations = async () => {
        try {
            const { data } = await axios.get(
                'http://localhost:4000/api/v1/reservation/admin/all',
                { withCredentials: true }
            );
            setReservations(data.reservations);
        } catch (error) {
            toast.error('Failed to fetch reservations');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'confirmed':
                return 'status_confirmed';
            case 'cancelled':
                return 'status_cancelled';
            case 'completed':
                return 'status_completed';
            default:
                return 'status_pending';
        }
    };

    if (authLoading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <section className="reservationHistory">
                <div className="container">
                    <h1 className="heading">ALL RESERVATIONS</h1>
                    {loading ? (
                        <p>Loading reservations...</p>
                    ) : reservations.length === 0 ? (
                        <div className="no_reservations">
                            <p>No reservations found</p>
                        </div>
                    ) : (
                        <div className="reservations_list">
                            {reservations.map((reservation) => (
                                <div key={reservation._id} className="reservation_card">
                                    <div className="reservation_header">
                                        <div>
                                            <h3>Reservation #{reservation._id.slice(-6).toUpperCase()}</h3>
                                            <p className="reservation_date">
                                                Booked: {new Date(reservation.reservationDate).toLocaleString()}
                                            </p>
                                            <p className="customer_info">
                                                Customer: {reservation.firstName} {reservation.lastName}
                                            </p>
                                            <p className="customer_info">Email: {reservation.email}</p>
                                            <p className="customer_info">Phone: {reservation.phone}</p>
                                        </div>
                                        <div className="reservation_details">
                                            <p className="reservation_time">
                                                Date: {reservation.date}
                                            </p>
                                            <p className="reservation_time">
                                                Time: {reservation.time}
                                            </p>
                                            <span className={`status_badge ${getStatusClass(reservation.status)}`}>
                                                {reservation.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default AdminReservationHistory;
