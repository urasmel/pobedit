import { create } from "zustand";

const useSelectedUser = create<{ selectedUser: string }>((set) => ({
    selectedUser: "",
    setSelectedUser: (data) => {
        set((state: { selectedUser: string }) => ({ selectedUser: data }));
    },
}));

export default useSelectedUser;
