import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { CirclePlus, Slash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DialogProps } from "../../types/DialogProps.ts";
import APIClient from "../../util/APIClient";
import { toast } from "react-toastify";
import { CurrencyDto } from "../../types/CurrencyDto.ts";

const CurrencyPairDialog: React.FC<DialogProps> = ({
  open,
  onClose,
  refresh,
}) => {
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("LKR");

  // Save currency pair
  const saveCurrencyPair = () => {
    const currencyPair = {
      from: fromCurrency,
      to: toCurrency,
    };

    APIClient.post(
      "/currencies",
      { ...currencyPair },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
      .then((response) => {
        // console.log("Currency pair saved successfully: ", response.data);
        toast.success("Currency pair saved successfully.");
        refresh();
        onClose();
      })
      .catch((error) => {
        console.error("Error saving currency pair: ", error);
        toast.error(
          error.response.data.message || "Error saving currency pair.",
        );
        onClose();
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="w-[400px]">
        <DialogTitle>Add Currency Pair</DialogTitle>
        <div className="py-4 flex flex-row">
          <TextField
            inputProps={{ style: { textTransform: "uppercase" } }}
            label="From Currency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
          />
          <div className="flex items-center justify-center my-2">
            <div className="rounded-full p-2">
              <Slash size={32} className="h-4 w-4" />
            </div>
          </div>
          <TextField
            inputProps={{ style: { textTransform: "uppercase" } }}
            label="To Currency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
          />
        </div>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={saveCurrencyPair}
            disabled={!fromCurrency || !toCurrency}
          >
            Add Pair
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export const CurrencyPairView: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyDto[]>([]);

  // Load currency pairs
  const loadCurrencyPairs = () => {
    APIClient.get("/currencies/user/currency-pairs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        setCurrencyPairs(response.data.data);
      })
      .catch((error) => {
        toast.error(error.message || "Error fetching currency pairs.");
      });
  };

  useEffect(() => {
    loadCurrencyPairs();
  }, []);

  // Delete currency pair
  const handleDeleteCurrencyPair = (id: number) => {
    APIClient.delete(`/currencies/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        toast.success("Currency pair deleted successfully.");
        if (response.data.success) {
          loadCurrencyPairs();
        }
      })
      .catch((error) => {
        // console.log(error);
        toast.error("Error deleting currency pair.");
      });
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-sm font-semibold text-gray-500">Currency Pairs</h1>
        <IconButton
          color="primary"
          aria-label="Add Currency Pair"
          onClick={() => setModalOpen(true)}
        >
          <CirclePlus />
        </IconButton>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {currencyPairs.length === 0 ? (
          <div>No currency pairs found.</div>
        ) : (
          currencyPairs.map((pair) => (
            <div
              key={pair.id}
              className="flex px-2 rounded bg-blue-50 w-full justify-between items-center"
            >
              <h1 className="text-gray-600 font-semibold">
                {pair.from} / {pair.to}
              </h1>
              <IconButton
                color="error"
                aria-label="Delete Currency Pair"
                onClick={() => handleDeleteCurrencyPair(pair.id)}
              >
                <Trash2 size="20" color="grey" />
              </IconButton>
            </div>
          ))
        )}
      </div>

      <CurrencyPairDialog
        open={modalOpen}
        refresh={loadCurrencyPairs}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
