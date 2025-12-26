export const theme = (() => {

    /**
     * @type {HTMLElement|null}
     */
    let metaTheme = null;

    /**
     * Terapkan tema terang secara eksplisit
     * @returns {void}
     */
    const applyLightTheme = () => {
        document.documentElement.setAttribute('data-bs-theme', 'light');

        if (metaTheme) {
            metaTheme.setAttribute('content', '#ffffff'); // putih sebagai warna tema
        }
    };

    /**
     * Terapkan tema terang dan matikan logika lainnya
     * @returns {void}
     */
    const init = () => {
        metaTheme = document.querySelector('meta[name="theme-color"]');
        applyLightTheme();
    };

    /**
     * Dummy function agar tidak error jika dipanggil dari luar
     */
    const noop = () => {};

    return {
        init,
        spyTop: noop,
        change: noop,
        isDarkMode: () => false,
        isAutoMode: () => false,
    };
})();
