import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import { Edit } from "lucide-react";
import { UserDto } from "../../types/UserDto.ts";
import { CurrencyPairView } from "../currencypair/CurrencyPairView.tsx";
import { UpdateUserForm } from "../../components/form/UserForm.tsx";
import APIClient from "../../util/APIClient.ts";

export const UserSettingsView: React.FC = () => {
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
    initial_capital: 0.0,
  });
  // const [date, setDate] = useState<string>(new Date().toLocaleString());
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Load user details from API
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

  // Update the displayed date every second
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     // setDate(new Date().toLocaleString());
  //   }, 1000);
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <div className="m-2 grid lg:grid-cols-4  rounded bg-gray-50/50 min-h-screen ">
      {/* Sidebar */}
      <aside className="w-full  sm:my-4 lg:w-[300px] border-b lg:border-b-0 bg-white p-6 shadow-lg">
        {/* User Info */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 bg-blue-500">AB</Avatar>
            <div>
              {user && user.firstName && user.lastName ? (
                <h1 className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </h1>
              ) : (
                <h1 className="text-lg font-semibold">N/A</h1>
              )}
              <p className="text-gray-600 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Total Profit 
        <div className="mb-6 border rounded p-4 bg-gray-50 shadow-sm">
          <h1 className="text-sm font-semibold text-gray-500 tracking-wide">
            Total Profit
          </h1>
          <h1 className="font-semibold text-2xl text-blue-600">
            12.395769 BTC
          </h1>
          <p className="text-gray-600 text-sm">{date}</p>
        </div>
*/}
        {/* Currency Pair View */}
        <div className="mb-6 border rounded p-4 bg-gray-50 shadow-sm">
          <CurrencyPairView />
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-6 sm:my-4 lg:px-8 lg:col-span-3 bg-white shadow-lg rounded">
        {/* Personal Information */}
        <section className="max-w-5xl mb-6">
          <header className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold  pb-2 tracking-wide">
              User Personal Details
            </h2>
            <IconButton color="primary" onClick={() => setModalOpen(true)}>
              <Edit />
            </IconButton>
          </header>

          <div className="">
            {/* Personal Details */}
            <section className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "First Name", value: user.firstName },
                  { label: "Last Name", value: user.lastName },
                  {
                    label: "Birthday",
                    value: user.dateOfBirth?.toString().split("T")[0],
                  },
                  { label: "Gender", value: user.gender },
                ].map((item, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold">{item.label}</h3>
                    <p className="text-gray-700 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Details */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold border-b pb-2 mb-4 tracking-wide">
                Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Email", value: user.email },
                  { label: "Mobile", value: user.mobile },
                ].map((item, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold">{item.label}</h3>
                    <p className="text-gray-700 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Address */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold border-b pb-2 mb-4 tracking-wide">
                Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Address Line 1", value: user.addressLine1 },
                  { label: "Address Line 2", value: user.addressLine2 },
                  { label: "City", value: user.city },
                  { label: "Postal Code", value: user.postalCode },
                  { label: "Country", value: user.country },
                ].map((item, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold">{item.label}</h3>
                    <p className="text-gray-700 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        {/* Update User Modal */}
        <UpdateUserForm
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={user}
          refresh={loadUserDetails}
        />
      </main>
    </div>
  );
};
