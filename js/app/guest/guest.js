// File: js/app/guest/guest.js

import { image } from './image.js';
import { audio } from './audio.js';
import { util } from '../../common/util.js';
import { bs } from '../../libs/bootstrap.js';
import { theme } from '../../common/theme.js';
import { storage } from '../../common/storage.js';
import { basicAnimation, openAnimation } from '../../libs/confetti.js';
import { comment } from '../component/comment.js';
import { session } from '../../common/session.js';
import { progress } from './progress.js';

export const guest = (() => {

    const setupEventListeners = () => {
        document.getElementById('open-invitation-btn')?.addEventListener('click', function() {
            this.disabled = true;
            document.body.scrollIntoView({ behavior: 'instant' });
            audio.init();
            basicAnimation();
            opacity('welcome');
            util.timeOut(openAnimation, 1500);
        });

        document.getElementById('send-comment-btn')?.addEventListener('click', function() {
            comment.send(this);
        });

        document.getElementById('comments')?.addEventListener('click', function(e) {
            const targetButton = e.target.closest('[data-action="remove"]');
            if (targetButton) {
                const uuid = targetButton.getAttribute('data-uuid');
                if (uuid) {
                    comment.remove(uuid);
                }
            }
        });

        // [BARU] Listener untuk menangani klik pada tombol paginasi
        document.getElementById('pagination')?.addEventListener('click', function(e) {
            e.preventDefault(); // Mencegah halaman refresh
            const target = e.target.closest('a.page-link');
            if (target) {
                const page = parseInt(target.getAttribute('data-page'), 10);
                if (!isNaN(page)) {
                    comment.changePage(page);
                }
            }
        });
    };

    const showGuestName = () => {
        const raw = window.location.search.split('to=');
        if (raw.length > 1 && raw[1].length >= 1) {
            const name = decodeURIComponent(raw[1].split('&')[0]);
            const guestNameEl = document.getElementById('guest-name');
            if (guestNameEl) {
                const div = document.createElement('div');
                div.classList.add('m-2');
                div.innerHTML = `<small class="mt-0 mb-1 mx-0 p-0">${guestNameEl.getAttribute('data-message')}</small><p class="m-0 p-0" style="font-size: 1.3rem">${util.escapeHtml(name)}</p>`;
                guestNameEl.innerHTML = '';
                guestNameEl.appendChild(div);
            }
        }
    };

    const countDownDate = () => {
        const el = document.getElementById('count-down');
        const until = el?.getAttribute('data-time')?.replace(' ', 'T');
        if (!until) return;

        const count = new Date(until).getTime();
        setInterval(() => {
            const distance = Math.abs(count - Date.now());
            document.getElementById('day').innerText = Math.floor(distance / 864e5).toString();
            document.getElementById('hour').innerText = Math.floor((distance % 864e5) / 36e5).toString();
            document.getElementById('minute').innerText = Math.floor((distance % 36e5) / 6e4).toString();
            document.getElementById('second').innerText = Math.floor((distance % 6e4) / 1e3).toString();
        }, 1000);
    };

    const opacity = (id, speed = 0.025) => {
        const el = document.getElementById(id);
        if (!el) return;
        let op = 1;
        const timer = setInterval(() => {
            if (op <= 0.01) {
                clearInterval(timer);
                el.style.display = 'none';
            }
            el.style.opacity = op;
            op -= op * 0.1 + speed;
        }, 10);
    };
    
    const domLoaded = () => {
        theme.init();
        session.init();
        comment.init();
        progress.init();
        image.init().load();
        
        showGuestName();
        countDownDate();
        
        document.getElementById('root').style.opacity = '1';
        window.AOS.init();
        opacity('loading');
        
        setupEventListeners();
    };

    const init = () => {
        window.addEventListener('DOMContentLoaded', domLoaded);
    };

    return { init };
})();