import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { theme, ThemeContext } from '../theme';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

interface Props {
    children: ReactNode;
    client: QueryClient;
};

export const Providers = ({ children, client }: Props) => {
    return (
        <ThemeContext.Provider value={theme}>
            <I18nextProvider i18n={i18n}>
                <QueryClientProvider client={client}>
                    {children}
                </QueryClientProvider>
            </I18nextProvider>
        </ThemeContext.Provider >
    );
};
