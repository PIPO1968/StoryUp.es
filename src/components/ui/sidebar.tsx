import React, { createContext, useContext } from 'react'

const SidebarContext = createContext<{ collapsed: boolean; toggle: () => void } | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = React.useState(false)

    const toggle = () => setCollapsed(!collapsed)

    return (
        <SidebarContext.Provider value={{ collapsed, toggle }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}