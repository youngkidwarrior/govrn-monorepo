import { useMemo, useState, useEffect } from 'react';
import {
  Badge,
  Button,
  Box,
  Flex,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Getter,
} from '@tanstack/react-table';
import { useUser } from '../contexts/UserContext';
import { useDaoUserUpdate } from '../hooks/useDaoUserUpdate';
import EmptyImports from './EmptyImports';
import { GovrnSpinner } from '@govrn/protocol-ui';
import InfiniteScroll from 'react-infinite-scroll-component';
import { mergeMemberPages } from '../utils/arrays';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import { UIGuildUsers } from '@govrn/ui-types';
import { useDaoUsersInfiniteList } from '../hooks/useDaoUsersList';
import { RowSelectionState } from '@tanstack/table-core';
import { SortOrder } from '@govrn/protocol-client';
import GovrnTable from './GovrnTable';
import { displayAddress } from '../utils/web3';

interface DaoSettingsMembersTableProps {
  daoId: number;
}

const DaoSettingsMembersTable = ({ daoId }: DaoSettingsMembersTableProps) => {
  const { userData } = useUser();
  const [selectedMemberAddresses, setSelectedMemberAddreses] = useState<
    UIGuildUsers[]
  >([]);

  const {
    data: daoUsersData,
    hasNextPage,
    fetchNextPage,
  } = useDaoUsersInfiniteList({
    where: { guild_id: { equals: daoId } },
    orderBy: [
      { membershipStatus: { name: SortOrder.Asc } },
      { user: { display_name: SortOrder.Asc } },
    ],
  });

  const { mutateAsync: updateDaoMemberStatus } = useDaoUserUpdate();

  const data = useMemo<UIGuildUsers[]>(() => {
    return mergeMemberPages(
      daoUsersData && daoUsersData.pages.length > 0 ? daoUsersData.pages : [],
    );
  }, [daoUsersData]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedRows, setSelectedRows] = useState<UIGuildUsers[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [addingMembers, setAddingMembers] = useState(false);

  const handleSetAdmins = async () => {
    setAddingMembers(true);
    if (
      userData?.id === undefined ||
      selectedMemberAddresses === undefined ||
      selectedMemberAddresses.length === 0
    )
      return;
    if (selectedMemberAddresses !== undefined) {
      const parsedDaoMemberAddresses = selectedMemberAddresses.filter(
        memberAddress => memberAddress.user.address !== userData?.address,
      );
      const uniqueParsedDaoMemberAddresses = [
        ...new Set(parsedDaoMemberAddresses),
      ];
      uniqueParsedDaoMemberAddresses.map(address => {
        updateDaoMemberStatus({
          userId: userData.id,
          guildId: daoId,
          memberId: address.user_id,
          membershipStatus: 'Admin',
        });
        return true;
      });
      setAddingMembers(false);
    }
  };

  const columnsDefs = useMemo<ColumnDef<UIGuildUsers>[]>(() => {
    return [
      {
        id: 'selection',
        header: 'Select Admin',
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
        header: 'Member',
        accessorKey: 'user',
        cell: ({ getValue }: { getValue: Getter<UIGuildUsers['user']> }) => {
          const value = getValue();
          const hasMemberName = value.name || value.display_name;
          const displayMemberName =
            value.name || value.display_name || displayAddress(value.address);
          return value.address === userData?.address ? (
            <Text
              whiteSpace="normal"
              fontWeight="bold"
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
            >
              {displayMemberName}
            </Text>
          ) : hasMemberName ? (
            <Tooltip
              variant="primary"
              label={value.address}
              fontSize="sm"
              placement="right"
            >
              <Text whiteSpace="normal">{displayMemberName}</Text>
            </Tooltip>
          ) : (
            <Text whiteSpace="normal">{displayMemberName}</Text>
          );
        },
      },
      {
        header: 'Role',
        accessorKey: 'membershipStatus',
        cell: ({
          getValue,
        }: {
          getValue: Getter<UIGuildUsers['membershipStatus']>;
        }) => {
          const value = getValue();
          if (value === undefined || value === null) return;
          return (
            <Badge
              minWidth="5rem"
              textAlign="center"
              bgColor={
                value.name === 'Admin'
                  ? 'brand.purple'
                  : value.name === 'Member'
                  ? 'brand.magenta'
                  : 'gray.200'
              }
              color={
                value.name === 'Admin'
                  ? 'white'
                  : value.name === 'Member'
                  ? 'white'
                  : 'gray.600'
              }
              fontWeight="bold"
              paddingX={2}
              paddingY={1}
              borderRadius="md"
              size="sm"
              textTransform="uppercase"
            >
              {value.name}
            </Badge>
          );
        },
      },
    ];
  }, [userData?.address]);

  const table = useReactTable({
    data,
    columns: columnsDefs,
    state: {
      sorting,
      rowSelection: rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugAll: false,
  });

  useEffect(() => {
    setSelectedMemberAddreses(selectedRows);
  }, [selectedRows, selectedMemberAddresses]);

  useEffect(() => {
    const selectedMemberAddresses: UIGuildUsers[] = [];
    for (const key in rowSelection) {
      if (rowSelection[key]) {
        selectedMemberAddresses.push(table.getRow(key).original);
      }
    }
    setSelectedRows(selectedMemberAddresses);
  }, [rowSelection, table]);

  return (
    <Flex direction="column" marginBottom={8}>
      <Box
        color="gray.700"
        width="100%"
        maxWidth="100vw"
        overflowX="auto"
        background="white"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="gray.400"
        borderRadius={{ base: 'none', md: 'md' }}
        marginTop={8}
        marginBottom={4}
      >
        {daoUsersData && daoUsersData.pages.length > 0 ? (
          <Stack spacing="5">
            <Box
              id="settings-table-container"
              width="100%"
              maxWidth="100vw"
              overflowX="auto"
              maxHeight="15rem"
              overflowY="scroll"
            >
              <InfiniteScroll
                dataLength={data.length}
                next={fetchNextPage}
                scrollThreshold={0.9}
                hasMore={Boolean(hasNextPage)}
                loader={<GovrnSpinner />}
                scrollableTarget="settings-table-container"
              >
                <GovrnTable
                  controller={table}
                  maxWidth="100vw"
                  overflowX="auto"
                />
              </InfiniteScroll>
            </Box>
          </Stack>
        ) : (
          <EmptyImports />
        )}
      </Box>
      <Button
        variant="secondary"
        width="fit-content"
        onClick={handleSetAdmins}
        disabled={addingMembers}
      >
        Set Admins
      </Button>
    </Flex>
  );
};

export default DaoSettingsMembersTable;
