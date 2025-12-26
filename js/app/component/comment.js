// File: js/app/component/comment.js

import { card } from './card.js';
import { util } from '../../common/util.js';
import { storage } from '../../common/storage.js';

export const comment = (() => {
    const API_URL = 'https://theapi-t7c7cmarha-et.a.run.app';

    // --- State untuk Paginasi ---
    let owns = null;
    let commentsCache = [];
    let currentPage = 1;
    const commentsPerPage = 5;

    const onNullComment = () => {
        return `<div class="text-center p-4 my-2 bg-theme-auto rounded-4 shadow"><p class="fw-bold p-0 m-0" style="font-size: 0.95rem;">Jadilah yang pertama memberikan ucapan untuk kedua mempelai!</p></div>`;
    };

    const scroll = () => {
        document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
    };

    const renderPagination = () => {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        const totalPages = Math.ceil(commentsCache.length / commentsPerPage);
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            paginationContainer.classList.add('d-none');
            return;
        }
        paginationContainer.classList.remove('d-none');
        let paginationHTML = '<ul class="pagination pagination-sm justify-content-center">';
        paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a></li>`;
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a></li>`;
        paginationHTML += '</ul>';
        paginationContainer.innerHTML = paginationHTML;
    };
    
    const render = () => {
        const container = document.getElementById('comments');
        if (!container) return;
        if (commentsCache.length === 0) {
            container.innerHTML = onNullComment();
        } else {
            const startIndex = (currentPage - 1) * commentsPerPage;
            const endIndex = startIndex + commentsPerPage;
            const paginatedComments = commentsCache.slice(startIndex, endIndex);
            container.innerHTML = paginatedComments.map(c => card.renderContent(c)).join('');
        }
        renderPagination();
    };
    
    const show = async () => {
        try {
            const response = await fetch(`${API_URL}/comments`);
            if (!response.ok) throw new Error('Gagal memuat komentar.');
            const fetchedComments = await response.json();
            // [PERBAIKAN UTAMA] Balik urutan array agar komentar terlama muncul di halaman pertama
            commentsCache = fetchedComments.reverse();
            currentPage = 1;
            render();
        } catch (error) {
            console.error("Gagal saat mengambil komentar:", error);
            document.getElementById('comments').innerHTML = `<div class="text-center text-danger p-3">${error.message}</div>`;
        }
    };
    
    const send = async (button) => {
        // ... (Fungsi send Anda sudah benar, tidak perlu diubah) ...
        const nameInput = document.getElementById('form-name');
        const presenceInput = document.getElementById('form-presence');
        const commentInput = document.getElementById('form-comment');
        const commentData = {
            name: nameInput.value.trim(),
            presence: presenceInput.value === '1',
            comment: commentInput.value.trim(),
        };
        if (!commentData.name || !commentData.comment) return alert('Nama dan komentar tidak boleh kosong.');
        if (presenceInput.value === '0') return alert('Silakan pilih status kehadiran Anda.');
        
        const btn = util.disableButton(button);
        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData),
            });
            if (!response.ok) throw new Error('Gagal mengirim komentar.');
            const newComment = await response.json();
            owns.set(newComment.id, true);
            nameInput.value = '';
            presenceInput.value = '0';
            commentInput.value = '';
            await show();
            scroll();
        } catch (error) {
            console.error("Gagal saat mengirim komentar:", error);
            alert(error.message);
        } finally {
            btn.restore();
        }
    };
    
    const remove = async (uuid) => {
        if (!confirm('Anda yakin ingin menghapus ucapan ini?')) return;
        try {
            const response = await fetch(`${API_URL}/comments/${uuid}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Gagal menghapus komentar.');
            owns.unset(uuid);
            await show();
        } catch (error) {
            console.error("Gagal saat menghapus komentar:", error);
            alert(error.message);
        }
    };

    const changePage = (page) => {
        const totalPages = Math.ceil(commentsCache.length / commentsPerPage);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        render();
        scroll();
    };

    const init = () => {
        card.init();
        owns = storage('owns');
        show();
    };

    return { init, send, remove, changePage };
})();