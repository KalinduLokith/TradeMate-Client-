import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StrategyCard } from "../../../components/card/StrategyCard.tsx";
import { StrategyForm } from "../../../components/form/StrategyForm.tsx";
import { StrategyDto } from "../../../types/StrategyDto.ts";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import APIClient from "../../../util/APIClient.ts";

export const ManageStrategyView: React.FC = () => {
  const [strategiesList, setStrategiesList] = useState<StrategyDto[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyDto | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);

  const handleEdit = (strategy: StrategyDto) => {
    setSelectedStrategy(strategy);
    setOpenModal(true);
  };

  const handleModal = (flag: boolean, strategy?: StrategyDto) => {
    setOpenModal(flag);
    setSelectedStrategy(strategy || null);
  };

  // Load all strategies
  const loadAllStrategies = () => {
    APIClient.get("/strategies/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        setStrategiesList(response.data.data);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Unknown error occurred";
        toast.error(`Failed to load strategies: ${errorMessage}`);
      });
  };

  useEffect(() => {
    loadAllStrategies();
  }, []);
  //
  // useEffect(() => {
  //   console.log(strategiesList);
  // }, [strategiesList]);

  return (
    <div className="min-h-screen py-[1vw]">
      <div className="flex items-center justify-between bg-gray-50 p-[1.5vw] rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Strategy Playbook Records
          </h1>
          <p className="text-gray-600 mt-[0.5vw]">
            Explore and choose from our curated strategies designed for all
            experience levels.
          </p>
        </div>
        <Button variant="contained" onClick={() => handleModal(true)}>
          <Plus size={16} className="mr-2" />
          New Strategy
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[2vw] py-2">
        {strategiesList &&
        Array.isArray(strategiesList) &&
        strategiesList.length > 0 ? (
          strategiesList.map((strategy) => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              loadAllStrategies={loadAllStrategies}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div className="p-2">No strategies found.</div>
        )}
      </div>

      <Dialog
        open={openModal}
        onClose={() => handleModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedStrategy ? "Edit Strategy" : "Add New Strategy"}
        </DialogTitle>
        <DialogContent>
          <StrategyForm
            strategy={selectedStrategy}
            loadAllStrategies={loadAllStrategies}
            onClose={() => handleModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
