import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { UserDto } from "../../types/UserDto";
import APIClient from "../../util/APIClient";
import { toast } from "react-toastify";
import { UpdateUserFormProps } from "../../types/UpdateUserFormProps.ts";
import Select, { SingleValue } from "react-select";
import CountryList from "react-select-country-list";

export const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  open,
  onClose,
  user,
  refresh,
}) => {
  const [formData, setFormData] = useState<UserDto>(user);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [countryList, setCountryList] = useState<
    { value: string; label: string }[]
  >([]);

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  useEffect(() => {
    setCountryList(CountryList().getData());
  }, []);

  const validate = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName) {
      errors.firstName = "First Name is required";
    }

    if (!formData.lastName) {
      errors.lastName = "Last Name is required";
    }

    if (!formData.mobile) {
      errors.mobile = "Mobile number is required";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.mobile && !phoneRegex.test(formData.mobile)) {
      errors.mobile = "Please enter a valid 10-digit phone number";
    }

    if (!formData.addressLine1) {
      errors.addressLine1 = "Address Line 1 is required";
    }

    if (!formData.city) {
      errors.city = "City is required";
    }

    if (!formData.postalCode) {
      errors.postalCode = "Postal Code is required";
    }

    if (!formData.country) {
      errors.country = "Country is required";
    }

    if (formData.dateOfBirth && !dayjs(formData.dateOfBirth).isValid()) {
      errors.dateOfBirth = "Invalid Date of Birth";
    }

    if (
      formData.initial_capital === undefined ||
      formData.initial_capital === null
    ) {
      errors.initial_capital = "Initial Capital is required";
    }

    return errors;
  };

  const updateUserDetails = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSubmit = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobile: formData.mobile,
      dateOfBirth: formData.dateOfBirth,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      gender: formData.gender,
      initial_capital: formData.initial_capital,
    };

    // console.log(formDataToSubmit);

    APIClient.patch("/users", formDataToSubmit, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        toast.success("User details updated successfully.");
        refresh();
        onClose();
      })
      .catch((error) => {
        console.error("Failed to update user details:", error);
        toast.error("Failed to update user details.");
      });
  };

  useEffect(() => {
    setFormData(user);
    setErrors({});
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserDetails();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleCountryChange = (
    selectedOption: SingleValue<{ value: string; label: string }>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedOption ? selectedOption.value : "",
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      country: "",
    }));
  };

  const handleGenderChange = (
    selectedOption: SingleValue<{ value: string; label: string }>,
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      gender: selectedOption ? selectedOption.value : "",
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      gender: "",
    }));
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update User Details</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4 min-w-[400px] mt-2">
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="First Name"
              size="small"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Last Name"
              size="small"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Phone Number"
              size="small"
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.mobile}
              helperText={errors.mobile}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Date of Birth"
                value={
                  formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null
                }
                onChange={(newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    dateOfBirth: newValue ? newValue.toDate() : null,
                  }));
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    dateOfBirth: "",
                  }));
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Address Line 1"
              size="small"
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.addressLine1}
              helperText={errors.addressLine1}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Address Line 2"
              size="small"
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="City"
              size="small"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.city}
              helperText={errors.city}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Postal Code"
              size="small"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.postalCode}
              helperText={errors.postalCode}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Select
              options={countryList}
              value={countryList.find((c) => c.value === formData.country)}
              onChange={handleCountryChange}
              placeholder="Select Country"
              isClearable
            />
            {errors.country && (
              <div style={{ color: "red" }}>{errors.country}</div>
            )}
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Select
              options={genderOptions}
              value={genderOptions.find(
                (option) => option.value === formData.gender,
              )}
              onChange={handleGenderChange}
              placeholder="Select Gender"
            />
            {errors.gender && (
              <div style={{ color: "red" }}>{errors.gender}</div>
            )}
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Initial Capital"
              size="small"
              type="number"
              name="initial_capital"
              value={formData.initial_capital}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.initial_capital}
              helperText={errors.initial_capital}
            />
          </Box>

          <Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
