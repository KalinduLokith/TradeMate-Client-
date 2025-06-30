import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import APIClient from "../util/APIClient";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError("All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    setError(null);
    return true;
  };

  const resetFormData = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  const login = async () => {
    if (!validateForm()) {
      toast.error(error ?? "Please fill out all required fields.");
      return;
    }

    const loginData = { email, password };

    try {
      const response = await APIClient.post("/auth/login", loginData);
      // console.log("Login Successful:", response.data.data.token);
      const { data, message } = response.data;
      toast.success(message || "Login successful!");
      localStorage.setItem("token", data.token);

      resetFormData();
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);

      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            toast.error(
              data.message || "Invalid input. Please check your details.",
            );
            break;
          case 401:
            toast.error(data.message || "Invalid email or password.");
            break;
          case 500:
            toast.error(
              data.message || "Server error. Please try again later.",
            );
            break;
          default:
            toast.error(data.message || "An error occurred. Please try again.");
        }
      } else if (error.request) {
        toast.error(
          "Unable to connect to the server. Please check your network.",
        );
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="rgba(240, 240, 240, 0.5)"
      p={4}
    >
      <Box
        width="100%"
        maxWidth={400}
        bgcolor="white"
        borderRadius={2}
        boxShadow={3}
        p={4}
      >
        {/*<Box display="flex" justifyContent="center" mb={2}>
                    <img
                        src="/placeholder.svg"
                        alt="Trade Mate Logo"
                        style={{height: 40, width: "auto"}}
                    />
                </Box>*/}

        {/* Title and Description */}
        <Box textAlign="left" mb={3}>
          <Typography className={"text-2xl"} variant="h5" fontWeight="600">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Log in to track your trades and enhance your trading strategy.
          </Typography>
        </Box>

        <Box component="form" mb={4}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            size="small"
            type="email"
            placeholder="example@trademate.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            size="small"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <MuiLink variant="body2" color="primary">
              Forgot Password?
            </MuiLink>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            type="button"
            onClick={login}
          >
            Log In
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" mb={2}>
          New to Trade Mate?{" "}
          <strong>
            <Link to="/signup">Create an Account</Link>
          </strong>
        </Typography>
      </Box>
    </Box>
  );
};
