import { useMemo, useState } from 'react';
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Getter,
} from '@tanstack/react-table';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GovrnSpinner } from '@govrn/protocol-ui';
import { UIContribution } from '@govrn/ui-types';
import { formatDate, toDate } from '../utils/date';
import { mergePages } from '../utils/arrays';
import GovrnTable from './GovrnTable';

const columnsDef: ColumnDef<UIContribution>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ getValue }: { getValue: Getter<string> }) => {
      return (
        <Flex direction="column" wrap="wrap">
          <Text whiteSpace="normal">{getValue()}</Text>
        </Flex>
      );
    },
  },
  {
    header: 'Type',
    accessorFn: contribution => contribution.activity_type.name,
    cell: ({ getValue }: { getValue: Getter<string> }) => {
      return <Text>{getValue()} </Text>;
    },
  },
  {
    header: 'Engagement Date',
    accessorFn: contribution => toDate(contribution.date_of_engagement),
    cell: ({ getValue }: { getValue: Getter<Date> }) => {
      return <Text>{formatDate(getValue())}</Text>;
    },
    sortingFn: 'datetime',
    invertSorting: true,
  },
  {
    header: 'Contributor',
    accessorFn: contribution => contribution.user.name,
    cell: ({ getValue }: { getValue: Getter<string> }) => {
      return <Text>{getValue()} </Text>;
    },
  },
];

const RecentContributionsTable = ({
  contributionsData,
  hasMoreItems,
  nextPage,
}: {
  contributionsData: UIContribution[][];
  hasMoreItems: boolean;
  nextPage: () => void;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo<UIContribution[]>(() => {
    return mergePages(contributionsData);
  }, [contributionsData]);

  const table = useReactTable({
    data,
    columns: columnsDef,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Stack>
      <Box width="100%" maxWidth="100vw" overflowX="auto">
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Heading
            as="h3"
            fontSize="lg"
            color="gray.800"
            fontWeight="normal"
            paddingBottom={4}
          >
            Recent Contributions
          </Heading>
          <Box width="100%" maxWidth="100vw" overflowX="auto">
            <InfiniteScroll
              dataLength={table.getRowModel().rows.length}
              next={nextPage}
              scrollThreshold={0.8}
              hasMore={hasMoreItems}
              loader={<GovrnSpinner />}
            >
              <GovrnTable
                controller={table}
                maxWidth="100vw"
                overflowX="auto"
                borderWidth="1px"
                borderColor="gray.100"
                borderRadius={{ base: 'none', md: 'md' }}
              />
            </InfiniteScroll>
          </Box>
        </Flex>
      </Box>
    </Stack>
  );
};

export default RecentContributionsTable;
