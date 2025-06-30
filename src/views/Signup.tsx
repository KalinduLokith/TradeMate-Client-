import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import APIClient from "../util/APIClient.ts";

interface RegistrationData {
  email: string;
  password: string;
}

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim() || !repeatPassword.trim()) {
      setError("All fields are required.");
      return false;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
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
    setRepeatPassword("");
  };

  const register = async () => {
    if (!validateForm()) {
      toast.error(error);
      return;
    }

    const registrationData: RegistrationData = {
      email,
      password,
    };

    try {
      const response = await APIClient.post("/auth/register", registrationData);
      if (response.status === 201) {
        // console.log(response.data.message);
        toast.success("Registration successful! ");
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }

      resetFormData();
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f8f9fc"
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
        <Box textAlign="left" mb={4}>
          <Typography variant="h5" fontWeight="600">
            Register
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Create your Trade Mate account to get started.
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
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            error={!!error && !email.trim()}
            helperText={error && !email.trim() ? error : ""}
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
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={!!error && password !== repeatPassword}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            margin="normal"
            size="small"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setRepeatPassword(e.target.value)}
            value={repeatPassword}
            error={!!error && password !== repeatPassword}
            helperText={error && password !== repeatPassword ? error : ""}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            type="button"
            onClick={register}
          >
            Register
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" mb={2}>
          Already have an account?{" "}
          <strong>
            <Link to="/">Log in</Link>
          </strong>
        </Typography>
      </Box>
    </Box>
  );
};
