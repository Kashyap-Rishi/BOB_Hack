import React, { useState } from "react";
import { Outlet, NavLink,  useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
  Popover,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled } from "@mui/system";
import {  AccountTreeOutlined,BarChartOutlined } from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar = styled("div")(({ theme }) => ({
  width: drawerWidth,
  height: "calc(100% - 64px)",
  position: "fixed",
  top: "56px",
  left: 0,
  backgroundColor: "#f0f0f0",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const Main = styled("main")(({ theme }) => ({
  marginLeft: drawerWidth,
  marginTop: "64px",
  paddingLeft: "20px",
  paddingRight: "20px",
  paddingTop: "1px",
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
  },
}));

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePopoverToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F6F5F2",
        borderRight: "1px solid #ccc",
      }}
    >
      <List>
      <ListItem
          button
          component={NavLink}
          to={`/dashboard/file-upload`}
          sx={{
            "&:hover": { backgroundColor: "#e0e0e0" },
            borderBottom: "1px solid black",
          }} 
          onClick={() => {
            if (isMobile) {
              handleDrawerToggle();
            }
          }}
        >
          <ListItemIcon>
            <AccountTreeOutlined />
          </ListItemIcon>
          <ListItemText primary="File Center" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to={`/dashboard/data-visualizer`}
          sx={{
            "&:hover": { backgroundColor: "#e0e0e0" },
            borderBottom: "1px solid black",
          }} 
          onClick={() => {
            if (isMobile) {
              handleDrawerToggle();
            }
          }}
        >
          <ListItemIcon>
            <BarChartOutlined />
          </ListItemIcon>
          <ListItemText primary="Data Visualizer" />
        </ListItem>
        {/* <ListItem
          button
          component={NavLink}
          to={`/dashboard/campaigns`}
          sx={{
            "&:hover": { backgroundColor: "#e0e0e0" },
            borderBottom: "1px solid black",
          }}
          onClick={() => {
            if (isMobile) {
              handleDrawerToggle();
            }
          }}
        >
          <ListItemIcon>
            <CampaignOutlined />
          </ListItemIcon>
          <ListItemText primary="Campaigns" />
        </ListItem> */}
      </List>
    </Box>
  );

  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: "#4D869C" }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            sx={{ fontSize: "25px" }}
            variant="h6"
            noWrap
            component="div"
          >
            Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Typography fontSize={17} variant="h6" noWrap component="div">
             John Doe
            </Typography>
            <IconButton
              onClick={handlePopoverToggle}
              size="small"
              sx={{ ml: 1 }}
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: "auto",
            }}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Box
              sx={{
                p: 1,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Button
                sx={{ fontSize: "10px", color: "#4D869C" }}
                onClick={() => {
                  navigate(`/`);
                  handlePopoverClose();
                }}
              >
                Logout
              </Button>
            </Box>
          </Popover>
        </Toolbar>
      </AppBar>
      <Sidebar>{drawer}</Sidebar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          backgroundColor: "#4D869C",
        }}
      >
        {drawer}
      </Drawer>
      <Main>
        <Outlet />
      </Main>
    </div>
  );
};

export default DashboardLayout;
