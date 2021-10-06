import React from 'react';
import {
    QueryClient,
    QueryClientProvider,
  } from 'react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        },
    }
});

const ReactQueryProvider: React.FC = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default ReactQueryProvider;