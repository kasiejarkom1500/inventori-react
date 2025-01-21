import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext<{
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
} | null>(null);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <DialogContext.Provider value={{ isDialogOpen, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
