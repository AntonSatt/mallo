export const PERMISSION_STATE = {
    GRANTED: "granted",
    DENIED: "denied",
    PROMPT: "prompt"
};

export const PERMISSION_TYPE = {
    GEOLOCATION: "geolocation",
    NOTIFICATIONS: "notifications"
};

const PERMISSION_CHANGED_EVENT = "permission-state-changed";
const permissionsApiSubscriptions = new Map();
const permissionSubscriberCount = new Map();

const normalizePermissionState = (state) => {
    if (state === PERMISSION_STATE.GRANTED || state === PERMISSION_STATE.DENIED) {
        return state;
    }

    return PERMISSION_STATE.PROMPT;
};

const isSupportedPermissionType = (permissionType) =>
    permissionType === PERMISSION_TYPE.GEOLOCATION || permissionType === PERMISSION_TYPE.NOTIFICATIONS;

export const getPermissionStateLabel = (permissionState) =>
    permissionState === PERMISSION_STATE.GRANTED
        ? "Tillåten"
        : permissionState === PERMISSION_STATE.DENIED
            ? "Blockerad"
            : "Fråga";

export const broadcastPermissionState = (permissionType, permissionState) => {
    if (typeof window === "undefined" || !isSupportedPermissionType(permissionType)) {
        return;
    }

    window.dispatchEvent(
        new CustomEvent(PERMISSION_CHANGED_EVENT, {
            detail: {
                permissionType,
                state: normalizePermissionState(permissionState)
            }
        })
    );
};

const queryWithPermissionsApi = async (permissionType) => {
    if (!navigator.permissions?.query) {
        return PERMISSION_STATE.PROMPT;
    }

    try {
        const permissionStatus = await navigator.permissions.query({ name: permissionType });
        return normalizePermissionState(permissionStatus.state);
    } catch {
        return PERMISSION_STATE.PROMPT;
    }
};

export const queryPermissionState = async (permissionType) => {
    if (typeof navigator === "undefined" || !isSupportedPermissionType(permissionType)) {
        return PERMISSION_STATE.PROMPT;
    }

    if (permissionType === PERMISSION_TYPE.NOTIFICATIONS && typeof Notification !== "undefined") {
        return normalizePermissionState(Notification.permission);
    }

    return queryWithPermissionsApi(permissionType);
};

const ensurePermissionWatcher = async (permissionType) => {
    if (
        typeof navigator === "undefined" ||
        !navigator.permissions?.query ||
        !isSupportedPermissionType(permissionType)
    ) {
        return;
    }

    if (permissionsApiSubscriptions.has(permissionType)) {
        return;
    }

    try {
        const permissionStatus = await navigator.permissions.query({ name: permissionType });
        const handleChange = () => {
            broadcastPermissionState(permissionType, permissionStatus.state);
        };

        permissionStatus.onchange = handleChange;

        permissionsApiSubscriptions.set(permissionType, {
            permissionStatus,
            handler: handleChange
        });
    } catch {
        // Ignore unsupported browser edge-cases and rely on manual request flow.
    }
};

const cleanupPermissionWatcherIfUnused = (permissionType) => {
    const hasSubscribers = (permissionSubscriberCount.get(permissionType) || 0) > 0;
    if (hasSubscribers) {
        return;
    }

    const existing = permissionsApiSubscriptions.get(permissionType);
    if (!existing) {
        return;
    }

    existing.permissionStatus.onchange = null;
    permissionsApiSubscriptions.delete(permissionType);
};

const incrementPermissionSubscriberCount = (permissionType) => {
    const currentCount = permissionSubscriberCount.get(permissionType) || 0;
    permissionSubscriberCount.set(permissionType, currentCount + 1);
};

const decrementPermissionSubscriberCount = (permissionType) => {
    const currentCount = permissionSubscriberCount.get(permissionType) || 0;
    permissionSubscriberCount.set(permissionType, Math.max(0, currentCount - 1));
};

export const onPermissionStateChange = (permissionType, handler) => {
    if (typeof window === "undefined" || !isSupportedPermissionType(permissionType)) {
        return () => { };
    }

    const wrapped = (event) => {
        if (event?.detail?.permissionType !== permissionType) {
            return;
        }

        handler(normalizePermissionState(event?.detail?.state));
    };

    incrementPermissionSubscriberCount(permissionType);
    window.addEventListener(PERMISSION_CHANGED_EVENT, wrapped);
    void ensurePermissionWatcher(permissionType);

    return () => {
        window.removeEventListener(PERMISSION_CHANGED_EVENT, wrapped);
        decrementPermissionSubscriberCount(permissionType);
        cleanupPermissionWatcherIfUnused(permissionType);
    };
};

const requestGeolocationPermission = (options = {}) =>
    new Promise((resolve, reject) => {
        if (!navigator?.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                broadcastPermissionState(PERMISSION_TYPE.GEOLOCATION, PERMISSION_STATE.GRANTED);
                resolve({ state: PERMISSION_STATE.GRANTED, position });
            },
            (error) => {
                if (error?.code === 1) {
                    broadcastPermissionState(PERMISSION_TYPE.GEOLOCATION, PERMISSION_STATE.DENIED);
                    resolve({ state: PERMISSION_STATE.DENIED, position: null });
                    return;
                }

                reject(error);
            },
            options
        );
    });

const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined" || !Notification.requestPermission) {
        return { state: PERMISSION_STATE.PROMPT };
    }

    const rawState = await Notification.requestPermission();
    const nextState = normalizePermissionState(rawState);
    broadcastPermissionState(PERMISSION_TYPE.NOTIFICATIONS, nextState);
    return { state: nextState };
};

export const requestPermission = async (permissionType, options = {}) => {
    if (permissionType === PERMISSION_TYPE.GEOLOCATION) {
        const geolocationOptions = options?.geolocationOptions || {};
        return requestGeolocationPermission(geolocationOptions);
    }

    if (permissionType === PERMISSION_TYPE.NOTIFICATIONS) {
        return requestNotificationPermission();
    }

    return { state: PERMISSION_STATE.PROMPT };
};

// Backward-compatible exports for existing geolocation consumers.
export const GEOLOCATION_PERMISSION_STATE = PERMISSION_STATE;

export const queryGeolocationPermissionState = async () =>
    queryPermissionState(PERMISSION_TYPE.GEOLOCATION);

export const broadcastGeolocationPermissionState = (state) =>
    broadcastPermissionState(PERMISSION_TYPE.GEOLOCATION, state);

export const onGeolocationPermissionStateChange = (handler) =>
    onPermissionStateChange(PERMISSION_TYPE.GEOLOCATION, handler);

export const requestGeolocationPosition = async (options = {}) => {
    const result = await requestPermission(PERMISSION_TYPE.GEOLOCATION, {
        geolocationOptions: options
    });

    return result?.position ?? null;
};
