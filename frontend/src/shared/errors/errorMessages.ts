export function getLocalizedErrorMessage(error: Error | null, t) {
    if (!error) return t('errors.default');

    const errorsMap = new Map();
    errorsMap.set("updateSettingsError", t('errors.updateSettingsError'));
    errorsMap.set("fetchSettingsError", t('errors.fetchSettingsError'));
    errorsMap.set("fetchGatherStateError", t('errors.fetchGatherStateError'));
    errorsMap.set("fetchAllChannelsError", t('errors.fetchAllChannelsError'));
    errorsMap.set("fetchChannelError", t('errors.fetchChannelError'));
    errorsMap.set("fetchChannelInfoError", t('errors.fetchChannelInfoError'));
    errorsMap.set("fetchAccountCommentsCountError", t('errors.fetchAccountCommentsCountError'));
    errorsMap.set("fetchAccountAllCommentsError", t('errors.fetchAccountAllCommentsError'));
    errorsMap.set("fetchPostCommentsCountError", t('errors.fetchPostCommentsCountError'));
    errorsMap.set("fetchCommentError", t('errors.fetchCommentError'));
    errorsMap.set("fetchPostCommentsError", t('errors.fetchPostCommentsError'));
    errorsMap.set("fetchPostsCountError", t('errors.fetchPostsCountError'));
    errorsMap.set("fetchPostError", t('errors.fetchPostError'));
    errorsMap.set("fetchPostsError", t('errors.fetchPostsError'));
    errorsMap.set("fetchSerchQueryError", t('errors.fetchSerchQueryError'));
    errorsMap.set("fetchUsersError", t('errors.fetchUsersError'));

    if (errorsMap.has(error.message)) {
        // if (error.message.includes('User not found')) return t('errors.userNotFound');
        // if (error.message.includes('Network Error')) return t('errors.networkError');
        // if (error.message.includes('HTTP error! Status: 404')) return t('errors.notFound');
        // if (error.message.includes('channelNotFound')) return t('errors.channelNotFound');
        // if (error.message.includes('500')) return t('errors.serverError');
        return errorsMap.get(error.message);
    }

    return t('errors.default');
}
