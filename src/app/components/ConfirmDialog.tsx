type Props = {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }: Props) {
  if (!open) return null
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div role="dialog" aria-modal="true" style={{background:'#fff', color:'#000', borderRadius:12, width:'min(560px,96vw)'}}>
        <div style={{padding:16, borderBottom:'1px solid #000', fontWeight:600}}>{title}</div>
        <div style={{padding:16}}>{message}</div>
        <div style={{display:'flex', gap:8, padding:16, justifyContent:'flex-end'}}>
          <button onClick={onCancel} style={{background:'#fff', color:'#000', border:'1px solid #000', borderRadius:8, padding:'14px 16px', minHeight:56}}>{cancelText}</button>
          <button onClick={onConfirm} style={{background:'#000', color:'#fff', borderRadius:8, padding:'14px 16px', minHeight:56}}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}

