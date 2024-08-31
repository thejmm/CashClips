// src/components/user/dashboard.tsx

import React from "react";
import { User } from "@supabase/supabase-js";

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to Your Dashboard, {user.email}
      </h1>
      <p>
        This is a blank dashboard page. You can start adding your components
        here.
      </p>
    </div>
  );
};

export default Dashboard;
