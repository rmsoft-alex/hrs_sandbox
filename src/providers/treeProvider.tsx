"use client";

import { MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";

const TreeProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      {children}
    </DndProvider>
  );
};

export default TreeProviders;
