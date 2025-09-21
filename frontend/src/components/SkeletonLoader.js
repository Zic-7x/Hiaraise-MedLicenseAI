import React from 'react';

// Base skeleton component with shimmer effect
const SkeletonBase = ({ className = '', children, ...props }) => (
  <div 
    className={`animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Individual skeleton components
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase 
        key={i}
        className={`h-4 rounded ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonBase className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <SkeletonBase className="h-4 w-3/4 rounded mb-2" />
        <SkeletonBase className="h-3 w-1/2 rounded" />
      </div>
    </div>
    <SkeletonBase className="h-8 w-1/3 rounded mb-2" />
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonStatsCard = ({ className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl ${className}`}>
    <div className="flex items-center justify-between mb-2">
      <SkeletonBase className="h-4 w-24 rounded" />
      <SkeletonBase className="w-8 h-8 rounded-lg" />
    </div>
    <SkeletonBase className="h-8 w-16 rounded" />
  </div>
);

export const SkeletonButton = ({ className = '' }) => (
  <SkeletonBase className={`h-12 w-32 rounded-xl ${className}`} />
);

export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  
  return (
    <SkeletonBase className={`${sizeClasses[size]} rounded-full ${className}`} />
  );
};

export const SkeletonTable = ({ rows = 3, columns = 4, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonBase 
            key={colIndex}
            className={`h-4 rounded ${
              colIndex === 0 ? 'w-1/3' : 
              colIndex === columns - 1 ? 'w-1/4' : 'w-1/2'
            }`}
          />
        ))}
      </div>
    ))}
  </div>
);

// Dashboard-specific skeleton components
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
    </div>

    {/* Floating Particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        ></div>
      ))}
    </div>

    <div className="relative z-10 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Welcome Section Skeleton */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-x"></div>
          <div className="relative z-10">
            <SkeletonBase className="h-8 w-64 rounded mb-4" />
            <SkeletonBase className="h-6 w-96 rounded" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonStatsCard key={i} />
          ))}
        </div>

        {/* Recent Cases Skeleton */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <SkeletonBase className="h-6 w-32 rounded" />
              <SkeletonBase className="h-4 w-20 rounded" />
            </div>
            <div className="flex items-center space-x-3">
              <SkeletonBase className="h-10 w-32 rounded-lg" />
              <SkeletonBase className="w-4 h-4 rounded" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <SkeletonBase className="w-12 h-12 rounded-xl" />
                    <div>
                      <SkeletonBase className="h-5 w-32 rounded mb-2" />
                      <SkeletonBase className="h-4 w-24 rounded" />
                    </div>
                  </div>
                  <SkeletonBase className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Notifications and AI Assistant Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications Skeleton */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <SkeletonBase className="h-6 w-32 rounded" />
                <SkeletonBase className="w-3 h-3 rounded-full" />
              </div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <SkeletonBase className="w-5 h-5 rounded mt-1" />
                    <div className="flex-1">
                      <SkeletonBase className="h-4 w-full rounded mb-2" />
                      <SkeletonBase className="h-3 w-24 rounded" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <SkeletonBase className="w-4 h-4 rounded" />
                      <SkeletonBase className="w-4 h-4 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Skeleton */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SkeletonAvatar size="lg" />
                <div>
                  <SkeletonBase className="h-5 w-32 rounded mb-2" />
                  <SkeletonBase className="h-4 w-48 rounded" />
                </div>
              </div>
              <SkeletonButton />
            </div>
          </div>
        </div>

        {/* Appointments Section Skeleton */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <SkeletonBase className="w-6 h-6 rounded" />
              <SkeletonBase className="h-6 w-40 rounded" />
            </div>
            <div className="flex items-center space-x-3">
              <SkeletonBase className="h-4 w-16 rounded" />
              <SkeletonBase className="w-5 h-5 rounded" />
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="text-center py-8">
              <SkeletonBase className="w-12 h-12 rounded mx-auto mb-4" />
              <SkeletonBase className="h-4 w-32 rounded mx-auto mb-4" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SkeletonButton className="h-12 w-48" />
                <SkeletonButton className="h-12 w-48" />
                <SkeletonButton className="h-12 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Add shimmer animation to global CSS
export const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

export default DashboardSkeleton;
