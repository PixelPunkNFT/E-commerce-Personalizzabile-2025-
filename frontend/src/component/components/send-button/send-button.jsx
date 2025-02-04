import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './send-button.module.css';
import { getWhatsAppNumber } from '../../../actions/whatsAppAction';

const defaultProps = {
    sendButtonText: 'Send',
    inputPlaceHolder: 'Type a message',
};

const SendButton = ({
    inputPlaceHolder = defaultProps.inputPlaceHolder,
    sendButtonText = defaultProps.sendButtonText,
}) => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const { whatsApp } = useSelector((state) => state.whatsApp);
    const phoneNumber = whatsApp?.phoneNumber ;

    useEffect(() => {
        dispatch(getWhatsAppNumber());
    }, [dispatch]);

    const handleClick = () => {
        if (!phoneNumber) {
            window.alert('Numero di telefono Invalido');
            return false;
        }
        window.open(`https://wa.me/${phoneNumber}?text=${message}`);
        setMessage('');
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    return (
        <div className={styles.root}>
            <input
                placeholder={inputPlaceHolder}
                className={styles.input}
                onChange={handleChange}
                value={message}
            />
            <button className={styles.button} onClick={handleClick}>
                {sendButtonText}
            </button>
        </div>
    );
};

export default SendButton;
