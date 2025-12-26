// File: js/common/session.js

import { storage } from './storage.js';

export const session = (() => {
    let ses = null;

    const init = () => {
        ses = storage('session'); // Inisialisasi storage agar tidak null
    };

    // Fungsi ini akan selalu mengembalikan false karena tidak ada admin
    const isAdmin = () => false; 
    
    // Fungsi ini akan selalu mengembalikan null karena tidak ada token
    const getToken = () => null;

    return {
        init,
        isAdmin,
        getToken,
    };
})();