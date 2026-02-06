import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        hospitalId: '1',
        date: '',
        time: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Combine date and time for backend
        const isoDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

        try {
            await axios.post('http://localhost:8080/api/appointments/book', {
                donorId: user?.id || 1,
                donorUserId: user?.id || 1,
                donorName: user?.name || 'Unknown User',
                hospitalId: parseInt(formData.hospitalId),
                date: isoDateTime
            });
            alert('Appointment Scheduled Successfully!');
            navigate('/donors');
        } catch (error) {
            console.error(error);
            alert('Failed to book appointment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Schedule Donation</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Select Center</label>
                        <select
                            className="input-field"
                            value={formData.hospitalId}
                            onChange={e => setFormData({ ...formData, hospitalId: e.target.value })}
                        >
                            <option value="1">Colombo National Hospital</option>
                            <option value="2">Kandy General Hospital</option>
                            <option value="3">Galle Teaching Hospital</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label">Date</label>
                            <input
                                type="date"
                                className="input-field"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Time</label>
                            <input
                                type="time"
                                className="input-field"
                                required
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            className="btn"
                            style={{ flex: 1, border: '1px solid #E2E8F0' }}
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={submitting}
                        >
                            {submitting ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
