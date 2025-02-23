import {
  Box,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import PageHeading from './PageHeading';
import AttestationsTable from './AttestationsTable';
import EmptyContributions from './EmptyContributions';
import MyAttestationsTable from './MyAttestationsTable';
import { GovrnSpinner } from '@govrn/protocol-ui';
import { SortOrder } from '@govrn/protocol-client';
import { useContributionInfiniteList } from '../hooks/useContributionList';
import { mergePages } from '../utils/arrays';
import { useUser } from '../contexts/UserContext';

const AttestationsTableShell = () => {
  const { userData } = useUser();
  const guildIds = userData?.guild_users
    ? userData?.guild_users.map(guild => guild.guild_id)
    : [];
  const {
    isFetching,
    data: contributions,
    hasNextPage,
    fetchNextPage,
  } = useContributionInfiniteList({
    orderBy: { date_of_engagement: SortOrder.Desc },
    where: {
      status: { is: { name: { equals: 'minted' } } },
      user_id: {
        not: { equals: userData?.id || 0 },
      },
      guilds: {
        some: {
          guild_id: {
            in: guildIds,
          },
        },
      },
      attestations: {
        none: {
          OR: [
            {
              user_id: { equals: userData?.id || 0 },
              attestation_status: { isNot: { name: { equals: 'pending' } } },
            },
          ],
        },
      },
    },
  });

  const {
    data: attestedContributions,
    hasNextPage: hasNextPageAttestedContributions,
    fetchNextPage: fetchNextPageAttestedContributions,
  } = useContributionInfiniteList({
    orderBy: { date_of_engagement: SortOrder.Desc },
    where: {
      status: { is: { name: { equals: 'minted' } } },
      user_id: {
        not: { equals: userData?.id || 0 },
      },
      attestations: {
        some: {
          AND: [
            {
              user_id: { equals: userData?.id || 0 },

              attestation_status: { isNot: { name: { equals: 'pending' } } },
            },
          ],
        },
      },
    },
  });

  if (isFetching && contributions && contributions.pages.length === 0) {
    return <GovrnSpinner />;
  }

  return (
    <Box
      paddingY={{ base: '4', md: '8' }}
      paddingX={{ base: '0', md: '8' }}
      color="gray.700"
      maxWidth="1200px"
    >
      <PageHeading>Attestations</PageHeading>
      {contributions && contributions.pages.length > 0 ? (
        <Tabs
          variant="soft-rounded"
          colorScheme="gray"
          width="100%"
          maxWidth="100vw"
          paddingX={{ base: 4, lg: 0 }}
        >
          <TabList>
            <Tab>DAO Contributions</Tab>
            <Tab>My Attestations</Tab>
          </TabList>
          <TabPanels>
            <TabPanel paddingX="0">
              <Box
                background="white"
                boxShadow="sm"
                borderRadius={{ base: 'none', md: 'lg' }}
              >
                <Stack spacing="5">
                  <AttestationsTable
                    data={mergePages(contributions.pages)}
                    hasMoreItems={hasNextPage}
                    nextPage={fetchNextPage}
                  />
                </Stack>
              </Box>
            </TabPanel>
            <TabPanel paddingX="0">
              <Box
                background="white"
                boxShadow="sm"
                borderRadius={{ base: 'none', md: 'lg' }}
              >
                <Stack spacing="5">
                  <Box paddingX={{ base: '4', md: '6' }} paddingTop={4}>
                    <Stack direction="column" gap="2">
                      <Text fontSize="lg" fontWeight="medium">
                        My Attestations
                      </Text>
                      <Text fontSize="md" fontWeight="normal">
                        These are contributions that you have already attested
                        to.
                      </Text>
                    </Stack>
                  </Box>
                  <Box width="100%" maxWidth="100vw" overflowX="auto">
                    {attestedContributions &&
                    attestedContributions?.pages.length > 0 ? (
                      <MyAttestationsTable
                        data={mergePages(attestedContributions?.pages || [])}
                        hasMoreItems={hasNextPageAttestedContributions}
                        nextPage={fetchNextPageAttestedContributions}
                      />
                    ) : (
                      <EmptyContributions />
                    )}
                  </Box>
                </Stack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <EmptyContributions />
      )}
    </Box>
  );
};

export default AttestationsTableShell;
