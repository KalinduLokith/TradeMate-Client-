import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LineChart, LogOut, Settings } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

export const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return (
    <nav className="bg-white border-b w-full shadow-sm ">
      <div className=" mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[4.5rem]">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/dashboard">
            <span className="text-2xl font-bold text-blue-500 tracking-wide">
              Trade Mate
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-gray-200 hover:text-gray-800"
          >
            <LineChart className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/journal"
            className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-gray-200 hover:text-gray-800"
          >
            <BookOpen className="h-5 w-5" />
            <span>Journal</span>
          </Link>
          <Link
            to="/playbook"
            className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-gray-200 hover:text-gray-800"
          >
            <Settings className="h-5 w-5" />
            <span>Strategy Playbook</span>
          </Link>
        </div>

        {/* User Options */}
        <div className="flex items-center space-x-4">
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar
              alt="User Avatar"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=80&q=80&w=80"
              className="h-8 w-8"
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                width: "150px",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/settings");
              }}
            >
              Profile
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                logout();
                navigate("/");
              }}
            >
              <div className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
};
