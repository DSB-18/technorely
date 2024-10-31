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
import { Link, useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";

const Settings = () => {
  const [value, setValue] = useState(0);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const userName = "User";

  const handleUpdateUserName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedNameData = { name: updatedName };
    try {
      const response = await fetch("http://localhost:3000/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedNameData),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update name: ${errorMessage}`);
      }
      toast.success("Name updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateUserEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedEmailData = { email: updatedEmail };
    try {
      const response = await fetch("http://localhost:3000/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedEmailData),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update email: ${errorMessage}`);
      }
      toast.success("Email updated successfully!");
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
      newPassword, // Match the DTO field
      confirmPassword, // Ensure it matches the DTO
    };
    try {
      const response = await fetch("http://localhost:3000/auth/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(passwordData),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update password: ${errorMessage}`);
      }
      const { accessToken, refreshToken } = await response.json();
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
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
    localStorage.removeItem("refreshToken");
    navigate("/login");
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
          margin: "0 auto",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: 5,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Settings
        </Typography>
        <Tabs
          style={{ paddingBottom: 5 }}
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          centered
        >
          <Tab label="Main Info" />
          <Tab label="Password" />
        </Tabs>
        {value === 0 && (
          <Box
            component="form"
            onSubmit={handleUpdateUserName}
            sx={{ marginBottom: 2 }}
          >
            <Grid container spacing={2}>
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
                <Button variant="contained" color="primary" type="submit">
                  Update Name
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        {value === 0 && (
          <Box component="form" onSubmit={handleUpdateUserEmail}>
            <Grid container spacing={2}>
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
                  Update Email
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        {value === 1 && (
          <Box component="form" onSubmit={handlePasswordUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p style={{ color: "red" }}>change password currently not working</p>
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
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled
                >
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Settings;
