import React from "react";
import {Link} from "react-router-dom";
import "./Privacy.css";
import MetaData from "../component/layouts/MataData/MataData";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
     <MetaData title={"Informativa sulla Privacy"} />
      <div className="container___">
        <h1>Informativa sulla Privacy del nostro E-commerce</h1>
        
        <p>
          Nel nostro E-commerce, diamo valore alla privacy dei nostri clienti e siamo impegnati a proteggere le vostre informazioni personali. Questa Informativa sulla Privacy spiega come raccogliamo, utilizziamo, divulghiamo e salvaguardiamo le vostre informazioni quando utilizzate il nostro sito web e i nostri servizi. Vi preghiamo di leggere attentamente questa Informativa sulla Privacy. Accedendo o utilizzando il nostro sito web e i nostri servizi, riconoscete di aver letto, compreso e accettato di essere vincolati da tutti i termini descritti in questa Informativa sulla Privacy.
        </p>
        <h2>1. Informazioni che Raccogliamo</h2>
        <h3>1.1 Informazioni Personali:</h3>
        <p>
          Possiamo raccogliere informazioni personali che fornite volontariamente quando registrate un account, effettuate un ordine, vi iscrivete alla nostra newsletter, partecipate a concorsi o sondaggi o ci contattate per il supporto. Queste informazioni possono includere il vostro nome, indirizzo email, numero di telefono, indirizzo di spedizione, indirizzo di fatturazione e dettagli di pagamento.
        </p>
        <h3>1.2 Informazioni non Personali:</h3>
        <p>
          Quando interagite con il nostro sito web, possiamo raccogliere informazioni non personali sul vostro dispositivo, azioni di navigazione e modelli di utilizzo. Queste informazioni possono includere il vostro indirizzo IP, tipo di browser, sistema operativo, URL di riferimento e interazioni con il nostro sito web.
        </p>
        <h2>2. Utilizzo delle Informazioni</h2>
        <h3>2.1 Informazioni Personali:</h3>
        <p>Possiamo utilizzare le informazioni personali che raccogliamo per:</p>
        <ul>
          <li>Elaborare e completare i vostri ordini</li>
          <li>Fornire supporto clienti e rispondere alle richieste</li>
          <li>
            Inviare offerte promozionali, newsletter e comunicazioni di marketing (potete annullare l'iscrizione in qualsiasi momento)
          </li>
          <li>Migliorare il nostro sito web, prodotti e servizi</li>
          <li>Personalizzare la vostra esperienza sul nostro sito web</li>
          <li>
            Prevenire attività fraudolente ed assicurare la sicurezza della nostra piattaforma
          </li>
        </ul>
        <h3>2.2 Informazioni non Personali:</h3>
        <p>
          Possiamo utilizzare le informazioni non personali per vari scopi, tra cui:
        </p>
        <ul>
          <li>Analizzare le tendenze e il comportamento degli utenti</li>
          <li>Monitorare e migliorare la funzionalità del nostro sito web</li>
          <li>Personalizzare contenuti e pubblicità</li>
          <li>Generare dati statistici aggregati</li>
        </ul>
        <h2>3. Divulgazione delle Informazioni</h2>
        <p>
          Possiamo divulgare le vostre informazioni a terze parti nelle seguenti circostanze:
        </p>
        <ul>
          <li>
            Ai nostri fornitori di servizi fidati che ci aiutano a gestire il nostro business e a fornire servizi a voi
          </li>
          <li>
            Per ottemperare a obblighi legali, far rispettare le nostre politiche o rispondere a richieste legali
          </li>
          <li>
            In caso di fusione, acquisizione o vendita di tutto o parte dei nostri asset aziendali
          </li>
          <li>Con il vostro consenso o sotto la vostra direzione</li>
        </ul>
        <h2>4. Sicurezza</h2>
        <p>
          Adottiamo misure ragionevoli per proteggere le vostre informazioni dall'accesso non autorizzato, divulgazione, alterazione o distruzione. Tuttavia, notate che nessun metodo di trasmissione su internet o archiviazione elettronica è completamente sicuro e non possiamo garantire una sicurezza assoluta.
        </p>
        <h2>5. Privacy dei Minori</h2>
        <p>
          Il nostro sito web e i nostri servizi non sono destinati a minori di 13 anni. Non raccogliamo consapevolmente informazioni personali da minori. Se veniamo a conoscenza di aver raccolto informazioni personali da un minore senza il consenso dei genitori, prenderemo provvedimenti per rimuovere tali informazioni dai nostri server.
        </p>
        <h2>6. Modifiche a questa Privacy Policy</h2>
        <p>
          Potremmo aggiornare la nostra Privacy Policy periodicamente. Eventuali modifiche saranno pubblicate su questa pagina, e la Privacy Policy revisionata entrerà in vigore immediatamente dopo la pubblicazione. Vi incoraggiamo a rivedere periodicamente questa Privacy Policy per eventuali aggiornamenti o modifiche.
        </p>
        <h2>7. Contattaci</h2>
        <p>
          Se avete domande, preoccupazioni o suggerimenti riguardo a questa Informativa sulla Privacy, contattateci all'indirizzo{" "}
          <Link to="/" style={{ textDecoration : "none" , color : "inherit" , fontWeight : 700}}>
            [inserire le informazioni di contatto]
          </Link>
        </p>
        <p>
          Utilizzando il sito web e i servizi del nostro E-commerce, accettate la raccolta, l'utilizzo e la divulgazione delle vostre informazioni come descritto in questa Informativa sulla Privacy.
        </p>
      </div>
    </div>

  );
};

export default PrivacyPolicy;
