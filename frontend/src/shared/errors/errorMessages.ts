export function getLocalizedErrorMessage(error: Error | null, t) {
    if (!error) return t('errors.default');

    const message = error.message;
    const errorMap = {
        USER_NOT_FOUND: t('errors.userNotFound'),
        NETWORK_ERROR: t('errors.networkError'),
        "NetworkError when attempting to fetch resource.": t('errors.networkError')
    };

    if (errorMap[message]) {
        return errorMap[message];
    }

    // fallback by matching raw message
    if (message) {
        if (message.includes('User not found')) return t('errors.userNotFound');
        if (message.includes('Network Error')) return t('errors.networkError');
    }

    return t('errors.default');
}
