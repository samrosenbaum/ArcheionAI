import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function Logo({ className = '', size = 'md', showIcon = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-2 font-bold text-gray-900 ${sizeClasses[size]} ${className}`}>
      {showIcon && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
      )}
      <span>
        <span className="text-blue-600">A</span>rcheion
      </span>
    </div>
  )
}
