import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminReservations = () => {
    const { user, loading: authLoading } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchPendingReservations();
        }
    }, [user]);

    const fetchPendingReservations = async () => {
        try {
            const { data } = await axios.get(
                `\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/reservation/admin/pending`,
                { withCredentials: true }
            );
            setReservations(data.reservations);
        } catch (error) {
            toast.error('Failed to fetch reservations');
        } finally {
            setLoading(false);
        }
    };

    const updateReservationStatus = async (reservationId, status) => {
        try {
            const { data } = await axios.put(
                `\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/reservation/admin/update-status/${reservationId}`,
                { status },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            toast.success(data.message);
            fetchPendingReservations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update reservation status');
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
            <section className="adminReservations">
                <div className="container">
                    <h1 className="heading">PENDING RESERVATIONS</h1>
                    {loading ? (
                        <p>Loading reservations...</p>
                    ) : reservations.length === 0 ? (
                        <div className="no_reservations">
                            <p>No pending reservations</p>
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
                                        </div>
                                    </div>
                                    <div className="reservation_actions">
                                        <button
                                            className="status_btn confirmed"
                                            onClick={() => updateReservationStatus(reservation._id, 'confirmed')}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className="status_btn cancelled"
                                            onClick={() => updateReservationStatus(reservation._id, 'cancelled')}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="status_btn completed"
                                            onClick={() => updateReservationStatus(reservation._id, 'completed')}
                                        >
                                            Complete
                                        </button>
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

export default AdminReservations;
