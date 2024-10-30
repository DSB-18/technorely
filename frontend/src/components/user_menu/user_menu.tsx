import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  userName: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userName }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate("/settings");
    handleMenuClose();
  };

  const confirmLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
    setOpenDialog(false);
  };

  const cancelLogout = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar>{userName.charAt(0).toUpperCase()}</Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleSettings}>
              <Typography>Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Dialog open={openDialog} onClose={cancelLogout}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you really want to logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} color="primary">
            No
          </Button>
          <Button onClick={confirmLogout} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;
