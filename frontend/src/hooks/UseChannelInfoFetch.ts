import { fetchChannelNameById } from '@/api/channels';
import { ChannelInfo, Status } from '@/types';
import { useState, useEffect } from 'react';

const UseChannelInfoFetch = (user: string | undefined, channelId: string | undefined) => {

    const [channel, setChannel] = useState<ChannelInfo | undefined>();
    const [channelLoading, setChannelLoading] = useState<Status>('Before');
    const [channelLoadingError, setChannelLoadingError] = useState(false);


    useEffect(() => {


        const fetchData = async () => {

            if (user == undefined || channelId == undefined) {
                setChannelLoadingError(true);
                setTimeout(() => { setChannelLoadingError(false); }, 6000);
                console.error('Undefined param in UseChannelInfoFetching');
                return;
            }


            setChannelLoading('Processing');
            try {
                const channelData = await fetchChannelNameById(user, channelId ? +channelId : undefined);
                setChannel(channelData);
            } catch (error) {
                let message;
                if (error instanceof Error) message = error.message;
                else message = String(error);
                setChannelLoadingError(true);
                setTimeout(() => { setChannelLoadingError(false); }, 6000);
                console.error(message);
            } finally {
                setChannelLoading('After');
            }
        };

        fetchData();
    }, [user, channelId]);

    return { channel, channelLoading, channelLoadingError };
};

export default UseChannelInfoFetch;
