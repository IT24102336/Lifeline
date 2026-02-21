import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LabTestModal from './LabTestModal';
import { useAuth } from '../context/AuthContext';

const InventoryDashboard = () => {
    const { isDoctor, user } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [selectedBag, setSelectedBag] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInventory = () => {
        setLoading(true);
        axios.get('http://localhost:8080/api/inventory')
            .then(res => {
                setInventory(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching inventory", err);
                setLoading(false);
                // Mock data for presentation if server fails
                setInventory([
                    { id: 1, bloodType: 'A+', expiryDate: '2026-04-12', status: 'AVAILABLE', safetyFlag: 'SAFE' },
                    { id: 2, bloodType: 'O-', expiryDate: '2026-04-10', status: 'UNTESTED', safetyFlag: null },
                    { id: 3, bloodType: 'AB+', expiryDate: '2026-04-15', status: 'DISCARD', safetyFlag: 'BIO-HAZARD' },
                ]);
            });
    };

    