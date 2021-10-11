import React from 'react';
import {
    QueryClient,
    QueryClientProvider,
  } from 'react-query'
  import { ReactQueryDevtools } from 'react-query/devtools'

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
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}

export default ReactQueryProvider;