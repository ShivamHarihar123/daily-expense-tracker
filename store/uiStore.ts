import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface UIState {
    theme: Theme;
    sidebarOpen: boolean;
    modalOpen: boolean;
    modalContent: React.ReactNode | null;

    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            theme: 'dark',
            sidebarOpen: true,
            modalOpen: false,
            modalContent: null,

            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'light' ? 'dark' : 'light',
                })),

            setTheme: (theme) =>
                set({
                    theme,
                }),

            toggleSidebar: () =>
                set((state) => ({
                    sidebarOpen: !state.sidebarOpen,
                })),

            setSidebarOpen: (open) =>
                set({
                    sidebarOpen: open,
                }),

            openModal: (content) =>
                set({
                    modalOpen: true,
                    modalContent: content,
                }),

            closeModal: () =>
                set({
                    modalOpen: false,
                    modalContent: null,
                }),
        }),
        {
            name: 'ui-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                theme: state.theme,
                sidebarOpen: state.sidebarOpen,
            }),
        }
    )
);
