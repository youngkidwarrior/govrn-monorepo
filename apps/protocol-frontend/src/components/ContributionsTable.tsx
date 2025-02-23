import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Link as ChakraLink,
  HStack,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { HiOutlineLink } from 'react-icons/hi';
import { useUser } from '../contexts/UserContext';
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
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import ModalWrapper from './ModalWrapper';
import MintModal from './MintModal';
import BulkDaoAttributeModal from './BulkDaoAttributeModal';
import { useOverlay } from '../contexts/OverlayContext';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import GlobalFilter from './GlobalFilter';
import EditContributionForm from './EditContributionForm';
import { UIContribution } from '@govrn/ui-types';
import DeleteContributionDialog from './DeleteContributionDialog';
import { BLOCK_EXPLORER_URLS } from '../utils/constants';
import { GovrnSpinner } from '@govrn/protocol-ui';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatDate, toDate } from '../utils/date';
import { RowSelectionState } from '@tanstack/table-core';
import { statusEmojiSelect } from '../utils/statusEmojiSelect';
import GovrnTable from './GovrnTable';

export type DialogProps = {
  isOpen: boolean;
  title: string;
  onConfirm: boolean;
  contributionId: number;
};

const ContributionsTable = ({
  data,
  setSelectedContributions,
  hasMoreItems,
  nextPage,
}: {
  data: UIContribution[];
  setSelectedContributions: (rows: UIContribution[]) => void;
  hasMoreItems: boolean;
  nextPage: () => void;
}) => {
  const { userData } = useUser();
  const localOverlay = useOverlay();
  const { setModals } = useOverlay();
  const [selectedContribution, setSelectedContribution] = useState<number>();

  const handleEditContributionFormModal = (id: number) => {
    setSelectedContribution(id);
    setModals({ editContributionFormModal: true });
  };

  const [dialog, setDialog] = useState<DialogProps>({
    isOpen: false,
    title: '',
    onConfirm: false,
    contributionId: 0,
  });

  const handleDeleteContribution = useCallback(
    (contributionId: number) => {
      setDialog({
        ...dialog,
        isOpen: true, //this opens AlertDialog
        title:
          "Are you sure you want to delete this contribution? You can't undo this action.",
        contributionId: contributionId,
      });
    },
    [dialog],
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedRows, setSelectedRows] = useState<UIContribution[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const deselectAll = () => {
    setRowSelection({});
  };

  const columnsDefs = useMemo<ColumnDef<UIContribution>[]>(() => {
    return [
      {
        id: 'selection',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
              testid: 'toggle-row-selected',
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },

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
        accessorFn: contribution => contribution.status.name,
        cell: ({ getValue }: { getValue: Getter<string> }) => {
          return (
            <Text textTransform="capitalize">
              {getValue()}{' '}
              <span
                role="img"
                aria-labelledby="Emoji indicating Contribution status: Eyes emoji for staging and Three O’Clock emoji for Pending"
              >
                {statusEmojiSelect(getValue())}
              </span>{' '}
            </Text>
          );
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
        header: 'Attestations',
        accessorFn: contribution => String(contribution.attestations.length),
        cell: ({ getValue }: { getValue: Getter<string> }) => {
          return <Text textTransform="capitalize">{getValue()} </Text>;
        },
      },
      {
        header: 'DAO',
        accessorFn: contribution =>
          contribution.guilds.map(guildObj => guildObj.guild.name)[0] ?? '---',
        cell: ({ getValue }: { getValue: Getter<string> }) => {
          return <Text>{getValue()}</Text>;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <HStack spacing={1}>
            {row.original.status.name === 'pending' &&
              row.original.tx_hash !== null && (
                <Tooltip
                  variant="primary"
                  label="Pending contributions cannot be edited or deleted. View on Block Explorer."
                  aria-label="A tooltip: Pending contributions cannot be edited or deleted. View on Block Explorer."
                >
                  <Box>
                    <ChakraLink
                      href={`${BLOCK_EXPLORER_URLS['gnosisChain']}/${row.original.tx_hash}`}
                      isExternal
                    >
                      <IconButton
                        icon={<HiOutlineLink fontSize="1rem" />}
                        aria-label="View on Block Explorer"
                        variant="ghost"
                        color="gray.800"
                        padding={1}
                      />
                    </ChakraLink>
                  </Box>
                </Tooltip>
              )}

            {row.original.status.name === 'staging' && (
              <HStack spacing="1">
                <IconButton
                  icon={<FiEdit2 fontSize="1rem" />}
                  variant="ghost"
                  color="gray.800"
                  aria-label="Edit Contribution"
                  disabled={row.original.user.id !== userData?.id}
                  data-testid="editContribution-test"
                  onClick={() =>
                    handleEditContributionFormModal(row.original.id)
                  }
                />
                <IconButton
                  icon={<FiTrash2 fontSize="1rem" />}
                  variant="ghost"
                  color="gray.800"
                  disabled={row.original.user.id !== userData?.id}
                  aria-label="Delete Contribution"
                  data-testid="deleteContribution-test"
                  onClick={() => handleDeleteContribution(row.original.id)}
                />
              </HStack>
            )}
          </HStack>
        ),
      },
    ];
  }, [userData?.id]);

  const table = useReactTable<UIContribution>({
    data,
    columns: columnsDefs,
    state: {
      sorting,
      rowSelection: rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    setSelectedContributions(selectedRows);
  }, [selectedRows, setSelectedContributions]);

  useEffect(() => {
    const selectedContributions: UIContribution[] = [];
    for (const key in rowSelection) {
      if (rowSelection[key]) {
        selectedContributions.push(table.getRow(key).original);
      }
    }
    setSelectedRows(selectedContributions);
  }, [rowSelection, table]);

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
        <ModalWrapper
          name="editContributionFormModal"
          title="Update Contribution Activity"
          localOverlay={localOverlay}
          size="3xl"
          content={
            <EditContributionForm
              contribution={
                data.find(
                  localContribution =>
                    localContribution.id === selectedContribution,
                )!
              }
            />
          }
        />
        <DeleteContributionDialog dialog={dialog} setDialog={setDialog} />
        <ModalWrapper
          name="mintModal"
          title="Mint Your DAO Contributions"
          localOverlay={localOverlay}
          size="3xl"
          content={
            <MintModal contributions={selectedRows} onFinish={deselectAll} />
          }
        />
        <ModalWrapper
          name="bulkDaoAttributeModal"
          title="Attribute Contributions to a DAO"
          localOverlay={localOverlay}
          size="3xl"
          content={<BulkDaoAttributeModal contributions={selectedRows} />}
        />
      </Box>
    </Stack>
  );
};

export default ContributionsTable;
