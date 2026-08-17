import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, LibraryBooks, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const menuItems = [
    { label: 'All Reviews', path: '/all-reviews' },
    ...(user 
      ? [
          { label: 'My Reviews', path: '/my-reviews' },
          { label: 'Create Review', path: '/create-review' },
          { label: 'Logout', onClick: () => { logout(); handleMenuClose(); } }
        ]
      : [
          { label: 'Login', path: '/login' },
          { label: 'Register', path: '/register' }
        ]
    )
  ];

  return (
    <AppBar position="sticky" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          <LibraryBooks sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Book Reviews
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => {
                      handleMenuClose();
                      item.onClick && item.onClick();
                    }}
                    component={item.path ? Link : 'button'}
                    to={item.path}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={item.path ? Link : 'button'}
                  to={item.path}
                  onClick={item.onClick}
                  startIcon={item.label === 'Create Review' && <LibraryBooks />}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {user && (
                <IconButton color="inherit" sx={{ ml: 1 }}>
                  <AccountCircle />
                </IconButton>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;