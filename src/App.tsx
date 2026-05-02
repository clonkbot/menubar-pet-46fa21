import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
import { formatEther } from 'viem'

type PetMood = 'idle' | 'happy' | 'sleeping' | 'excited' | 'hungry'
type PetAction = 'pet' | 'feed' | 'play'

function Pet({ mood, onClick }: { mood: PetMood; onClick: () => void }) {
  const [frame, setFrame] = useState(0)
  const [isJumping, setIsJumping] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 2)
    }, mood === 'sleeping' ? 1000 : 500)
    return () => clearInterval(interval)
  }, [mood])

  const handleClick = () => {
    setIsJumping(true)
    onClick()
    setTimeout(() => setIsJumping(false), 400)
  }

  const getPetEmoji = () => {
    if (mood === 'sleeping') return frame === 0 ? '😴' : '💤'
    if (mood === 'happy') return frame === 0 ? '🐱' : '😸'
    if (mood === 'excited') return frame === 0 ? '😻' : '🙀'
    if (mood === 'hungry') return frame === 0 ? '🐱' : '😿'
    return frame === 0 ? '🐱' : '😺'
  }

  return (
    <div
      onClick={handleClick}
      className={`
        cursor-pointer select-none transition-all duration-200
        hover:scale-110 active:scale-95
        ${isJumping ? 'animate-bounce' : ''}
      `}
      style={{
        fontSize: 'clamp(4rem, 15vw, 8rem)',
        filter: mood === 'sleeping' ? 'brightness(0.8)' : 'none',
        textShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}
    >
      {getPetEmoji()}
    </div>
  )
}

function StatusBar({ mood, happiness, energy }: { mood: PetMood; happiness: number; energy: number }) {
  return (
    <div className="w-full max-w-xs space-y-2 md:space-y-3">
      <div className="flex items-center gap-2 md:gap-3">
        <span className="text-xs md:text-sm font-medium text-amber-700 w-16 md:w-20">Happiness</span>
        <div className="flex-1 h-2.5 md:h-3 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${happiness}%` }}
          />
        </div>
        <span className="text-xs font-bold text-amber-600 w-8 text-right">{happiness}%</span>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <span className="text-xs md:text-sm font-medium text-purple-700 w-16 md:w-20">Energy</span>
        <div className="flex-1 h-2.5 md:h-3 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${energy}%` }}
          />
        </div>
        <span className="text-xs font-bold text-purple-600 w-8 text-right">{energy}%</span>
      </div>
      <div className="text-center pt-1 md:pt-2">
        <span className="text-xs md:text-sm font-medium px-3 py-1 rounded-full bg-white/60 text-gray-600 capitalize">
          {mood === 'idle' ? '😊 Chillin\'' :
           mood === 'happy' ? '💖 Happy!' :
           mood === 'sleeping' ? '💤 Zzz...' :
           mood === 'excited' ? '✨ Excited!' : '🍽️ Hungry...'}
        </span>
      </div>
    </div>
  )
}

function ActionButtons({ onAction, disabled }: { onAction: (action: PetAction) => void; disabled: boolean }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      <button
        onClick={() => onAction('pet')}
        disabled={disabled}
        className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl md:rounded-2xl font-bold text-sm md:text-base shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🤚 Pet
      </button>
      <button
        onClick={() => onAction('feed')}
        disabled={disabled}
        className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl md:rounded-2xl font-bold text-sm md:text-base shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🍎 Feed
      </button>
      <button
        onClick={() => onAction('play')}
        disabled={disabled}
        className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-violet-400 to-purple-400 text-white rounded-xl md:rounded-2xl font-bold text-sm md:text-base shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🎾 Play
      </button>
    </div>
  )
}

function WalletInfo() {
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
  const formattedBalance = balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0'

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/50 shadow-inner">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs md:text-sm font-mono text-gray-600">{truncatedAddress}</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-sm md:text-lg font-bold text-gray-800">{formattedBalance}</span>
          <span className="text-xs md:text-sm text-gray-500">ETH</span>
        </div>
      </div>
    </div>
  )
}

function ConnectedApp() {
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })

  const [happiness, setHappiness] = useState(70)
  const [energy, setEnergy] = useState(80)
  const [mood, setMood] = useState<PetMood>('idle')
  const [message, setMessage] = useState('')

  const showMessage = useCallback((msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 2000)
  }, [])

  // Update mood based on stats
  useEffect(() => {
    if (energy < 20) {
      setMood('sleeping')
    } else if (happiness < 30) {
      setMood('hungry')
    } else if (happiness > 80 && energy > 60) {
      setMood('excited')
    } else if (happiness > 60) {
      setMood('happy')
    } else {
      setMood('idle')
    }
  }, [happiness, energy])

  // Decay stats over time
  useEffect(() => {
    const interval = setInterval(() => {
      setHappiness(h => Math.max(0, h - 1))
      setEnergy(e => Math.max(0, e - 0.5))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // React to balance changes
  useEffect(() => {
    if (balance && parseFloat(formatEther(balance.value)) > 0.01) {
      setMood('excited')
      showMessage('Your pet loves your ETH! 💎')
    }
  }, [balance, showMessage])

  const handleAction = (action: PetAction) => {
    switch (action) {
      case 'pet':
        setHappiness(h => Math.min(100, h + 15))
        showMessage('Purrrr... 😻')
        break
      case 'feed':
        setHappiness(h => Math.min(100, h + 10))
        setEnergy(e => Math.min(100, e + 20))
        showMessage('Yummy! 😋')
        break
      case 'play':
        setHappiness(h => Math.min(100, h + 25))
        setEnergy(e => Math.max(0, e - 15))
        showMessage('So fun! 🎉')
        break
    }
  }

  const handlePetClick = () => {
    setHappiness(h => Math.min(100, h + 5))
    showMessage(['Meow!', 'Purr~', '*nuzzle*', '💕'][Math.floor(Math.random() * 4)])
  }

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-md px-4">
      <WalletInfo />

      <div className="relative">
        <Pet mood={mood} onClick={handlePetClick} />
        {message && (
          <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold text-gray-700 shadow-lg animate-fade-in whitespace-nowrap">
            {message}
          </div>
        )}
      </div>

      <StatusBar mood={mood} happiness={happiness} energy={energy} />
      <ActionButtons onAction={handleAction} disabled={mood === 'sleeping'} />

      <p className="text-xs md:text-sm text-center text-gray-500 max-w-xs px-4">
        {mood === 'sleeping'
          ? 'Shhh... your pet is resting. Wait for them to wake up!'
          : 'Click your pet or use the buttons to interact!'}
      </p>
    </div>
  )
}

function LandingPage() {
  const [bounce, setBounce] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true)
      setTimeout(() => setBounce(false), 500)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 text-center px-4 max-w-lg">
      <div
        className={`text-6xl sm:text-7xl md:text-8xl transition-transform duration-300 ${bounce ? 'scale-110' : 'scale-100'}`}
        style={{ textShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
      >
        🐱
      </div>

      <div className="space-y-3 md:space-y-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Adopt Your On-Chain Pet
        </h2>
        <p className="text-sm md:text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
          A cute companion that lives in your browser and reacts to your wallet activity on Base!
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 md:gap-4">
        <div className="transform hover:scale-105 transition-transform">
          <ConnectButton />
        </div>
        <p className="text-xs md:text-sm text-gray-400">
          Connect your wallet to meet your new friend
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
        {[
          { emoji: '🤚', label: 'Pet' },
          { emoji: '🍎', label: 'Feed' },
          { emoji: '🎾', label: 'Play' },
        ].map(({ emoji, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 bg-white/40 rounded-xl md:rounded-2xl border border-white/50"
          >
            <span className="text-xl md:text-2xl">{emoji}</span>
            <span className="text-xs md:text-sm font-medium text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const { isConnected } = useAccount()

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #ddd6fe 100%)'
      }}
    >
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 md:w-32 h-20 md:h-32 bg-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-24 md:w-40 h-24 md:h-40 bg-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-28 md:w-48 h-28 md:h-48 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-2xl md:text-3xl">🐱</span>
          <h1
            className="text-xl md:text-2xl font-black bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'Fredoka', 'Comic Sans MS', cursive" }}
          >
            MenuBar Pet
          </h1>
        </div>
        {isConnected && (
          <div className="transform scale-90 md:scale-100">
            <ConnectButton />
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-6">
        {isConnected ? <ConnectedApp /> : <LandingPage />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 md:py-6 px-4">
        <p className="text-xs text-gray-400/80">
          Requested by <span className="font-medium">@grok</span> · Built by <span className="font-medium">@clonkbot</span>
        </p>
      </footer>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        body {
          font-family: 'Fredoka', system-ui, sans-serif;
        }
      `}</style>
    </div>
  )
}
