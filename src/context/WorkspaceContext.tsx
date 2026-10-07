'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Organization } from '@/types';

interface WorkspaceContextType {
  role: Role;
  setRole: (role: Role) => void;
  orgSlug: string;
  orgName: string;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{
  children: React.ReactNode;
  initialRole: Role;
  orgSlug: string;
  orgName: string;
}> = ({ children, initialRole, orgSlug, orgName }) => {
  const [role, setRole] = useState<Role>(initialRole);

  return (
    <WorkspaceContext.Provider value={{ role, setRole, orgSlug, orgName }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
