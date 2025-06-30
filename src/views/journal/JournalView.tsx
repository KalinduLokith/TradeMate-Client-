import { Button } from "@mui/material";
import { Plus } from "lucide-react";
import TradeJournalForm from "../../components/form/TradeJournalForm";
import { useEffect, useState } from "react";
import TradeJournalTable, { TradeTableData } from "../TradeJournalTable";
import APIClient from "../../util/APIClient";
import { Trade } from "../../types/TradeDto";

const JournalView = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [tradesList, setTradesList] = useState<TradeTableData[]>([]);
  const [isOverThreeTrades, setIsOverThreeTrades] = useState<boolean>(false);
  const [isRevengeTrading, setIsRevengeTrading] = useState<boolean>(false);
  const [tradeCountToday, setTradeCountToday] = useState<number>(0);
  const [isThereFOMOTrade, setIsThereFOMOTrade] = useState<boolean>(false);

  useEffect(() => {
    getAllTradesByUser();
  }, []);

  const getAllTradesByUser = async () => {
    try {
      setTradesList([]);
      const response = await APIClient.get("/trades/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(response.data.data);
      setTradesList(response.data.data);
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  const [data, setData] = useState<Trade | null>(null);

  const handleSelectedData = (newData: Trade | null) => {
    // additional
    // console.log(newData);
    setData(newData);
  };

  const findIfMoreThanThreeTradesForToday = () => {
    const today = new Date();
    let count = 0;
    tradesList.forEach((trade) => {
      const tradeDate = new Date(trade.openDate);
      if (
        tradeDate.getDate() === today.getDate() &&
        tradeDate.getMonth() === today.getMonth() &&
        tradeDate.getFullYear() === today.getFullYear()
      ) {
        count++;
      }
    });
    setTradeCountToday(count);
    if (count > 3) {
      return true;
    }
    return false;
  };

  const findIfRevengeTrading = () => {
    const today = new Date();
    let count = 0;
    tradesList.forEach((trade) => {
      const tradeDate = new Date(trade.openDate);
      if (
        tradeDate.getDate() === today.getDate() &&
        tradeDate.getMonth() === today.getMonth() &&
        tradeDate.getFullYear() === today.getFullYear() &&
        trade.profit < 0
      ) {
        count++;
      }
    });

    if (count > 3) {
      return true;
    }
    return false;
  };

  const findIfFOMOTrade = () => {
    const isFomoFound = tradesList.some((trade) => {
      const tradeDate = new Date(trade.openDate);
      const today = new Date();
      if (
        tradeDate.getDate() === today.getDate() &&
        tradeDate.getMonth() === today.getMonth() &&
        tradeDate.getFullYear() === today.getFullYear() &&
        trade.strategyId === null
      ) {
        return true;
      }
      return false;
    });
    setIsThereFOMOTrade(isFomoFound);
  };

  useEffect(() => {
    setIsOverThreeTrades(findIfMoreThanThreeTradesForToday());
    setIsRevengeTrading(findIfRevengeTrading());
    findIfFOMOTrade();
  }, [tradesList]);

  return (
    <div className="min-h-screen py-[1vw]">
      <div className="flex items-center justify-between bg-gray-50 p-[1.5vw] rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trading Journal</h1>
          <p className="text-gray-600 mt-[0.5vw]">
            Keep track of your trades, analyze your performance, and improve
            your trading skills.
          </p>
        </div>

        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          New Trade
        </Button>
      </div>

      {isOverThreeTrades && (
        <div
          className="mt-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">
            Over Trading Alert: You're entering more trades than usual. You've
            made {tradeCountToday} trades today. Are you following your trading
            plan?
          </strong>
          <br />
          <span className="block sm:inline">
            Over Trading can diminish your focus and lead to impulsive
            decisions. Review your trades and stick to your planned strategy.
          </span>
        </div>
      )}

      {isRevengeTrading && (
        <div
          className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">
            Revenge Trading Warning : You're approaching a trade after a 3
            loses.
          </strong>
          <br />
          <span className="block sm:inline">
            Trading immediately after a loss may be influenced by revenge
            trading. Take a moment to assess if this trade aligns with your
            strategy.
          </span>
        </div>
      )}

      {isThereFOMOTrade && (
        <div
          className="mt-2 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
          role="info"
        >
          <strong className="font-bold">
            Reminder: FOMO can lead to impulsive decisions. You made a trade
            without a strategy today.
          </strong>
          <br />
          <span className="block sm:inline">
            FOMO often leads to over trading. Ensure this trade aligns with your
            strategy and not your emotions.Chasing the market often leads to
            regretful decisions. Pause and review your plan before proceeding.
          </span>
        </div>
      )}

      <div className="mt-2">
        <TradeJournalTable
          tradeData={tradesList}
          openTradeForm={() => setOpen(true)}
          handleSelectedData={handleSelectedData}
          getAllTradesByUser={getAllTradesByUser}
        />
      </div>

      <TradeJournalForm
        data={data}
        // handleSelectedData={handleSelectedData}
        open={open}
        onClose={async () => {
          setOpen(false);
          getAllTradesByUser();
          setData(null);
        }}
      />
    </div>
  );
};
export default JournalView;
