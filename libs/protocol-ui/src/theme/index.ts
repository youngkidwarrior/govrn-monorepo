import colors from './colors';
import Button from './components/button';
import Input from './components/input';
import Checkbox from './components/checkbox';
import Switch from './components/switch';
import Table from './components/table';
import Tabs from './components/tabs';

import Textarea from './components/textarea';
import Toast from './components/toast';
import Tooltip from './components/tooltip';
import { extendTheme } from '@chakra-ui/react';
import '@fontsource/inter/variable-full.css';

export const GovrnTheme = extendTheme({
  colors,
  styles: {
    global: {
      'html, body': {
        fontFamily: 'InterVariable, -apple-system, system-ui, sans-serif',
      },
    },
  },
  fonts: {
    heading: 'InterVariable, -apple-system, system-ui, sans-serif',
    body: 'InterVariable, -apple-system, system-ui, sans-serif',
  },

  components: {
    Button,
    Input,
    Checkbox,
    Switch,
    Table,
    Tabs,

    Textarea,
    Toast,
    Tooltip,
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});
