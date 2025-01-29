import { create } from "zustand";

export type ModalTypes = "create-servers";

interface ModalStore {
  type: ModalTypes | null;
  isOpen: boolean;
  onOpen: (type: ModalTypes) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen(type) {
    set({ isOpen: true, type });
  },
  onClose() {
    set({ isOpen: false, type: null });
  },
}));
