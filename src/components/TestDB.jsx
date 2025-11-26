import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const TestDB = () => {
    const [status, setStatus] = useState('Idle');
    const [error, setError] = useState('');

    const testConnection = async () => {
        setStatus('Testing...');
        setError('');
        try {
            const docRef = await addDoc(collection(db, "test_collection"), {
                message: "Hello Firebase!",
                timestamp: new Date()
            });
            setStatus(`Success! Written to ID: ${docRef.id}`);
        } catch (e) {
            console.error("Test DB Error:", e);
            setStatus('Failed');
            setError(e.message);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] bg-white p-4 rounded-xl shadow-2xl border-2 border-brand-blue">
            <h3 className="font-bold mb-2">Database Connection Test</h3>
            <div className="mb-2 text-sm">
                Status: <span className={status.includes('Success') ? 'text-green-600 font-bold' : 'text-red-600'}>{status}</span>
            </div>
            {error && <div className="text-xs text-red-500 mb-2 max-w-[200px] break-words">{error}</div>}
            <button
                onClick={testConnection}
                className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
            >
                Write Test Document
            </button>
        </div>
    );
};
