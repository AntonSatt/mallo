let authExpiredListener = null;

export const registerAuthListener = (listener) => {
    authExpiredListener = listener;
};

export const notifyAuthExpired = () => {
    if (typeof authExpiredListener === 'function') {
        authExpiredListener();
    }
};