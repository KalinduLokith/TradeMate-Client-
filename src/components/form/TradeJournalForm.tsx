import { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { StrategyDto } from "../../types/StrategyDto";
import { CurrencyDto } from "../../types/CurrencyDto";
import { toast } from "react-toastify";
import APIClient from "../../util/APIClient";
import { Trade } from "../../types/TradeDto";

const tradeCategories = [
  "Scalping",
  "Day Trading",
  "Swing Trading",
  "Position Trading",
  "Momentum Trading",
  "Trend Following",
  "Breakout Trading",
  "News-Based Trading",
  "Mean Reversion",
];

const TradeJournalForm = ({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: Trade | null;
}) => {
  const [trade, setTrade] = useState<Trade>({
    openDate: "",
    closeDate: "",
    duration: 0,
    status: "",
    type: "",
    entryPrice: 0,
    exitPrice: 0,
    categories: [],
    marketTrend: "",
    stopLossPrice: 0,
    takeProfitPrice: 0,
    transactionCost: 0,
    reason: "",
    comment: "",
    positionSize: 0,
    currencyPairId: 0,
    strategyId: 0,
  });

  const [currencies, setCurrencies] = useState<CurrencyDto[]>([]);
  const [strategies, setStrategies] = useState<StrategyDto[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllCurrencies();
        await getAllStrategies();
        if (data) {
          setTrade({
            ...data,
            strategyId: data?.strategy?.id,
            currencyPairId: data?.currencyPair?.id,
          });

          if (data?.currencyPair?.id) {
            setTrade((prev) => ({
              ...prev,
              currencyPairId: data.currencyPair?.id,
            }));
          }
          setSelectedCategories(data.categories || []);

          if (data.openDate && data.closeDate) {
            const openDate = new Date(data.openDate);
            const closeDate = new Date(data.closeDate);
            const durationInMs = closeDate.getTime() - openDate.getTime();
            showDurationValue(durationInMs);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      if (!data) {
        clearForm();
      }
    };
  }, [data]);

  const getAllCurrencies = async () => {
    try {
      const response = await APIClient.get("/currencies/user/currency-pairs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCurrencies(response.data.data);
    } catch (error) {
      toast.error("Error fetching currency pairs.");
    }
  };

  const getAllStrategies = async () => {
    try {
      const response = await APIClient.get("/strategies/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStrategies(response.data.data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Unknown error occurred";
      console.log(errorMessage);
    }
  };

  const saveTrade = async () => {
    try {
      await APIClient.post("/trades", trade, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Trade added successfully.");
      clearForm();
      onClose();
    } catch (error) {
      toast.error("Failed to add trade.");
    }
  };

  const updateTrade = async () => {
    try {
      await APIClient.put(
        "/trades/" + trade.id,
        {
          ...trade,
          id: data?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Trade updated successfully.");
      clearForm();
      onClose();
    } catch (error) {
      toast.error("Failed to add trade.");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTrade((prev) => ({
      ...prev,
      [name]:
        name === "entryPrice" ||
        name === "exitPrice" ||
        name === "stopLossPrice" ||
        name === "takeProfitPrice" ||
        name === "transactionCost" ||
        name === "positionSize"
          ? parseFloat(value)
          : value,
    }));
  };

  const setCurrencyId = (e: ChangeEvent<HTMLInputElement>) => {
    const currencyId = parseInt(e.target.value);
    setTrade((prev) => ({ ...prev, currencyPairId: currencyId }));
  };

  const setStrategyId = (e: ChangeEvent<HTMLInputElement>) => {
    const strategyId = parseInt(e.target.value);
    setTrade((prev) => ({ ...prev, strategyId: strategyId }));
  };

  useEffect(() => {
    if (trade.openDate && trade.closeDate) {
      const open = new Date(trade.openDate);
      const close = new Date(trade.closeDate);

      if (close > open) {
        const durationInMs = close.getTime() - open.getTime();
        setTrade((prev) => ({ ...prev, duration: durationInMs }));
        showDurationValue(durationInMs);
      } else if (close < open) {
        setDuration("Invalid duration");
        toast.error("Close Date must be later than Open Date.");
      } else {
        setDuration("Instant trade (Open and Close Dates are the same)");
        toast.warning("Open and Close Date are the same.");
      }
    }
  }, [trade.openDate, trade.closeDate]);

  const showDurationValue = (durationInMs: number) => {
    const days = Math.floor(durationInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (durationInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationInMs % (1000 * 60)) / 1000);

    setDuration(
      `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
    );
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newCategories = checked
      ? [...selectedCategories, value]
      : selectedCategories.filter((category) => category !== value);

    setSelectedCategories(newCategories);
    setTrade((prev) => ({ ...prev, categories: newCategories }));
  };

  const validateForm = (trade: Trade) => {
    if (!trade.openDate) {
      toast.error("Open Date is required.");
      return false;
    }

    if (!trade.closeDate) {
      toast.error("Close Date is required.");
      return false;
    }

    const openDate = new Date(trade.openDate);
    const closeDate = new Date(trade.closeDate);
    if (closeDate <= openDate) {
      toast.error("Close Date must be later than Open Date.");
      return false;
    }

    if (!trade.currencyPairId) {
      toast.error("Currency Pair is required.");
      return false;
    }

    if (!["win", "loss", "breakeven"].includes(trade.status)) {
      toast.error("Trade Status must be either 'win', 'loss', or 'breakeven'.");
      return false;
    }

    if (!["buy", "sell"].includes(trade.type)) {
      toast.error("Trade Type must be either 'buy' or 'sell'.");
      return false;
    }

    if (!trade.entryPrice || trade.entryPrice <= 0) {
      toast.error("Entry Price must be a positive number.");
      return false;
    }

    if (!trade.exitPrice || trade.exitPrice <= 0) {
      toast.error("Exit Price must be a positive number.");
      return false;
    }

    if (!trade.categories || trade.categories.length === 0) {
      toast.error("Trade Category is required.");
      return false;
    }

    if (!trade.marketTrend) {
      toast.error("Market Trend is required.");
      return false;
    }

    // if (!trade.strategyId) {
    //   toast.error("Trading Strategy is required.");
    //   return false;
    // }

    if (!trade.positionSize || trade.positionSize <= 0) {
      toast.error("Position Size must be a positive number.");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm(trade)) {
      if (!data) {
        saveTrade();
      } else {
        updateTrade();
      }
    }
  };

  const clearForm = () => {
    setTrade({
      openDate: "",
      closeDate: "",
      duration: 0,
      status: "",
      type: "",
      entryPrice: 0,
      exitPrice: 0,
      categories: [],
      marketTrend: "",
      stopLossPrice: 0,
      takeProfitPrice: 0,
      transactionCost: 0,
      reason: "",
      comment: "",
      positionSize: 0,
      currencyPairId: 0,
      strategyId: 0,
    });
    setDuration("");
    setSelectedCategories([]);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        clearForm();
        onClose();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className="text-lg font-semibold">Add New Trade</DialogTitle>
      <DialogContent>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trade Details Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Trade Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="openDate"
                  label="Open Date"
                  type="datetime-local"
                  fullWidth
                  required
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={trade.openDate}
                  onChange={handleChange}
                />
                <TextField
                  name="closeDate"
                  label="Close Date"
                  type="datetime-local"
                  fullWidth
                  required
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={trade.closeDate}
                  onChange={handleChange}
                />
              </div>
              <TextField
                label="Duration"
                fullWidth
                size="small"
                value={duration}
                InputProps={{ readOnly: true }}
              />
              <TextField
                name="currencyPairId"
                label="Currency Pair"
                size="small"
                fullWidth
                required
                select
                value={trade.currencyPairId || ""}
                onChange={setCurrencyId}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.from} / {currency.to}
                  </MenuItem>
                ))}
              </TextField>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="status"
                  label="Status"
                  select
                  fullWidth
                  required
                  size="small"
                  value={trade.status}
                  onChange={handleChange}
                >
                  <MenuItem value="win">Win</MenuItem>
                  <MenuItem value="loss">Loss</MenuItem>
                  <MenuItem value="breakeven">Breakeven</MenuItem>
                </TextField>
                <TextField
                  name="type"
                  label="Trade Type"
                  select
                  fullWidth
                  required
                  size="small"
                  value={trade.type}
                  onChange={handleChange}
                >
                  <MenuItem value="buy">Buy</MenuItem>
                  <MenuItem value="sell">Sell</MenuItem>
                </TextField>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Trading categories
                </h3>
                <div
                  className="space-y-2"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {tradeCategories.map((category) => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          value={category}
                          checked={selectedCategories.includes(category)}
                          onChange={handleCategoryChange}
                        />
                      }
                      label={category}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <TextField
                  name="entryPrice"
                  label="Entry Price"
                  type="number"
                  fullWidth
                  size="small"
                  required
                  inputProps={{ step: "0.01" }}
                  value={trade.entryPrice}
                  onChange={handleChange}
                />
                <TextField
                  name="exitPrice"
                  label="Exit Price"
                  type="number"
                  fullWidth
                  size="small"
                  required
                  inputProps={{ step: "0.01" }}
                  value={trade.exitPrice}
                  onChange={handleChange}
                />
                <TextField
                  name="positionSize"
                  label="Position Size"
                  type="number"
                  fullWidth
                  size="small"
                  required
                  inputProps={{ step: "0.01" }}
                  value={trade.positionSize}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <TextField
                  name="stopLossPrice"
                  size="small"
                  label="Stop-Loss Price"
                  type="number"
                  fullWidth
                  required
                  inputProps={{ step: "0.01" }}
                  value={trade.stopLossPrice}
                  onChange={handleChange}
                />
                <TextField
                  name="takeProfitPrice"
                  size="small"
                  label="Take-Profit Price"
                  type="number"
                  fullWidth
                  required
                  inputProps={{ step: "0.01" }}
                  value={trade.takeProfitPrice}
                  onChange={handleChange}
                />
                <TextField
                  name="transactionCost"
                  size="small"
                  label="Transaction Cost"
                  type="number"
                  fullWidth
                  required
                  inputProps={{ step: "0.01" }}
                  value={trade.transactionCost}
                  onChange={handleChange}
                />
              </div>
              <TextField
                name="marketTrend"
                select
                size="small"
                label="Market Trend"
                fullWidth
                required
                value={trade.marketTrend}
                onChange={handleChange}
              >
                {["Bullish", "Bearish", "Volatile", "Sideways"].map((trend) => (
                  <MenuItem key={trend} value={trend}>
                    {trend}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name="strategyId"
                label="Trading Strategy"
                select
                fullWidth
                // required
                size="small"
                value={trade.strategyId || ""}
                onChange={setStrategyId}
              >
                {strategies.map((strategy) => (
                  <MenuItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name="comment"
                size="small"
                label="Comments/Notes"
                multiline
                rows={9}
                fullWidth
                value={trade.comment}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            clearForm();
            onClose();
          }}
          className="text-sm px-4"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="text-sm px-4"
          onClick={handleSubmit}
        >
          {data ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TradeJournalForm;
