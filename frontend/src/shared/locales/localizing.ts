export const getLocalizedString = (error: Error | null, t) => {
    if (!error) return t('errors.default');

    const stringsMap = new Map();
    stringsMap.set("error.updateSettings", t('error.updateSettings'));
    stringsMap.set("error.fetchSettings", t('error.fetchSettings'));
    stringsMap.set("error.fetchGatherState", t('error.fetchGatherState'));
    stringsMap.set("error.fetchAllChannels", t('error.fetchAllChannels'));
    stringsMap.set("error.fetchChannel", t('error.fetchChannel'));
    stringsMap.set("error.fetchChannelInfo", t('error.fetchChannelInfo'));
    stringsMap.set("error.fetchAccountCommentsCount", t('error.fetchAccountCommentsCount'));
    stringsMap.set("error.fetchAccountAllComments", t('error.fetchAccountAllComments'));
    stringsMap.set("error.fetchPostCommentsCount", t('error.fetchPostCommentsCount'));
    stringsMap.set("error.fetchComment", t('error.fetchComment'));
    stringsMap.set("error.fetchPostComments", t('error.fetchPostComments'));
    stringsMap.set("error.fetchPostsCount", t('error.fetchPostsCount'));
    stringsMap.set("error.fetchPost", t('error.fetchPost'));
    stringsMap.set("error.fetchPosts", t('error.fetchPosts'));
    stringsMap.set("error.fetchSerchQuery", t('error.fetchSerchQuery'));
    stringsMap.set("error.fetchUsers", t('error.fetchUsers'));


    if (stringsMap.has(error.message)) {
        console.log(error.message);
        return stringsMap.get(error.message);
    }

    return t('error.default');
};
