import React from 'react';
import { Grid, Flex, useBreakpointValue } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import FloatingReportButton from './FloatingReportButton';

interface SiteLayoutProps {
  children: React.ReactNode;
  minHeight?: string;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({
  children,
}: SiteLayoutProps) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const location = useLocation();
  return (
    <Grid
      templateColumns="20vw auto"
      as="section"
      position="relative"
      height="100vh"
      bg="gray.50"
      overflowY="auto"
    >
      {isDesktop && location.pathname !== '/' ? <Sidebar /> : null}
      <Flex direction="column" gridColumnStart="2">
        {children}
      </Flex>
      <FloatingReportButton />
    </Grid>
  );
};

export default SiteLayout;
