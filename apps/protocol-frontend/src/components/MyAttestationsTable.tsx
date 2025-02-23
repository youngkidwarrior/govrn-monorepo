import { useMemo, useState } from 'react';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Getter,
  Row,
} from '@tanstack/react-table';
import GlobalFilter from './GlobalFilter';
import { formatDate, toDate } from '../utils/date';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UIContribution } from '@govrn/ui-types';
import { GovrnSpinner } from '@govrn/protocol-ui';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { statusEmojiSelect } from '../utils/statusEmojiSelect';
import GovrnTable from './GovrnTable';

const MyAttestationsTable = ({
  data,
  hasMoreItems,
  nextPage,
}: {
  data: UIContribution[];
  hasMoreItems: boolean;
  nextPage: () => void;
}) => {
  const { userData } = useUser();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columnsDef = useMemo<ColumnDef<UIContribution>[]>(() => {
    return [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({
          row,
          getValue,
        }: {
          row: Row<UIContribution>;
          getValue: Getter<string>;
        }) => {
          return (
            <Flex direction="column" wrap="wrap">
              <Link to={`/contributions/${row.original.id}`}>
                <Text whiteSpace="normal">{getValue()}</Text>
              </Link>
            </Flex>
          );
        },
      },
      {
        header: 'Status',
        accessorFn: contr => contr.status.name,
        cell: ({ getValue }: { getValue: Getter<string> }) => {
          return (
            <Text textTransform="capitalize">
              {getValue()}{' '}
              <span
                role="img"
                aria-labelledby="Emoji indicating Contribution status: Sun emoji for minted and Eyes emoji for staging."
              >
                {statusEmojiSelect(getValue())}
              </span>{' '}
            </Text>
          );
        },
      },
      {
        header: 'Attestation Date',
        accessorFn: contribution =>
          toDate(
            contribution.attestations.find(a => a.user_id === userData?.id)
              ?.date_of_attestation ?? '---',
          ),
        cell: ({ getValue }: { getValue: Getter<Date> }) => {
          return <Text>{formatDate(getValue())}</Text>;
        },
        sortingFn: 'datetime',
        invertSorting: true,
      },
      {
        header: 'Contributor',
        accessorFn: contribution => contribution.user.name,
      },
    ];
  }, [userData?.id]);

  const table = useReactTable({
    data,
    columns: columnsDef,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Stack>
      <GlobalFilter
        preGlobalFilteredRows={table.getPreFilteredRowModel().rows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <Box width="100%" maxWidth="100vw" overflowX="auto">
        <InfiniteScroll
          dataLength={table.getRowModel().rows.length}
          next={nextPage}
          scrollThreshold={0.8}
          hasMore={hasMoreItems}
          loader={<GovrnSpinner />}
        >
          <GovrnTable controller={table} maxWidth="100vw" overflowX="auto" />
        </InfiniteScroll>
      </Box>
    </Stack>
  );
};

export default MyAttestationsTable;
