export default function Avatar({ name = 'User', avatar = 'initials', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const avatarOptions = {
    initials: (
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full flex items-center justify-center
          bg-gradient-to-br from-primary-500 to-primary-700
          text-white font-semibold
        `}
      >
        {initials}
      </div>
    ),
    emoji1: (
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-lg`}>
        😊
      </div>
    ),
    emoji2: (
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-lg`}>
        🎯
      </div>
    ),
    emoji3: (
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 text-lg`}>
        💎
      </div>
    ),
  }

  return avatarOptions[avatar] || avatarOptions.initials
}
