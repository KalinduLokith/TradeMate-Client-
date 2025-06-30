import React, { useEffect, useRef, useState } from "react";
import { CalendarIcon, Info, Pencil, Star, Trash, X } from "lucide-react";
import { StrategyDto } from "../../types/StrategyDto.ts";
import { toast } from "react-toastify";
import MUIDataTable from "mui-datatables";
import { Chip, Dialog } from "@mui/material";
import APIClient from "../../util/APIClient.ts";

interface StrategyCardProps {
  strategy: StrategyDto;
  onEdit: (strategy: StrategyDto) => void;
  loadAllStrategies: () => void;
}

interface PopupViewProps {
  showRelatedTradeTable: boolean;
  setShowRelatedTradeTable: (show: boolean) => void;
  strategy: StrategyDto;
}

const PopupView: React.FC<PopupViewProps> = ({
  showRelatedTradeTable,
  setShowRelatedTradeTable,
  strategy,
}) => {
  const [tradeData, setTradeData] = useState<any>([]);
  const [tradeStats, setTradeStats] = useState<any>([]);

  useEffect(() => {
    APIClient.post(`strategies/trades-list`, {
      strategyId: strategy.id,
    })
      .then((response) => {
        setTradeData(response.data?.data || []);
      })
      .catch(() => {
        // console.error("Failed to fetch trades: ", error);
      });
  }, [strategy.id]);

  useEffect(() => {
    APIClient.get(`strategies/strategy-stats/${strategy.userId}/${strategy.id}`)
      .then((response) => {
        setTradeStats(response.data?.data || []);
        console.log(response.data);
      })
      .catch(() => {
        // console.error("Failed to fetch trades: ", error);
      });
  }, [strategy.id]);

  const columns = [
    { name: "id", label: "ID", options: { sort: true } },
    {
      name: "openDate",
      label: "Open Date",
      options: {
        sort: true,
        customBodyRender: (value: any) => (
          <Chip
            label={new Date(value).toLocaleString()}
            style={{
              borderRadius: "0.5rem",
              color: "black",
              fontSize: "0.7rem",
            }}
          />
        ),
      },
    },
    {
      name: "closeDate",
      label: "Close Date",
      options: {
        sort: true,
        customBodyRender: (value: any) => (
          <Chip
            label={new Date(value).toLocaleString()}
            style={{
              borderRadius: "0.5rem",
              color: "black",
              fontSize: "0.7rem",
            }}
          />
        ),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        customBodyRender: (value: any) => (
          <Chip
            label={value.toUpperCase()}
            style={{
              borderRadius: "0.5rem",
              backgroundColor:
                value === "win"
                  ? "#01B398"
                  : value === "loss"
                    ? "#FF5C5C"
                    : "#FADA7A",
              fontWeight: "bold",
            }}
          />
        ),
      },
    },
    { name: "type", label: "Type" },
    { name: "duration", label: "Duration" },
    { name: "entryPrice", label: "Entry Price" },
    { name: "exitPrice", label: "Exit Price" },
    {
      name: "positionSize",
      label: "Position Size",
      options: { filter: false },
    },
    {
      name: "profit",
      label: "Profit",
      options: { filter: false },
    },
    { name: "marketTrend", label: "Market Trend" },
    { name: "stopLossPrice", label: "Stop Loss" },
    { name: "takeProfitPrice", label: "Take Profit" },
    { name: "transactionCost", label: "Transaction Cost" },
    { name: "comment", label: "Comment" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <Dialog
        open={showRelatedTradeTable}
        onClose={() => setShowRelatedTradeTable(false)}
        aria-labelledby="trade-journal-dialog"
        fullWidth
        maxWidth="lg"
      >
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
            onClick={() => setShowRelatedTradeTable(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Table Section */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {strategy.name} Trades
          </h2>

          {/* Stats Section */}
          <div className="flex items-start justify-start mb-4 w-full">
            {/* Win Rate */}
            <div className="text-center w-1/3">
              <p className="text-xs text-gray-500 tracking-wider">Win Rate</p>
              <div className="flex justify-center">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      stroke={
                        parseInt(tradeStats.winLossRatio) >= 50
                          ? "#10B981"
                          : "#EF4444"
                      }
                      strokeWidth="4"
                      strokeDasharray={`
                        ${(2 * Math.PI * 18 * parseInt(tradeStats.winLossRatio)) / 100},
                        ${2 * Math.PI * 18 - (2 * Math.PI * 18 * parseInt(tradeStats.winLossRatio)) / 100}
                      `}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 20 20)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-800">
                      {parseInt(tradeStats.winLossRatio)?.toFixed(0) ?? "N/A"}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {getWinRateMessage(tradeStats.winLossRatio)}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4 w-2/3">
              {/* Risk to Reward Ratio */}
              <div className="text-center">
                <p className="text-sm text-gray-500 tracking-wider">
                  Risk to Reward Ratio
                </p>
                <p className="text-3xl font-bold text-green-800 mt-1">
                  {tradeStats.riskToRewardRatio || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {getRRMessage(tradeStats.riskToRewardRatio)}
                </p>
              </div>
              {/* Average Profit/Loss */}
              <div className="text-center">
                <p className="text-sm text-gray-500 tracking-wider">
                  Average Profit/Loss
                </p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    tradeStats?.averageProfitLoss >= 0
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  $ {tradeStats?.averageProfitLoss?.toFixed(2) || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {getAverageProfitMessage(tradeStats.riskToRewardRatio)}
                </p>
              </div>{" "}
              {/* Max Drawdown */}
              <div className="text-center">
                <p className="text-sm text-gray-500 tracking-wider">
                  Max Drawdown
                </p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    tradeStats?.drawDownRatio >= 0
                      ? "text-red-800"
                      : "text-green-800"
                  }`}
                >
                  {tradeStats?.drawDownRatio
                    ? `${tradeStats.drawDownRatio?.toFixed(2)}%`
                    : "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {getMMDMessage(tradeStats.drawDownRatio)}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
            <MUIDataTable
              title={""}
              data={tradeData}
              columns={columns}
              options={{
                filterType: "dropdown",
                responsive: "standard",
                selectableRows: "none",
                download: true,
                print: true,
                search: true,
                pagination: true,
                elevation: 0,
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onEdit,
  loadAllStrategies,
}) => {
  const riskLevelColors: { [key: string]: string } = {
    Low: "text-green-500",
    Medium: "text-yellow-500",
    High: "text-red-500",
  };

  const deleteStrategy = async (id: number) => {
    await APIClient.delete(`/strategies/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        loadAllStrategies();
        toast.success("Strategy deleted successfully.");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Unknown error occurred";
        console.error("Failed to delete strategy: ", error);
        toast.error(errorMessage);
      });
  };

  const mapRiskLevelToColor = (riskLevel: string) =>
    riskLevelColors[riskLevel] || "";

  const [showRelatedTradeTable, setShowRelatedTradeTable] = useState(false);
  const relatedTradeTableRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the related trade table
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        relatedTradeTableRef.current &&
        !relatedTradeTableRef.current.contains(event.target as Node)
      ) {
        setShowRelatedTradeTable(false); // Close the table if clicked outside
      }
    };

    // Add event listener if the table is visible
    if (showRelatedTradeTable) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRelatedTradeTable]);

  return (
    <div className="w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg static">
      <div className="bg-gradient-to-r p-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{strategy.name}</h2>
          <div className="flex space-x-2">
            <button
              className="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100 hover:text-blue-800 transition-colors"
              aria-label="Info"
              onClick={() => setShowRelatedTradeTable(!showRelatedTradeTable)}
            >
              <Info size={15} strokeWidth={2} />
            </button>
            <button
              className="bg-green-50 text-green-600 p-2 rounded-full hover:bg-green-100 hover:text-green-800 transition-colors"
              aria-label="Edit"
              onClick={() => onEdit(strategy)}
            >
              <Pencil size={15} strokeWidth={2} />
            </button>
            <button
              className="bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-100 hover:text-red-800 transition-colors"
              aria-label="Delete"
              onClick={() => deleteStrategy(strategy.id)}
            >
              <Trash size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-700 opacity-80">
          {strategy.description}
        </p>
      </div>

      <div className="px-4 py-3 border-gray-200">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`${
                star <= (strategy.starRate || 0)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
              fill={star <= (strategy.starRate || 0) ? "currentColor" : "none"}
              size={20}
            />
          ))}
        </div>
      </div>
      <div className="px-4 py-3 border-t">
        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-500 tracking-wider">Risk Level</p>
            <p
              className={`font-bold ${mapRiskLevelToColor(strategy.riskLevel)}`}
            >
              {strategy.riskLevel}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 tracking-wider">Win Rate</p>
            <p className="text-lg font-bold text-blue-800">
              {strategy.winRate}%
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 tracking-wider">Total Trades</p>
            <p className="text-lg font-bold text-gray-800">
              {strategy.totalTrades}
            </p>
          </div>
        </div>

        {strategy.comment && (
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Comment
            </p>
            <p className="text-sm text-gray-700 italic">{strategy.comment}</p>
          </div>
        )}
      </div>

      <div className="px-4 py-3 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
          <span>
            Last modified: {strategy?.lastModifiedDate.toString().split("T")[0]}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 border-t">
        <div className="flex flex-wrap gap-2">
          {[
            strategy.type,
            ...(strategy.marketType || []),
            ...(strategy.marketCondition || []),
          ]
            .filter((badge) => badge != null)
            .filter((badge, index, self) => self.indexOf(badge) === index)
            .map((badge, index) => {
              const badgeCategory = strategy.marketType?.includes(badge)
                ? "marketType"
                : strategy.marketCondition?.includes(badge)
                  ? "marketCondition"
                  : "type";

              const badgeStyles = {
                type: "text-blue-800 bg-blue-100 border-blue-300",
                marketType: "text-green-800 bg-green-100 border-green-300",
                marketCondition:
                  "text-yellow-800 bg-yellow-100 border-yellow-300",
              };

              return (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${badgeStyles[badgeCategory]} hover:scale-105 transition-transform`}
                >
                  {badge}
                </span>
              );
            })}
        </div>
      </div>

      {showRelatedTradeTable && (
        <PopupView
          showRelatedTradeTable={showRelatedTradeTable}
          strategy={strategy}
          setShowRelatedTradeTable={setShowRelatedTradeTable}
        />
      )}
    </div>
  );
};

const getWinRateMessage = (winRate: string) => {
  const winRateValue = parseInt(winRate);
  if (winRateValue >= 95) {
    return "Unrealistic Strategy | likely overfitted.";
  } else if (winRateValue >= 89) {
    return "Exceptional Strategy | cautious of overfitting.";
  } else if (winRateValue >= 80) {
    return "Excellent Strategy | verify consistency.";
  } else if (winRateValue >= 75) {
    return "Very strong Strategy | monitor for sustainability.";
  } else if (winRateValue >= 65) {
    return "Strong Strategy | likely profitable.";
  } else if (winRateValue >= 55) {
    return "Above average Strategy | potential for profitability.";
  } else if (winRateValue >= 49) {
    return "Average Strategy | balance with risk-to-reward.";
  } else if (winRateValue >= 35) {
    return "Moderate Strategy | consider strategy refinement.";
  } else if (winRateValue >= 25) {
    return "Below average Strategy | assess risk management.";
  } else if (winRateValue >= 10) {
    return "Speculative Strategy | requires high risk-to-reward.";
  } else {
    return "High risk Strategy | likely unprofitable.";
  }
};

const getRRMessage = (riskToRewardRatio: string) => {
  console.log("riskToRewardRatio", riskToRewardRatio);

  const risk = parseFloat(riskToRewardRatio?.split(":")[0]);
  const reward = parseFloat(riskToRewardRatio?.split(":")[1]);

  const ratio = reward / risk;
  if (ratio >= 3) {
    return "Excellent risk-to-reward ratio | Highly favorable.";
  }
  if (ratio >= 2) {
    return "Good risk-to-reward ratio | Favorable.";
  }
  if (ratio >= 1.5) {
    return "Average risk-to-reward ratio | Acceptable.";
  }
  if (ratio >= 1) {
    return "Below average risk-to-reward ratio | Needs improvement.";
  }
  if (ratio < 1) {
    return "Poor risk-to-reward ratio | Unfavorable.";
  }
  return "Invalid data | Unable to determine risk-to-reward ratio.";
};

const getAverageProfitMessage = (averageProfitLoss: string) => {
  const profitValue = parseFloat(averageProfitLoss);
  if (profitValue < 0) {
    return "Negative Average Profit/Loss | Strategy may need adjustments.";
  } else if (profitValue === 0) {
    return "Break-even Average Profit/Loss | Strategy is neutral.";
  } else if (profitValue > 0) {
    return "Positive Average Profit/Loss | Strategy is profitable.";
  } else {
    return "Invalid data | Unable to determine profitability.";
  }
};

const getMMDMessage = (maxDrawdown: string) => {
  const drawdownValue = parseFloat(maxDrawdown);
  if (drawdownValue >= 0 && drawdownValue < 5) {
    return "Minimal risk | Indicates a stable and low-volatility strategy.";
  } else if (drawdownValue >= 5 && drawdownValue < 10) {
    return "Low risk | Strategy experiences occasional small downturns.";
  } else if (drawdownValue >= 10 && drawdownValue < 15) {
    return "Moderate risk | Some noticeable fluctuations; assess risk tolerance.";
  } else if (drawdownValue >= 15 && drawdownValue < 20) {
    return "Elevated risk | Significant drawdowns; may not suit all investors.";
  } else if (drawdownValue >= 20 && drawdownValue < 25) {
    return "High risk | Substantial potential losses; requires careful consideration.";
  } else if (drawdownValue >= 25 && drawdownValue < 30) {
    return "Very high risk | Strategy may not be sustainable long-term.";
  } else if (drawdownValue >= 30 && drawdownValue < 50) {
    return "Extreme risk | Likely unsuitable for most investors.";
  } else if (drawdownValue >= 50) {
    return "Unacceptable risk | Strategy poses significant capital preservation concerns.";
  } else {
    return "Invalid data | Unable to determine drawdown.";
  }
};
