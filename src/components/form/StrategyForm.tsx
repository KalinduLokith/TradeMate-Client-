import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { StrategyDto } from "../../types/StrategyDto";
import APIClient from "../../util/APIClient";
import { toast } from "react-toastify";

export interface StrategyFormProp {
  strategy: StrategyDto | null;
  loadAllStrategies: () => void;
  onClose: () => void;
}

export const StrategyForm: React.FC<StrategyFormProp> = ({
  strategy,
  loadAllStrategies,
  onClose,
}) => {
  // for testing purposes
  const defaultStrategy: StrategyDto = {
    id: 0,
    name: "",
    type: "",
    comment: "",
    description: "",
    marketType: null,
    marketCondition: null,
    riskLevel: "",
    winRate: 0,
    totalTrades: 0,
    lastModifiedDate: new Date(),
    userId: 0,
  };

  const [strategyFormData, setStrategyFormData] = useState<StrategyDto>(
    strategy || defaultStrategy,
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (fieldName: string, value: any): boolean => {
    switch (fieldName) {
      case "name":
      case "type":
      case "comment":
      case "description":
      case "riskLevel":
        return typeof value === "string" && value.trim().length > 0;
      case "marketCondition":
      case "marketType":
        return Array.isArray(value) && value.length > 0;
      default:
        return true;
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => {
    const { name, value } = e.target;

    // Update form data
    setStrategyFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove the error for the specific field if the value is valid
    setErrors((prevErrors) => {
      const { [name]: _, ...remainingErrors } = prevErrors; // Use `_` to ignore the removed field
      return validateField(name, value)
        ? remainingErrors
        : { ...prevErrors, [name]: `${name} is required` };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setStrategyFormData((prev) => {
      const currentMarketTypes = prev.marketType || [];
      return {
        ...prev,
        marketType: checked
          ? [...currentMarketTypes, name] // Add if checked
          : currentMarketTypes.filter((type) => type !== name), // Remove if unchecked
      };
    });

    setErrors((prevErrors) => {
      const { marketType: _, ...remainingErrors } = prevErrors; // Ignore marketType
      const updatedMarketType = checked
        ? [...(strategyFormData.marketType || []), name]
        : (strategyFormData.marketType || []).filter((type) => type !== name);

      return validateField("marketType", updatedMarketType)
        ? remainingErrors
        : { ...prevErrors, marketType: "Market Type is required" };
    });
  };

  const handleMarketConditionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } = e.target;

    setStrategyFormData((prev) => {
      const currentMarketConditions = prev.marketCondition || [];
      return {
        ...prev,
        marketCondition: checked
          ? [...currentMarketConditions, name] // Add if checked
          : currentMarketConditions.filter((condition) => condition !== name), // Remove if unchecked
      };
    });

    setErrors((prevErrors) => {
      const { marketCondition: _, ...remainingErrors } = prevErrors; // Ignore marketCondition
      const updatedMarketConditions = checked
        ? [...(strategyFormData.marketCondition || []), name]
        : (strategyFormData.marketCondition || []).filter(
            (condition) => condition !== name,
          );

      return validateField("marketCondition", updatedMarketConditions)
        ? remainingErrors
        : { ...prevErrors, marketCondition: "Market Condition is required" };
    });
  };

  // Validate the form
  const validate = () => {
    const validationErrors: { [key: string]: string } = {};
    const requiredFields = [
      "name",
      "type",
      "comment",
      "description",
      "marketType",
      "marketCondition",
      "riskLevel",
    ];

    requiredFields.forEach((field) => {
      if (!strategyFormData[field as keyof StrategyDto]) {
        validationErrors[field] = `${field} is required`;
      }
    });

    return validationErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (strategy?.id) {
      updateStrategy();
    } else {
      saveStrategy();
    }
  };

  // Save strategy
  const saveStrategy = () => {
    const { id, ...dataWithoutId } = strategyFormData;
    APIClient.post("/strategies", dataWithoutId, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        loadAllStrategies();
        toast.success("Strategy saved successfully!");
        clearForm();
        onClose();
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Unknown error occurred";
        toast.error(errorMessage);
        clearForm();
        onClose();
      });
  };

  // Clear form
  const clearForm = () => {
    setStrategyFormData(defaultStrategy);
    setErrors({});
  };

  // Update strategy
  const updateStrategy = () => {
    if (!strategy?.id) {
      toast.error("Strategy ID is missing.");
      return;
    }

    APIClient.put(`/strategies/${strategy.id}`, strategyFormData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        loadAllStrategies();
        toast.success("Strategy updated successfully!");
        clearForm();
        onClose();
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Unknown error occurred";
        toast.error(`Failed to update strategy: ${errorMessage}`);
        onClose();
      });
  };

  useEffect(() => {
    setStrategyFormData(strategy || defaultStrategy);
  }, [strategy]);

  return (
    <Box className="mx-auto p-2">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2 justify-between">
            <Box sx={{ marginBottom: 2 }}>
              <TextField
                label="Name"
                size="small"
                type="text"
                name="name"
                value={strategyFormData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
              />
            </Box>

            {/*type*/}
            <Box sx={{ marginBottom: 2 }}>
              <FormControl
                fullWidth
                size="small"
                required
                error={!!errors.type}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={strategyFormData.type}
                  onChange={handleChange}
                >
                  <MenuItem value="Scalping">Scalping</MenuItem>
                  <MenuItem value="Swing Trading">Swing Trading</MenuItem>
                  <MenuItem value="Day Trading">Day Trading</MenuItem>
                  <MenuItem value="Position Trading">Position Trading</MenuItem>
                  <MenuItem value="Range Trading">Range Trading</MenuItem>
                </Select>
                <Box sx={{ color: "red" }}>{errors.type}</Box>
              </FormControl>
            </Box>

            {/*description*/}
            <Box sx={{ marginBottom: 2 }}>
              <TextField
                label="Description"
                size="small"
                type="text"
                name="description"
                value={strategyFormData.description}
                onChange={handleChange}
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description}
                fullWidth
                required
              />
            </Box>

            {/*market type*/}
            <Box
              className={"relative"}
              sx={{
                marginBottom: 2,
                border: "1px solid", // Default border
                borderRadius: 1, // Theme-based border radius
                padding: 2, // Adds consistent padding inside the box
                borderColor: "grey.400", // Default border color
                "&:hover": {
                  borderColor: "black", // Change border color on hover
                },
              }}
            >
              <div className="absolute top-0">Market Type</div>
              <FormControl component="fieldset" required>
                <div className="flex w-full flex-wrap ">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Stocks"
                        checked={
                          (strategyFormData.marketType || []).includes("Stocks") // Handle null/undefined
                        }
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Stocks"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Crypto"
                        checked={
                          (strategyFormData.marketType || []).includes("Crypto") // Handle null/undefined
                        }
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Crypto"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Forex"
                        checked={
                          (strategyFormData.marketType || []).includes("Forex") // Handle null/undefined
                        }
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Forex"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Commodities"
                        checked={
                          (strategyFormData.marketType || []).includes(
                            "Commodities",
                          ) // Handle null/undefined
                        }
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Commodities"
                  />
                </div>
                <Box sx={{ color: "red" }}>{errors.marketType}</Box>
              </FormControl>
            </Box>
          </div>
          <div className="flex flex-col space-y-2 justify-between">
            {/*market condition*/}
            <Box
              className="relative"
              sx={{
                marginBottom: 2,
                border: "1px solid",
                borderRadius: 1,
                padding: 2,
                borderColor: "grey.400",
                "&:hover": {
                  borderColor: "black",
                },
              }}
            >
              <div className="absolute top-0">Market Condition</div>
              <FormControl component="fieldset" required>
                <div className="flex w-full flex-wrap">
                  {["Bullish", "Bearish", "Volatile", "Sideways"].map(
                    (condition) => (
                      <FormControlLabel
                        key={condition}
                        control={
                          <Checkbox
                            name={condition}
                            checked={(
                              strategyFormData.marketCondition || []
                            ).includes(condition)}
                            onChange={handleMarketConditionChange}
                          />
                        }
                        label={condition}
                      />
                    ),
                  )}
                </div>
                {errors.marketCondition && (
                  <Box sx={{ color: "red" }}>{errors.marketCondition}</Box>
                )}
              </FormControl>
            </Box>

            {/*risk level*/}
            <Box sx={{ marginBottom: 2 }}>
              <FormControl
                fullWidth
                size="small"
                required
                error={!!errors.riskLevel}
              >
                <InputLabel>Risk Level</InputLabel>
                <Select
                  name="riskLevel"
                  value={strategyFormData.riskLevel}
                  onChange={handleChange}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
                <Box sx={{ color: "red" }}>{errors.riskLevel}</Box>
              </FormControl>
            </Box>

            {/*comment*/}
            <Box sx={{ marginBottom: 2 }}>
              <TextField
                label="Comment"
                size="small"
                type="text"
                name="comment"
                value={strategyFormData.comment}
                onChange={handleChange}
                multiline
                rows={3}
                error={!!errors.comment}
                helperText={errors.comment}
                fullWidth
                required
              />
            </Box>

            {/*star rate*/}
            <Box
              className={"relative"}
              sx={{
                marginBottom: 2,
                border: "1px solid", // Default border
                borderRadius: 1, // Theme-based border radius
                padding: 2, // Adds consistent padding inside the box
                borderColor: "grey.400", // Default border color
                "&:hover": {
                  borderColor: "black", // Change border color on hover
                },
              }}
            >
              <div className="absolute top-0">Rate</div>
              <Rating
                name="starRate"
                value={strategyFormData.starRate || 0}
                onChange={(_event, newValue) => {
                  setStrategyFormData((prev) => ({
                    ...prev,
                    starRate: newValue || 0,
                  }));
                }}
              />
              {errors.starRate && (
                <Box sx={{ color: "red" }}>{errors.starRate}</Box>
              )}
            </Box>
          </div>
        </div>
        <Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {strategy && strategy.id !== 0 ? "Update" : "Save"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
