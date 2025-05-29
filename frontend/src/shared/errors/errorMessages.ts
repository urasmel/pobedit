export function getLocalizedErrorMessage(error: Error | null, t) {
    if (!error) return t('errors.default');

    console.log('Error:', error);

    if (error.message) {
        if (error.message.includes('User not found')) return t('errors.userNotFound');
        if (error.message.includes('Network Error')) return t('errors.networkError');
        if (error.message.includes('HTTP error! Status: 404')) return t('errors.notFound');
        if (error.message.includes('channelNotFound')) return t('errors.channelNotFound');
        if (error.message.includes('500')) return t('errors.serverError');
    }

    return t('errors.default');
}
