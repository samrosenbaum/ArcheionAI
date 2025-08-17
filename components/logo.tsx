import React from 'react'
import Link from 'next/link'

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
    <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
      <div className={`flex items-center space-x-2 font-bold text-slate-900 ${sizeClasses[size]} ${className}`}>
        {showIcon && (
          <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
        )}
        <span>
          <span className="text-slate-600">A</span>rcheion
        </span>
      </div>
    </Link>
  )
}
