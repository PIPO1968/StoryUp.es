import * as React from 'react'

export interface ToastProps {
    id?: string
    title?: string
    description?: string
    variant?: 'default' | 'destructive'
    action?: React.ReactElement
}

export type ToastActionElement = React.ReactElement<{
    altText: string
}>

export interface Toast extends ToastProps {
    id: string
    title?: string
    description?: string
    action?: ToastActionElement
}

// Componente básico de Toast
export const Toast: React.FC<ToastProps> = ({ title, description, variant = 'default' }) => {
    const baseClasses = 'fixed top-4 right-4 p-4 rounded-md shadow-lg max-w-md z-50'
    const variantClasses = variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-white border text-gray-900'

    return (
        <div className={`${baseClasses} ${variantClasses}`}>
            {title && <div className="font-semibold mb-1">{title}</div>}
            {description && <div className="text-sm">{description}</div>}
        </div>
    )
}