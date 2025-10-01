import * as React from 'react'

interface SeparatorProps {
    orientation?: 'horizontal' | 'vertical'
    className?: string
}

export const Separator: React.FC<SeparatorProps> = ({
    orientation = 'horizontal',
    className = ''
}) => {
    const orientationClasses = orientation === 'horizontal'
        ? 'w-full h-px'
        : 'h-full w-px'

    return (
        <div
            className={`bg-gray-200 ${orientationClasses} ${className}`}
            style={{
                backgroundColor: '#e5e7eb',
                ...(orientation === 'horizontal' ? { width: '100%', height: '1px' } : { height: '100%', width: '1px' })
            }}
        />
    )
}