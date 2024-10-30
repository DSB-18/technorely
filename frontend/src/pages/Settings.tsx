import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Box,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

const Settings = () => {
  const [value, setValue] = useState(0); // State to manage tab selection
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userName = "User";

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedUserData = {
      name: updatedName,
      email: updatedEmail,
      password: newPassword,
    };

    try {
      const response = await fetch("http://localhost:3000/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update user data: ${errorMessage}`);
      }

      const updatedUser = await response.json();
      toast.success("User data updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.error("New passwords do not match!");
    return;
  }

  const passwordData = {
    currentPassword,
    newPassword,
  };

  try {
    const response = await fetch(
      "http://localhost:3000/users/update-password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(passwordData),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to update password: ${errorMessage}`);
    }

    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error: any) {
    toast.error(error.message);
  }
};


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Link
              to="/dashboard"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Dashboard
            </Link>
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

      <Box
        sx={{
          padding: 2,
          width: 500,
          margin: '0 auto',
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: 5,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Settings
        </Typography>
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          centered
        >
          <Tab label="Main Info" />
          <Tab label="Password" />
        </Tabs>

        {value === 0 && (
          <form onSubmit={handleUpdateUser}>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Update Info
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {value === 1 && (
          <form onSubmit={handlePasswordUpdate}>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  variant="outlined"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  variant="outlined"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  variant="outlined"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </>
  );
};

export default Settings;
