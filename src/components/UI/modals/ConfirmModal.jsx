import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const confirmModal = (message, title = 'Confirm', options = {}) => {
    return new Promise(resolve => {
        // Simple mock that always returns true for this demo
        resolve(true);
    });
};

export default confirmModal;
