import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getSettings } from "./get-settings";

export const settingsQueries = {
    all: () =>
        queryOptions({
            queryKey: ["settings"],
            queryFn: () => getSettings(),
            placeholderData: keepPreviousData,
        }),
};
