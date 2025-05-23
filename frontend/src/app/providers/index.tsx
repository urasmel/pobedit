import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";


interface Props {
    children: ReactNode;
    client: QueryClient;
};

export const Providers = ({ children, client }: Props) => {
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
};
