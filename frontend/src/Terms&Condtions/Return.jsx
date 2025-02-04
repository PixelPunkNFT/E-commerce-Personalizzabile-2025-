import React from "react";
import { Link } from "react-router-dom";
import "./Return.css"
import MetaData from "../component/layouts/MataData/MataData";

const ReturnPolicyPage = () => {
  return (
    <div className="container__0">
      <MetaData title="Return Policy" />
      <div className="image-container">
        <h1 className="policy-text">RETURN POLICY</h1>
      </div>
      <div className="content-container">
        <p>
        Grazie per aver acquistato dal nostro Store! Vogliamo assicurarti il ​​tuo
          soddisfazione per ogni acquisto. Se non sei completamente soddisfatto
          con il tuo acquisto, offriamo una politica di restituzione di 30 giorni per la maggior parte
          prodotti e 7 giorni per prodotti selezionati.
        </p>
        <p>
        Per poter beneficiare di un reso, l'articolo deve essere inutilizzato, nel suo originale
          imballaggio e nelle stesse condizioni in cui lo hai ricevuto. Anche tu
          necessario fornire la prova di acquisto. Si prega di notare che alcuni articoli,
          come prodotti personalizzati o realizzati su misura, potrebbero non essere idonei
          reso a meno che non vi sia un difetto o un errore da parte nostra.
        </p>
        <p>
        Se desideri avviare un reso, contatta il nostro Cliente
          Dipartimento di assistenza entro il periodo di restituzione specificato. La nostra squadra lo farà
          guidarti attraverso il processo di reso e fornirti il
          le istruzioni necessarie e l'indirizzo del mittente.
        </p>
        <p>
        Una volta ricevuto l'articolo restituito e verificata la sua condizione, lo faremo
          elaborare il rimborso sul metodo di pagamento originale utilizzato per il
          acquistare. Si prega di attendere fino a [numero di giorni] per il rimborso
          riflesso nel tuo account.
        </p>
        <p>
        Si prega di notare che le spese di spedizione per la restituzione sono a carico di
          cliente, a meno che il reso non sia dovuto a un difetto o errore da parte nostra.
          Ti consigliamo di utilizzare un metodo di spedizione tracciabile per garantire la sicurezza e la sicurezza
          consegna puntuale del tuo reso.
        </p>
        <p>
        Se hai domande o hai bisogno di ulteriore assistenza riguardo al nostro
          politica di restituzione, non esitate a contattare il nostro servizio clienti
          Dipartimento. Siamo qui per aiutare!
        </p>
        <h2>Informazioni sui contatti:</h2>
        <p>
        Dipartimento del servizio clienti
          <br />
          <span style={{ fontWeight: "500" }}>Email </span>: 
          support@Shop.com
          <br />
          <span style={{ fontWeight: "500" }}>Numero  </span>:  123-456-7890
          <br />
      <span style={{ fontWeight: "500" }}>    Orari di apertura: dal lunedì al venerdì, dalle 9:00 alle 17:00  </span>
        </p>
        <p>
        Vi preghiamo di contattarci se avete dubbi o se ne avete bisogno
          chiarimenti riguardanti il ​​ns{" "}
          <Link
            to="/policy/return"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "500",
            }}
          >
            politica di ritorno
          </Link>
          . Ci impegniamo a fornire un eccellente servizio clienti e a garantire il tuo
          soddisfazione.
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
