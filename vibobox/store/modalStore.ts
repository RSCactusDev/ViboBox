// store/modalStore.ts
import { create } from 'zustand';

interface ModalStore {
  isLoginOpen: boolean;
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
  failedMessage: string | null;
  setFailedMessage: (message: string | null) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isLoginOpen: false,
  successMessage: null,
  setSuccessMessage: (message) => set({ successMessage: message }),
  failedMessage: null,
  setFailedMessage: (message) => set({ failedMessage: message }),
  openLoginModal: () => set({ isLoginOpen: true }),
  closeLoginModal: () => set({ isLoginOpen: false }),
  
}));

