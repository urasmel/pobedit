import { PAGE_SIZE } from "@/shared/config";
import { useMemo } from "react";

export const usePagination = (totalCount: number = 0, pageSize: number = PAGE_SIZE) => {
    const pagesCount = useMemo(() => {
        if (!totalCount) return 0;
        return Math.ceil(totalCount / pageSize);
    }, [totalCount, pageSize]);

    return { pagesCount };
};
