import { Link, useLocation } from 'react-router-dom';
import { TWITTER_LINK, DISCORD_LINK, FEEDBACK_LINK } from '../utils/constants';
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiBarChart2,
  FiCheckSquare,
  FiHome,
  FiMessageSquare,
  FiPlusSquare,
  FiTwitter,
  FiUsers,
  FiChevronDown,
  FiGitBranch,
} from 'react-icons/fi';
import { FaDiscord } from 'react-icons/fa';
import NavButton from './NavButton';
import ConnectWallet from './ConnectWallet';
import { useAccount } from 'wagmi';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useDaosList } from '../hooks/useDaosList';

interface MobileNavProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ children, isOpen, onClose }: MobileNavProps) => {
  const location = useLocation();
  const { userData } = useUser();
  const { isConnected } = useAccount();
  const { isAuthenticated } = useAuth();

  const { isLoading: daosListIsLoading, data: daosListData } = useDaosList({
    where: { users: { some: { user_id: { equals: userData?.id } } } }, // show only user's DAOs
  });
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          transition={{ duration: 0.1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
            <DrawerOverlay />
            <DrawerContent bgColor="white">
              <DrawerHeader>
                <Flex direction="row" justify="space-between">
                  <Stack />
                  <HStack>
                    <DrawerCloseButton
                      position="inherit"
                      marginTop={4}
                      marginRight={3}
                      size="4"
                      _focus={{ outline: 'none', bg: 'none' }}
                      _active={{ outline: 'none', bg: 'none' }}
                      color="brand.primary.500"
                    />
                  </HStack>
                </Flex>
              </DrawerHeader>
              <DrawerBody flex="2 2 auto" marginBottom={4}>
                <Flex
                  height="100%"
                  alignItems="flex-start"
                  direction="column"
                  flex="1"
                >
                  <Stack
                    spacing={{ base: '10' }}
                    shouldWrapChildren
                    width="100%"
                  >
                    <Stack spacing="1">
                      <Link to="/">
                        <NavButton label="Home" icon={FiHome} />
                      </Link>
                      <Link to="/report">
                        <NavButton
                          label="Report"
                          icon={FiPlusSquare}
                          active={location.pathname.includes('/report')}
                        />
                      </Link>
                      <Link to="/contributions">
                        <NavButton
                          label="Contributions"
                          icon={FiBarChart2}
                          active={location.pathname.includes('/contributions')}
                        />
                      </Link>
                      <Link to="/attestations">
                        <NavButton
                          label="Attestations"
                          icon={FiCheckSquare}
                          active={location.pathname.includes('/attestations')}
                        />
                      </Link>

                      <Link to="/profile">
                        <NavButton
                          label="Profile"
                          icon={FiUsers}
                          active={location.pathname.includes('/profile')}
                        />
                      </Link>
                      {isConnected && isAuthenticated && (
                        <Stack>
                          {!daosListIsLoading &&
                          daosListData &&
                          daosListData.length > 0 ? (
                            <Menu
                              placement="bottom-end"
                              autoSelect={false}
                              isLazy
                            >
                              <MenuButton
                                as={Button}
                                rightIcon={<FiChevronDown />}
                                variant="ghost"
                                justifyContent="start"
                                color="gray.800"
                                transition="all 100ms ease-in-out"
                                backgroundColor="transparent"
                                _hover={{ bgColor: 'gray.100' }}
                                width="100%"
                              >
                                <HStack spacing="3">
                                  <Icon
                                    as={FiGitBranch}
                                    boxSize="6"
                                    color="subtle"
                                  />
                                  <Text>DAOs</Text>
                                </HStack>
                              </MenuButton>
                              <MenuList
                                backgroundColor="gray.800"
                                minWidth="none"
                              >
                                {daosListData?.map(dao => (
                                  <Link to={`/dao/${dao.id}`}>
                                    <MenuItem
                                      color="white"
                                      _hover={{ backgroundColor: 'gray.600' }}
                                    >
                                      {dao.name}
                                    </MenuItem>
                                  </Link>
                                ))}
                              </MenuList>
                            </Menu>
                          ) : (
                            <Link to="/dao">
                              <NavButton
                                label="DAOs"
                                icon={FiGitBranch}
                                active={location.pathname.includes('/dao/')}
                                marginBottom={4}
                              />
                            </Link>
                          )}
                        </Stack>
                      )}
                      <HStack>
                        <ConnectWallet />
                      </HStack>
                    </Stack>
                  </Stack>
                  <Flex
                    direction="column"
                    gap="1"
                    justifyContent="flex-end"
                    width="100%"
                    flex="1 1 auto"
                  >
                    <Divider />
                    <Stack shouldWrapChildren>
                      <NavButton
                        label="Discord"
                        icon={FaDiscord}
                        linkTo={DISCORD_LINK}
                      />
                      <NavButton
                        label="Twitter"
                        icon={FiTwitter}
                        linkTo={TWITTER_LINK}
                      />
                      <NavButton
                        label="Feedback"
                        icon={FiMessageSquare}
                        linkTo={FEEDBACK_LINK}
                      />
                    </Stack>
                  </Flex>
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
