// src/pages/user/created.tsx
import Creations from "@/components/user/components/creations-layout";
import React from "react";

const CreatedPage: React.FC = () => {
  return <Creations userSpecific={true} title="Created Clips" />;
};

export default CreatedPage;
