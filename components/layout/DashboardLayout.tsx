import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  ConfirmationNumber as TicketIcon,
  Add as AddIcon,
  BarChart as AnalyticsIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  AdminPanelSettings as AdminIcon,
  Storefront as StorefrontIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, UserProfile, BusinessProfile } from '@/types';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  dividerAfter?: boolean;
}

const customerNav: NavItem[] = [
  { label: 'Scopri Eventi', icon: <SearchIcon />, path: '/dashboard/customer' },
  { label: 'I Miei Biglietti', icon: <TicketIcon />, path: '/dashboard/tickets' },
  { label: 'Preferiti', icon: <FavoriteIcon />, path: '/dashboard/favorites', dividerAfter: true },
  { label: 'Impostazioni', icon: <SettingsIcon />, path: '/dashboard/settings' },
];

const businessNav: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/business/dashboard' },
  { label: 'I Miei Eventi', icon: <EventIcon />, path: '/business/events' },
  { label: 'Crea Evento', icon: <AddIcon />, path: '/business/events/create' },
  { label: 'Vendite & Biglietti', icon: <TicketIcon />, path: '/business/tickets' },
  { label: 'Analytics', icon: <AnalyticsIcon />, path: '/business/analytics', dividerAfter: true },
  { label: 'Profilo Azienda', icon: <StorefrontIcon />, path: '/business/profile' },
  { label: 'Impostazioni', icon: <SettingsIcon />, path: '/business/settings' },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { label: 'Utenti', icon: <PeopleIcon />, path: '/admin/users' },
  { label: 'Aziende', icon: <BusinessIcon />, path: '/admin/businesses' },
  { label: 'Eventi', icon: <EventIcon />, path: '/admin/events' },
  { label: 'Analytics', icon: <TrendingIcon />, path: '/admin/analytics', dividerAfter: true },
  { label: 'Configurazione', icon: <SettingsIcon />, path: '/admin/config' },
];

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case UserRole.CUSTOMER: return 'Utente';
    case UserRole.BUSINESS: return 'Business';
    case UserRole.ADMIN: return 'Admin';
  }
}

function getRoleColor(role: UserRole): 'default' | 'primary' | 'secondary' | 'error' {
  switch (role) {
    case UserRole.CUSTOMER: return 'primary';
    case UserRole.BUSINESS: return 'secondary';
    case UserRole.ADMIN: return 'error';
  }
}

function getUserDisplayName(user: UserProfile | BusinessProfile): string {
  if ('businessName' in user) return user.businessName;
  if ('firstName' in user && user.firstName) return `${user.firstName} ${user.lastName}`;
  return user.email;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (isLoading || !user) return null;

  const navItems = user.role === UserRole.ADMIN
    ? adminNav
    : user.role === UserRole.BUSINESS
      ? businessNav
      : customerNav;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    setAnchorEl(null);
    await signOut({ callbackUrl: '/auth/login' });
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
          {getUserDisplayName(user).charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle2" noWrap>
            {getUserDisplayName(user)}
          </Typography>
          <Chip
            label={getRoleLabel(user.role)}
            size="small"
            color={getRoleColor(user.role)}
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        </Box>
      </Box>
      <Divider />
      <List sx={{ flex: 1, pt: 1 }}>
        {navItems.map((item) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding>
              <ListItemButton
                selected={router.pathname === item.path}
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
            {item.dividerAfter && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ mx: 1, borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Esci" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {title || 'Eventi App'}
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
              {getUserDisplayName(user).charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Esci</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
