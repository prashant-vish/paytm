import React from "react";
import Appbar from "../components/Appbar";
import Balance from "../components/Balance";
import { Users } from "../components/Users";

const Dashboard = () => {
  return (
    <>
      <Appbar />
      <Balance />
      <Users />
    </>
  );
};

export default Dashboard;
