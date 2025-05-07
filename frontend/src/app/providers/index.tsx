import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";


interface Props {
    // router: Router;
    children: ReactNode;
    client: QueryClient;
};

// export const Providers = ({ router, client }: Props) => {
export const Providers = ({ children, client }: Props) => {
    return (
        <QueryClientProvider client={client}>
            {/* <RouterProvider router={router} /> */}
            {children}
            {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
    );
};
