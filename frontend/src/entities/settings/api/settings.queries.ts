import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getSettings } from "./get-settings";

export const settingsQueries = {
    prefix: ["settings"],

    all: () =>
        queryOptions({
            queryKey: settingsQueries.prefix,
            queryFn: () => getSettings(),
            placeholderData: keepPreviousData,
        }),
};
