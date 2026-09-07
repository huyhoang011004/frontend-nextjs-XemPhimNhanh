import { create } from 'zustand';

interface SidebarState {
  isExpanded: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  isMobileOpen: false,
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  toggleMobileSidebar: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  closeMobileSidebar: () => set({ isMobileOpen: false }),
}));
