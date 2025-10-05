import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const isStandalone = () => (window.matchMedia('(display-mode: standalone)').matches) || (navigator as any).standalone === true
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)
const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    if (!isStandalone() && isIOS() && isSafari()) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const onInstall = async () => {
    if (deferred) {
      await deferred.prompt()
      const choice = await deferred.userChoice
      if (choice.outcome === 'accepted') setVisible(false)
      setDeferred(null)
    }
  }

  return (
    <div style={{position:'fixed', bottom: 12, left: 12, right: 12, background:'#000', color:'#fff', padding:12, borderRadius:12}}>
      {isIOS() ? (
        <div>
          <strong>Install EverallFarm_Lite</strong>
          <div style={{opacity:0.85, marginTop:4}}>Open the Share menu and tap “Add to Home Screen”.</div>
        </div>
      ) : deferred ? (
        <div>
          <strong>Install EverallFarm_Lite</strong>
          <div style={{opacity:0.85, marginTop:4}}>Get the app on your home screen.</div>
        </div>
      ) : null}
      <div style={{display:'flex', gap:8, marginTop:8}}>
        {!isIOS() && deferred && (
          <button onClick={onInstall} style={{background:'#fff', color:'#000', borderRadius:8, padding:'12px 16px', minHeight:72}}>Install</button>
        )}
        <button onClick={() => setVisible(false)} style={{background:'#fff', color:'#000', borderRadius:8, padding:'12px 16px', minHeight:72}}>Dismiss</button>
      </div>
    </div>
  )
}

