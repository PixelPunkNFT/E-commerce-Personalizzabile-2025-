// import React, { useState, useEffect } from 'react';
// import './Payment.css';
// import Confetti from 'react-confetti';
// import Navbar from "../Admin/Navbar";
// import logo from '../../Image/admin/logoAzienda.png';

// const Logo = () => (
//   <img src={logo} alt="Logo" />
// );

// const Container = ({ children }) => (
//   <div className="containers">
//     {children}
//   </div>
// );

// const ProductDisplay = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleCheckout = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('/api/v1/create-checkout-session', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         credentials: 'include'
//       });
      
//       const data = await response.json();
//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//         throw new Error('URL di checkout non valido');
//       }
//     } catch (error) {
//       console.error('Errore durante la richiesta:', error);
//       setError(error.response?.data?.error || 'Errore durante la creazione della sessione');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container>
//       <section className="product-section">
//         <div className="product">
//           <Logo />
//           <div className="description">
//             <h1>Piano Mensile E-commerce</h1>
//             <h3>€20,00 / mese</h3>
//             <p>
//               Aderendo a questo piano mensile, avrai accesso completo al nostro sito web E-commerce. 
//               Potrai gestire tutti gli aspetti del tuo abbonamento dalla dashboard dedicata, 
//               rendendo facile tenere traccia delle tue spese, monitorare le tue transazioni e 
//               gestire le tue preferenze. Il nostro obiettivo è fornire un'esperienza utente 
//               fluida e senza interruzioni, assicurando che tu possa concentrarti sulla gestione 
//               del tuo business online.
//             </p>
//           </div>
//         </div>
//         <form className="checkout-form" onSubmit={handleCheckout}>
//           <button 
//             className="checkout-button" 
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? 'Elaborazione...' : 'Abbonati'}
//           </button>
//           {error && <div className="error-message">{error}</div>}
//         </form>
//       </section>
//     </Container>
//   );
// };

// const SuccessDisplay = ({ sessionId }) => {
//   const [showConfetti, setShowConfetti] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowConfetti(false);
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handlePortalAccess = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('/api/v1/create-portal-session', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify({ session_id: sessionId }),
//         credentials: 'include'
//       });
      
//       const data = await response.json();
      
//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//         throw new Error('URL del portale non valido');
//       }
//     } catch (error) {
//       console.error('Errore durante la richiesta:', error);
//       setError(error.response?.data?.error || 'Errore durante l\'accesso al portale');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <Container>
//         {showConfetti && (
//           <Confetti
//             width={window.innerWidth}
//             height={window.innerHeight}
//           />
//         )}
//         <section className="success-section">
//           <div className="product success-product">
//             <Logo />
//             <div className="description success-description">
//               <h3>Sottoscrizione al piano iniziale riuscita!</h3>
//             </div>
//           </div>
//           <form className="portal-form" onSubmit={handlePortalAccess}>
//             <button 
//               className="portal-button" 
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? 'Accesso in corso...' : 'Gestisci le tue informazioni di fatturazione'}
//             </button>
//             {error && <div className="error-message">{error}</div>}
//           </form>
//         </section>
//       </Container>
//     </div>
//   );
// };

// const Message = ({ message }) => (
//   <section>
//     <p>{message}</p>
//   </section>
// );

// export default function Payment() {
//   const [message, setMessage] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [sessionId, setSessionId] = useState('');

//   useEffect(() => {
//     const query = new URLSearchParams(window.location.search);

//     if (query.get('success')) {
//       setSuccess(true);
//       setSessionId(query.get('session_id'));
//     }

//     if (query.get('canceled')) {
//       setSuccess(false);
//       setMessage('Pagamento annullato. Puoi riprovare quando vuoi.');
//     }

//     // Pulisci i parametri URL
//     return () => {
//       if (window.history.replaceState) {
//         window.history.replaceState({}, '', window.location.pathname);
//       }
//     };
//   }, []);

//   return (
//     <div>
//       {(!success && message === '') && <ProductDisplay />}
//       {success && sessionId !== '' && <SuccessDisplay sessionId={sessionId} />}
//       {message && <Message message={message} />}
//     </div>
//   );
// }
