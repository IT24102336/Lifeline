import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CampMap = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCamp, setNewCamp] = useState({ name: '', location: '', date: '', time: '' });
    const [selectedCamp, setSelectedCamp] = useState(null);
    const [interestSubmitting, setInterestSubmitting] = useState(false);

    const fetchCamps = () => {
        setLoading(true);
        axios.get('http://localhost:8080/api/camps')
            .then(res => {
                setCamps(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching camps", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCamps();
    }, []);

    const handleCreateCamp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/camps/create', newCamp);
            setShowModal(false);
            setNewCamp({ name: '', location: '', date: '' });
            fetchCamps();
            alert('Camp Created Successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create camp');
        }
    };

    const handleInterest = async (campId) => {
        if (interestSubmitting) return;
        setInterestSubmitting(true);
        try {
            const res = await axios.post(`http://localhost:8080/api/camps/${campId}/interest`);
            setCamps(prev => prev.map(c => (c.id === campId ? res.data : c)));
            if (selectedCamp && selectedCamp.id === campId) {
                setSelectedCamp(res.data);
            }
        } catch (error) {
            console.error(error);
            alert('Unable to register interest.');
        } finally {
            setInterestSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Donation Camps</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Find a donation event near you</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {isAdmin && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            + Add New Camp
                        </button>
                    )}
                    <button className="btn" style={{ border: '1px solid #E2E8F0' }} onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {camps.map(camp => (
                    <div key={camp.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '8px', width: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)' }}></div>
                        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>{camp.name}</h3>
                                <div style={{
                                    padding: '0.25rem 0.75rem',
                                    background: '#F1F5F9',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: 'var(--secondary)'
                                }}>
                                    UPCOMING
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                                <span>📍</span>
                                <span>{camp.location}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                                <span>📅</span>
                                <span>{new Date(camp.date).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                                <span>⏰</span>
                                <span>{camp.time || 'TBD'}</span>
                            </div>

                            {isAdmin && (
                                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--secondary)' }}>
                                    Interested: {camp.interestCount || 0}
                                </div>
                            )}

                            <div style={{ marginTop: 'auto' }}>
                                <button className="btn" style={{
                                    width: '100%',
                                    background: '#FFF1F2',
                                    color: 'var(--primary)',
                                    fontWeight: '600'
                                }} onClick={() => setSelectedCamp(camp)}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {camps.length === 0 && !loading && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No camps found at the moment.
                    </div>
                )}
            </div>

            {/* Admin Add Camp Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ background: 'white', padding: '2rem', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Add New Donation Camp</h2>
                        <form onSubmit={handleCreateCamp}>
                            <div className="input-group">
                                <label className="input-label">Camp Name</label>
                                <input
                                    className="input-field"
                                    required
                                    value={newCamp.name}
                                    onChange={e => setNewCamp({ ...newCamp, name: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Location</label>
                                <input
                                    className="input-field"
                                    required
                                    value={newCamp.location}
                                    onChange={e => setNewCamp({ ...newCamp, location: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    required
                                    value={newCamp.date}
                                    onChange={e => setNewCamp({ ...newCamp, date: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Time</label>
                                <input
                                    type="time"
                                    className="input-field"
                                    required
                                    value={newCamp.time}
                                    onChange={e => setNewCamp({ ...newCamp, time: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid #E2E8F0' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Camp</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedCamp && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ background: 'white', padding: '2rem', width: '100%', maxWidth: '520px' }}>
                        <h2 style={{ marginBottom: '1rem' }}>{selectedCamp.name}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                            <div>📍 {selectedCamp.location}</div>
                            <div>📅 {new Date(selectedCamp.date).toLocaleDateString()}</div>
                            <div>⏰ {selectedCamp.time || 'TBD'}</div>
                            <a
                                href={
                                    selectedCamp.lat && selectedCamp.lng
                                        ? `https://www.google.com/maps?q=${selectedCamp.lat},${selectedCamp.lng}`
                                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCamp.location)}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}
                            >
                                Open in Google Maps
                            </a>
                            {isAdmin && (
                                <div style={{ fontSize: '0.875rem' }}>Interested: {selectedCamp.interestCount || 0}</div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" className="btn" onClick={() => setSelectedCamp(null)} style={{ flex: 1, border: '1px solid #E2E8F0' }}>
                                Close
                            </button>
                            {!isAdmin && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                    onClick={() => handleInterest(selectedCamp.id)}
                                    disabled={interestSubmitting}
                                >
                                    {interestSubmitting ? 'Submitting...' : "I'm Interested"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampMap;
