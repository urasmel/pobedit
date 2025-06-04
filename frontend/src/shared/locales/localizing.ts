export const getLocalizedString = (error: Error | null, t) => {
    if (!error) return t('errors.default');

    const stringsMap = new Map();
    stringsMap.set("error.updateSettings", t('errors.updateSettings'));
    stringsMap.set("error.fetchSettings", t('errors.fetchSettings'));
    stringsMap.set("error.fetchGatherState", t('errors.fetchGatherState'));
    stringsMap.set("error.fetchAllChannels", t('errors.fetchAllChannels'));
    stringsMap.set("error.fetchChannel", t('errors.fetchChannel'));
    stringsMap.set("error.fetchChannelInfo", t('errors.fetchChannelInfo'));
    stringsMap.set("error.fetchAccountCommentsCount", t('errors.fetchAccountCommentsCount'));
    stringsMap.set("error.fetchAccountAllComments", t('errors.fetchAccountAllComments'));
    stringsMap.set("error.fetchPostCommentsCount", t('errors.fetchPostCommentsCount'));
    stringsMap.set("error.fetchComment", t('errors.fetchComment'));
    stringsMap.set("error.fetchPostComments", t('errors.fetchPostComments'));
    stringsMap.set("error.fetchPostsCount", t('errors.fetchPostsCount'));
    stringsMap.set("error.fetchPost", t('errors.fetchPost'));
    stringsMap.set("error.fetchPosts", t('errors.fetchPosts'));
    stringsMap.set("error.fetchSerchQuery", t('errors.fetchSerchQuery'));
    stringsMap.set("error.fetchUsers", t('errors.fetchUsers'));

    if (stringsMap.has(error.message)) {
        return stringsMap.get(error.message);
    }

    return t('errors.default');
};
