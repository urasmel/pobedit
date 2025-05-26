import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./error-fallback";

export const ErrorBoundary = ({ children }: { children: React.ReactNode; }) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                window.location.reload();
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};
