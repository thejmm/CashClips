import Creations from "@/components/user/components/creations-layout";
// src/pages/all-creations.tsx
import React from "react";

const AllCreationsPage: React.FC = () => {
  return <Creations userSpecific={false} title="All Creations" />;
};

export default AllCreationsPage;
