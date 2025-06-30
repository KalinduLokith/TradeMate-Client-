import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  Slider,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";

export const RiskManagementView: React.FC = () => {
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(2);
  const [stopLoss, setStopLoss] = useState<number>(50);
  const [newGuideline, setNewGuideline] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [rrRatio, setRRRatio] = useState<number>(0);
  const [optimalTakeProfit, setOptimalTakeProfit] = useState<number>(0);

  const [guideLinesList, setGuideLinesList] = useState([
    {
      id: 1,
      description:
        "Never risk more than 1-2% of your account on a single trade.",
    },
    {
      id: 2,
      description: "Always use stop-loss orders to limit potential losses.",
    },
    {
      id: 3,
      description:
        "Maintain a positive risk-reward ratio, aiming for at least 1:2.",
    },
    {
      id: 4,
      description:
        "Diversify your trades across different assets and strategies.",
    },
    {
      id: 5,
      description: "Regularly review and adjust your risk management approach.",
    },
  ]);
  const [openModal, setOpenModel] = useState<boolean>(false);

  const handleModel = (flag: boolean) => {
    setOpenModel(flag);
  };

  const handleAddGuideline = () => {
    if (newGuideline.trim()) {
      const newGuidelineItem = {
        id: guideLinesList.length + 1,
        description: newGuideline,
      };
      setGuideLinesList([...guideLinesList, newGuidelineItem]);
      setNewGuideline("");
      handleModel(false);
    }
  };

  const handleDeleteGuideline = (id: number) => {
    setGuideLinesList(guideLinesList.filter((g) => g.id !== id));
  };

  const maxRisk = (accountSize * riskPercentage) / 100;
  const suggestedPositionSize = maxRisk / stopLoss;

  // get suggested take profit
  useEffect(() => {
    const takeProfitValue = stopLoss * rrRatio;
    setOptimalTakeProfit(takeProfitValue);
  }, [stopLoss, rrRatio]);

  useEffect(() => {
    setAccountSize(Number(localStorage.getItem("currentBalance")) || 10000);
  }, []);

  return (
    <div className="min-h-screen py-[1vw]">
      <div className="flex items-center justify-between bg-gray-50 p-[1.5vw] rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Risk Management</h1>
          <p className="text-gray-600 mt-[0.5vw]">
            Effective risk management is crucial for successful trading. These
            guidelines and tools will help you make informed decisions and
            protect your capital.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2vw] py-5">
        {/*Guidelines*/}
        <div className="rounded max-w-7xl shadow-lg">
          <div className="p-6 flex items-center justify-between border-b">
            <h2 className="text-xl font-bold text-gray-800">Guidelines</h2>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleModel(true)}
            >
              <Plus size={16} className="mr-2" />
              New Guideline
            </Button>
          </div>

          <div className="p-6 pt-4 space-y-2 h-[70%] overflow-y-auto">
            <div className="list-disc">
              {guideLinesList.map((element) => (
                <div
                  key={element.id}
                  className="p-4 space-y-1 mt-2 bg-indigo-50 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{element.id}.</span>
                    <span>{element.description}</span>
                  </div>
                  <button
                    className="text-red-600 p-2 hover:text-red-800 hover:bg-red-100 rounded-full"
                    aria-label="Delete"
                    onClick={() => handleDeleteGuideline(element.id)} // Delete logic
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*Risk calculator*/}
        <div className="rounded max-w-7xl shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Risk Calculator</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <h1 className="text-sm font-medium text-gray-500">
                  Account Size
                </h1>
                <Input
                  id="accountSize"
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <h1 className="text-sm font-medium text-gray-500">
                  Risk Percentage per Trade
                </h1>
                <Slider
                  id="riskPercentage"
                  value={riskPercentage}
                  min={0}
                  max={5}
                  step={0.1}
                  onChange={(_, value) => setRiskPercentage(value as number)} // Update riskPercentage
                  className="mt-2"
                />
                <span className="text-sm text-gray-600">{riskPercentage}%</span>
              </div>
              <div>
                <h1 className="text-sm font-medium text-gray-500">
                  Stop-Loss Level
                </h1>
                <Input
                  id="stopLoss"
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Calculated Results
                </h3>
                <p className="text-sm">
                  Maximum risk per trade:{" "}
                  <span className="font-bold text-blue-600">
                    {maxRisk.toFixed(2)}
                  </span>
                </p>
                <p className="text-sm">
                  Suggested position size:{" "}
                  <span className="font-bold text-blue-600">
                    {suggestedPositionSize.toFixed(2)} units
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*Take profit calculator*/}
        <div className="rounded max-w-7xl shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              Take Profit Calculator
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4 flex flex-col justify-between">
              {/* <div>
                <h1 className="text-sm font-medium text-gray-500">
                  Target Profit
                </h1>
                <Input
                  className="mt-1 w-full"
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                />
              </div> */}
              <div>
                <h1 className="text-sm font-medium text-gray-500">
                  Risk-Reward Ratio
                </h1>
                <Slider
                  min={0}
                  max={5}
                  step={0.1}
                  className="mt-2"
                  onChange={(_, value) => setRRRatio(value as number)}
                />

                <span className="text-sm text-gray-600">
                  1:{rrRatio.toFixed(1)}
                </span>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Optimal Take-Profit
                </h3>
                <p className="text-sm">
                  Recommended take-profit level:{" "}
                  <span className="font-bold text-blue-600">
                    {optimalTakeProfit.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={openModal}
        onClose={() => handleModel(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Guideline</DialogTitle>
        <DialogContent>
          <TextField
            label="Guideline Description"
            variant="outlined"
            fullWidth
            value={newGuideline}
            onChange={(e) => setNewGuideline(e.target.value)}
            multiline
            rows={4}
            margin="normal"
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => handleModel(false)}
              color="secondary"
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={!newGuideline.trim()}
              onClick={handleAddGuideline}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
