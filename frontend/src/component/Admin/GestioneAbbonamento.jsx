import React, { useState, useEffect } from 'react';

const GestioneAbbonamento = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        redirectToStripePortal();
    }, []);

    const redirectToStripePortal = async () => {
        try {
            const response = await fetch('/api/v1/create-portal-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Errore durante la redirezione al portale Stripe');
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            setError(err.message || 'Si è verificato un errore. Riprova più tardi.');
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minHeight: '60vh',
        textAlign: 'center'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <h2>Reindirizzamento al portale Stripe...</h2>
                <p>Attendere prego...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <h2>Errore</h2>
                <p style={{ color: '#dc3545', marginTop: '1rem' }}>{error}</p>
                <button
                    onClick={redirectToStripePortal}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Riprova
                </button>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2>Reindirizzamento in corso...</h2>
        </div>
    );
};

export default GestioneAbbonamento;
