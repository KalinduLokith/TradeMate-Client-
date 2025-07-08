import MUIDataTable, { MUIDataTableColumnDef } from "mui-datatables";
import { Chip, createTheme, ThemeProvider } from "@mui/material";
import { CurrencyDto } from "../types/CurrencyDto";
import { StrategyDto } from "../types/StrategyDto";
import { Pencil, Trash } from "lucide-react";
import { Trade } from "../types/TradeDto.ts";
import APIClient from "../util/APIClient.ts";
import { toast } from "react-toastify";

export interface TradeTableData {
  id: number;
  openDate: string;
  closeDate: string;
  currencyPairId: number;
  currencyPair: CurrencyDto;
  strategyId: number;
  strategy: StrategyDto;
  status: "win" | "loss";
  type: "buy" | "sell";
  duration: number;
  entryPrice: number;
  exitPrice: number;
  positionSize: number | null;
  marketTrend: string;
  stopLossPrice: number;
  takeProfitPrice: number;
  transactionCost: number;
  reason: string;
  comment: string | null;
  tradeCategories: string[] | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  profit: number;
}

interface TradeJournalTableProps {
  tradeData: TradeTableData[];
  openTradeForm: () => void;
  // onCloseTradeForm: () => void;
  handleSelectedData: (data: Trade | null) => void;
  getAllTradesByUser: () => void;
}

const TradeJournalTable = ({
  tradeData,
  handleSelectedData,
  openTradeForm,
  getAllTradesByUser,
  // onCloseTradeForm,
}: TradeJournalTableProps) => {
  function deleteTrade(id: number | undefined) {
    // console.log("Delete trade with id: ", id);
    APIClient.delete(`/trades/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.data.success) {
          toast.success("Trade deleted successfully.");
          getAllTradesByUser();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error deleting trade.");
      });
  }

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "openDate",
      label: "Open",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value: string) => (
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
      label: "Close",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value: string) => (
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
        customBodyRender: (value: string) => (
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
    {
      name: "type",
      label: "Trade Type",
      options: {
        filter: true,
        customBodyRender: (value: string) => (
          <Chip
            label={value.toUpperCase()}
            style={{
              borderRadius: "0.5rem",
              backgroundColor: value === "buy" ? "#79D7BE" : "#FF5C5C",
              fontWeight: "bold",
            }}
          />
        ),
      },
    },
    {
      name: "currencyPair",
      label: "Currency",
      options: {
        filter: true,
        customBodyRender: (value: any) => (
          <Chip
            label={`${value.from} / ${value.to}`}
            style={{
              borderRadius: "0.5rem",
              fontWeight: "bold",
            }}
          />
        ),
        filterType: "dropdown",
        filterOptions: {
          names: tradeData
            .map(
              (trade) => trade.currencyPair.from + "/" + trade.currencyPair.to
            )
            .filter((value, index, self) => self.indexOf(value) === index),
          logic: (value: any, filterVal: any) => {
            // console.log(value.from, filterVal);

            return value.from + "/" + value.to !== filterVal[0];
          },
        },
      },
    },
    {
      name: "entryPrice",
      label: "Entry",
      options: { filter: false },
    },
    {
      name: "exitPrice",
      label: "Exit",
      options: { filter: false },
    },
    {
      name: "positionSize",
      label: "Position Size",
      options: { filter: false },
    },
    {
      name: "strategy",
      label: "Strategy",
      options: {
        filter: true,
        customBodyRender: (value: any) => (
          <Chip
            label={value?.name || "No Strategy"}
            style={{
              borderRadius: "0.5rem",
              fontWeight: "bold",
            }}
          />
        ),
        filterType: "dropdown",
        filterOptions: {
          names: tradeData
            .map((trade) => trade.strategy?.name)
            .filter((value, index, self) => self.indexOf(value) === index),
          logic: (value: any, filterVal: any) => {
            return value?.name !== filterVal[0];
          },
        },
      },
    },
    {
      name: "marketTrend",
      label: "Market Trend",
      options: { filter: true },
    },
    {
      name: "stopLossPrice",
      label: "Stop Loss",
      options: { filter: false },
    },
    {
      name: "takeProfitPrice",
      label: "Take Profit",
      options: { filter: false },
    },
    {
      name: "transactionCost",
      label: "Cost",
      options: { filter: false },
    },
    {
      name: "profit",
      label: "Profit",
      options: { filter: false },
    },
    {
      name: "comment",
      label: "Comment",
      options: { filter: false },
    },
    {
      name: "option",
      label: "Option   ",
      // center
      options: {
        filter: false,
        customBodyRender: (_value, tableMeta) => {
          const data = tradeData[tableMeta.rowIndex];
          const trade: Trade = { ...data };
          return (
            <div className="grid grid-cols-2 min-w-20 gap-2 px-2">
              <button
                className="bg-green-50  text-green-600 p-2 rounded-full hover:bg-green-100 hover:text-green-800 transition-colors"
                aria-label="Edit"
                onClick={() => {
                  handleSelectedData(trade);
                  openTradeForm();
                }}
              >
                <Pencil size={15} strokeWidth={2} />
              </button>

              <button
                className="bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-100 hover:text-red-800 transition-colors"
                aria-label="Delete"
                onClick={() => deleteTrade(trade.id)}
              >
                <Trash size={15} strokeWidth={2} />
              </button>
            </div>
          );
        },
      },
    },
  ];

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiTableHead: {
          styleOverrides: {
            root: {
              backgroundColor: "#3f51b5",
              "& th": {
                color: "black",
                fontWeight: "bold",
                fontSize: "1rem",
              },
            },
          },
        },
        MuiTableBody: {
          styleOverrides: {
            root: {
              "& td": {
                fontSize: "0.9rem",
              },
            },
          },
        },
      },
    });
  return (
    <ThemeProvider theme={getMuiTheme()}>
      <div className="mt-4 p-2">
        <MUIDataTable
          title={"Trade Journal"}
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
            elevation: 2,
            rowsPerPage: 20,
            rowsPerPageOptions: [20, 50, 100],
            downloadOptions: { filename: "trade_journal.csv" },
            onDownload(buildHead, buildBody, columns, data) {
              // Filter out the last column (e.g., "option")
              const filteredColumns = columns.slice(0, -1); // Exclude the last column
              const transformedData = data.map((row) => {
                const rowData = [...row.data]; // Ensure rowData is an array

                // Format the currencyPair field as "USD/LKR"
                if (rowData[4] && rowData[4].from && rowData[4].to) {
                  rowData[4] = `${rowData[4].from}/${rowData[4].to}`;
                }

                // Format the strategy field
                if (rowData[8] && rowData[8].name) {
                  rowData[8] = rowData[8].name;
                } else if (rowData[8] === null) {
                  rowData[8] = "No Strategy";
                }

                // Remove the last column's data
                rowData.pop();

                return { data: rowData }; // Ensure the structure matches what buildBody expects
              });

              // Use the filtered columns and transformed data to build the CSV
              return `${buildHead(filteredColumns)}${buildBody(transformedData)}`.trim();
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default TradeJournalTable;
