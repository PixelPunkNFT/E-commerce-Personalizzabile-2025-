import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Subscription() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            try {
                // Verifica se siamo appena tornati dal pagamento
                const urlParams = new URLSearchParams(window.location.search);
                const success = urlParams.get('success');
                const canceled = urlParams.get('canceled');

                if (success === 'true') {
                    setHasActiveSubscription(true);
                    window.history.replaceState({}, '', window.location.pathname);
                    history.push('/admin/dashboard');
                    return;
                }

                if (canceled === 'true') {
                    setError('Pagamento annullato. Riprova.');
                    window.history.replaceState({}, '', window.location.pathname);
                    setCheckingStatus(false);
                    return;
                }

                const response = await fetch('/api/v1/check-subscription', {
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setHasActiveSubscription(true);
                    history.push('/admin/dashboard');
                }
            } catch (error) {
                console.error('Errore:', error);
                if (error.response?.status === 403 || error.response?.status === 402) {
                    setError(error.response.data.error || 'Abbonamento non valido');
                } else {
                    setError('Errore durante la verifica dello stato dell\'abbonamento. Riprova più tardi.');
                }
            } finally {
                setCheckingStatus(false);
            }
        };

        checkSubscriptionStatus();
    }, [history]);

    // Pulisci i parametri dell'URL quando il componente viene smontato
    useEffect(() => {
        return () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('success') || urlParams.has('canceled')) {
                window.history.replaceState({}, '', window.location.pathname);
            }
        };
    }, []);
    
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        fontFamily: '"Archivo", sans-serif',
        fontWeight: '800',
        fontSize: '1rem',
        padding: '0 2rem'
    };

    const buttonStyle = {
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        outline: 'none',
        transition: 'background-color 0.3s ease'
    };

    const handlePayment = async () => {
        setLoading(true);
        setError(null);
        try {
            // Verifica se esiste già un abbonamento attivo
            const checkResponse = await fetch('/api/v1/check-subscription', {
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (checkResponse.ok) {
                history.push('/admin/dashboard');
                return;
            }

            // Se non c'è un abbonamento attivo, procedi con il checkout
            const response = await fetch('/api/v1/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('URL di checkout non valido');
            }
        } catch (error) {
            console.error('Errore durante la richiesta:', error);
            setError(
                error.response?.data?.error || 
                error.message || 
                'Errore durante la richiesta. Riprova più tardi.'
            );
        } finally {
            setLoading(false);
        }
    };

    const errorStyle = {
        color: '#dc3545',
        marginTop: '1rem',
        fontSize: '0.9rem'
    };

    const loadingStyle = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
        cursor: 'not-allowed'
    };

    if (checkingStatus) {
        return (
            <div style={containerStyle}>
                <div style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
                    <div className="loader" style={{
                        width: '48px',
                        height: '48px',
                        border: '5px solid #FFF',
                        borderBottomColor: '#007BFF',
                        borderRadius: '50%',
                        display: 'inline-block',
                        boxSizing: 'border-box',
                        animation: 'rotation 1s linear infinite',
                        margin: '20px auto'
                    }}></div>
                    <style>
                        {`
                            @keyframes rotation {
                                0% { transform: rotate(0deg) }
                                100% { transform: rotate(360deg) }
                            }
                        `}
                    </style>
                    <div>Verifica stato abbonamento...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#dc3545' }}>
                {hasActiveSubscription ? 'Reindirizzamento alla dashboard...' : 'Abbonamento Scaduto'}
            </div>
            {!hasActiveSubscription && (
                <>
                    <div style={{ maxWidth: '800px', lineHeight: '1.6' }}>
                        Per continuare ad usare l'applicazione web è necessario aggiornare l'abbonamento con uno valido così si potrà accedere a tutte le funzionalità dell'App.<br></br> 
                        <strong>Nota bene:</strong> se tu, proprietario del sito, non sarai regolare con i pagamenti, per te il sito resta inaccessibile mentre i tuoi clienti continueranno a utilizzare il tuo negozio online, continuando a fare acquisti che tu non potrai gestire sino a quando non avrai un abbonamento attivo.
                    </div>
                    <button 
                        style={loading ? loadingStyle : buttonStyle} 
                        onClick={handlePayment}
                        disabled={loading}
                        onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
                        onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#007BFF')}
                    >
                        {loading ? 'Caricamento...' : 'Paga Abbonamento'}
                    </button>
                    {error && <div style={errorStyle}>{error}</div>}
                </>
            )}
        </div>
    );
}

export default Subscription;
