// File: js/app/component/card.js

import { util } from '../../common/util.js';
import { storage } from '../../common/storage.js';

export const card = (() => {
    let owns = null;

const renderAction = (c) => {
    // Mengembalikan div kosong agar tidak ada tombol yang ditampilkan
    return `<div></div>`; 
};
    
    const renderButton = (c) => {
        // [PERBAIKAN] Gunakan c.id
        return `<div class="d-flex justify-content-between align-items-center mt-2" id="button-${c.id}">${renderAction(c)}</div>`;
    };

    const renderTitle = (c) => {
        return `<strong class="me-1">${util.escapeHtml(c.name)}</strong><i class="ms-1 fa-solid ${c.presence ? 'fa-circle-check text-success' : 'fa-circle-xmark text-danger'}"></i>`;
    };

    // [SEMPURNAKAN] Fungsi format tanggal agar membaca timestamp dari Firestore
    const formatFirestoreTimestamp = (timestamp) => {
        if (!timestamp || !timestamp._seconds) return '';
        // Konversi detik dari Firestore ke milidetik untuk JavaScript
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderBody = (c) => {
        return `
        <div class="d-flex justify-content-between align-items-center">
            <p class="text-theme-auto text-truncate m-0 p-0" style="font-size: 0.95rem;">${renderTitle(c)}</p>
            <small class="text-theme-auto m-0 p-0" style="font-size: 0.75rem;">${formatFirestoreTimestamp(c.createdAt)}</small>
        </div>
        <hr class="my-1">
        <p class="text-theme-auto my-1 mx-0 p-0" style="white-space: pre-wrap !important; font-size: 0.95rem;">${util.escapeHtml(c.comment)}</p>`;
    };

    const renderContent = (c) => {
        const headerClass = "bg-theme-auto shadow p-3 mx-0 mt-0 mb-3 rounded-4";
        // [PERBAIKAN] Gunakan c.id
        return `<div class="${headerClass}" id="${c.id}" style="overflow-wrap: break-word !important;">${renderBody(c)}${renderButton(c)}</div>`;
    };

    const init = () => {
        owns = storage('owns');
    };

    return {
        init,
        renderContent,
    };
})();