import * as React from "react";

const PortalCtx = React.createContext<HTMLElement | null>(null);
export const usePortalContainer = () => React.useContext(PortalCtx);

export function PortalProvider({ container, children }: { container: HTMLElement; children: React.ReactNode }) {
  return <PortalCtx.Provider value={container}>{children}</PortalCtx.Provider>;
}