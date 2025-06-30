import { Doughnut, Line } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import {
  BarChart,
  DollarSign,
  Info,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import APIClient from "../util/APIClient";
import { UserDto } from "../types/UserDto.ts";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TradeData {
  tradeId: number;
  profit: number;
}

interface MonthlyProfits {
  month: string;
  profit: number;
  loss: number;
}

interface StatProps {
  totalTrades: number;
  winTrades: number;
  lossTrades: number;
  breakevenTrades: number;
  totalProfit: number;
  totalStrategyCount: number;
  monthlyProfits: MonthlyProfits[];
  tradeData: TradeData;
  dailyPL: number;
  averageHoldingPeriod: number;
  highestWinTrade: number;
  highestLossTrade: number;
  totalCurrencyPairsCount: number;
  mostProfitableStrategy: any;
  riskToRewardRatio: any;
  drawDownRatio: any;
  totalAlertsThisMonth: {
    fomo: number;
    overTradeDays: number;
    revengeTradeDays: number;
  };
  currentBalance: number;
}

interface EquityData {
  date: string;
  equity: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<StatProps | null>(null);
  const [equityData, setEquityData] = useState<EquityData[]>([]);

  const [user, setUser] = useState<UserDto>({
    id: 0,
    email: "",
    mobile: "N/A",
    dateOfBirth: new Date(),
    addressLine1: "N/A",
    addressLine2: "N/A",
    city: "N/A",
    postalCode: "N/A",
    country: "N/A",
    firstName: "N/A",
    lastName: "N/A",
    gender: "N/A",
  });

  const loadUserDetails = () => {
    APIClient.get("/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        const user: UserDto = response.data.data;
        // console.log(user);
        setUser(user);
      })
      .catch((error) => {
        console.error("Failed to load user details:", error);
      });
  };

  useEffect(() => {
    loadUserDetails();
  }, []);

  const data = equityData.map((data) => ({
    x: new Date(data.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    }),
    y: data.equity,
  }));

  const [isDaily, setIsDaily] = useState(true); // To toggle between daily and monthly

  useEffect(() => {
    APIClient.get(
      `/trades/users/trade-stats/equity/${isDaily ? "daily" : "monthly"}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((response) => {
      // console.log(response.data.data);
      setEquityData(response.data.data);
    });
  }, [isDaily]);

  useEffect(() => {
    APIClient.get("/trades/users/trade-stats", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      // console.log(response.data.data);
      setStats(response.data.data);
      localStorage.setItem(
        "currentBalance",
        response.data.data.currentBalance || 0
      );
    });
  }, []);

  useEffect(() => {}, []);

  // ---------------------------------------------------------------------------
  const PRIMARY_COLOR = "#3b82f6";
  const BACKGROUND_COLOR = "rgba(101, 119, 254, 0.2)";
  const chartData: ChartData<"line"> = {
    labels: data.map((item) => item.x),
    datasets: [
      {
        label: "Equity Curve ($)",
        data: data.map((item) => item.y),
        borderColor: PRIMARY_COLOR,
        backgroundColor: BACKGROUND_COLOR,
        fill: true,
        tension: 0.2, // Smooth curve
        pointRadius: 3, // Makes points visible
        pointHoverRadius: 5,
      },
    ],
  };
  const commonOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `$${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: true },
        ticks: {
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { display: true },
        ticks: {
          callback: (value: any) => `$${value}`,
          font: { size: 12 },
        },
      },
    },
  };
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------

  const [wlData, setWlData] = useState<any>();
  useEffect(() => {
    const donutData = {
      labels: ["Wins", "Losses", "Breakeven"],
      datasets: [
        {
          data: [
            stats?.winTrades || 0,
            stats?.lossTrades || 0,
            stats?.breakevenTrades || 0,
          ],
          backgroundColor: ["#3b82f6", "#FF6384", "#FFCE56"],
          hoverBackgroundColor: ["#3b82f6", "#FF6384", "#FFCE56"],
        },
      ],
    };
    setWlData(donutData);
  }, [stats]);

  // ---------------------------------------------------------------------------

  function greet(): string {
    const hours = new Date().getHours();
    return hours < 12
      ? "Good morning"
      : hours < 18
        ? "Good afternoon"
        : "Good evening";
  }
  const [isDays, setIsDays] = useState(true); // To toggle between days and minutes
  const handleToggle = (unit: string) => {
    setIsDays(unit === "days");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className=" mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-xl p-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {greet()}
              <span className="text-blue-600 ml-2">
                {user && user.firstName ? user.firstName : ""}
              </span>
              <span className="ml-2">👋</span>
            </h1>
            <p className="text-gray-600">
              Analyze your trading performance and stay on top of your goals.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-full p-2 bg-blue-500">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-xl font-bold text-gray-800">
                    ${Number(stats?.currentBalance)?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`rounded-full p-2 ${Number(stats?.totalProfit) > 0 ? "bg-blue-500" : "bg-red-500"}`}
                >
                  {Number(stats?.totalProfit) > 0 ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" />
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Profit</p>
                  <p className="text-xl font-bold text-gray-800">
                    ${Number(stats?.totalProfit)?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Win/Loss Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Win/Loss Ratio</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stats?.winTrades}/{stats?.lossTrades}
                  </h3>
                  <span className="text-sm text-green-500">
                    {stats?.winTrades &&
                      (
                        (stats?.winTrades / (stats?.totalTrades || 1)) *
                        100
                      ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Trade Volume Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Trade Volume</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats?.totalTrades} Trades
                </h3>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <BarChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Daily P/L Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Daily P/L</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    ${Number(stats?.dailyPL)?.toFixed(2) || "0.00"}
                  </h3>
                  {/* <span className="text-xs text-gray-500">Last 10 trades</span> */}
                </div>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Strategies Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Active Strategies</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats?.totalStrategyCount || 0}
                </h3>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Info className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Equity Curve */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6 ">
                <h2 className="text-xl font-bold text-gray-800">
                  Equity Curve
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsDaily(true)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isDaily
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setIsDaily(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      !isDaily
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="h-[400px]">
                <Line data={chartData} options={commonOptions} />
              </div>
            </div>

            {/* Trading Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Risk to Reward */}
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500">Risk/Reward</p>
                <p className="text-xl font-bold mt-1">
                  {stats?.riskToRewardRatio?.toFixed(2) || "0.00"}
                </p>
              </div>

              {/* Highest Win */}
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500">Highest Win</p>
                <p className="text-xl font-bold mt-1 text-green-600">
                  ${stats?.highestWinTrade?.toFixed(2) || "0.00"}
                </p>
              </div>

              {/* Highest Loss */}
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500">Highest Loss</p>
                <p className="text-xl font-bold mt-1 text-red-600">
                  ${stats?.highestLossTrade?.toFixed(2) || "0.00"}
                </p>
              </div>

              {/* Total Currencies */}
              <div className="bg-white rounded-xl p-4 shadow-sm  hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500">Total Currencies</p>
                <p className="text-xl font-bold mt-1">
                  {stats?.totalCurrencyPairsCount || "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Stats */}
          <div className="space-y-6">
            {/* Most Profitable Strategy */}
            {stats?.mostProfitableStrategy && (
              <div className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Top Strategy
                  </h3>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-gray-800">
                    {stats.mostProfitableStrategy.strategy?.name}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${stats.mostProfitableStrategy.totalProfit.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Win/Loss Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Win/Loss Distribution
              </h2>
              <div className="h-[300px]">
                {wlData ? <Doughnut data={wlData} /> : <p>Loading...</p>}
              </div>
            </div>

            {/* Average Holding Period */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Holding Period
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggle("days")}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      isDays
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Days
                  </button>
                  <button
                    onClick={() => handleToggle("minutes")}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      !isDays
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Minutes
                  </button>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {isDays
                  ? `${((stats?.averageHoldingPeriod ?? 0) / 24 / 60).toFixed(1)} Days`
                  : `${stats?.averageHoldingPeriod} Minutes`}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  This Month's
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Revenge Trading Days</p>
                  <p className="text-lg font-bold text-gray-800">
                    {stats?.totalAlertsThisMonth?.revengeTradeDays || 0}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">FOMO Trades</p>
                  <p className="text-lg font-bold text-gray-800">
                    {stats?.totalAlertsThisMonth?.fomo || 0}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Over Trading Days</p>
                  <p className="text-lg font-bold text-gray-800">
                    {stats?.totalAlertsThisMonth?.overTradeDays || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
