import styled from 'styled-components';
import React from 'react';

type AppContentProps = { drawerOpen: boolean; drawerWidth: number; };

const AppContentStyled = styled.main<AppContentProps>`
    padding: 20px;
    flex: 1;
    ${({ drawerOpen, drawerWidth }) => `
        margin-left: ${drawerOpen ? `${drawerWidth}px` : `0px`};
    `}
`;

const AppContent: React.FC<AppContentProps> = ({ drawerOpen, drawerWidth,  children }) => {
    return (
        <AppContentStyled drawerOpen={drawerOpen} drawerWidth={drawerWidth}>
            {children}
        </AppContentStyled>
    );
}

export default AppContent;
