import { useState, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
    >
      <div className="bg-card rounded-lg shadow-xl p-6 min-w-80 max-w-md relative">
        <button
          className="absolute top-2 right-3 text-muted-foreground hover:text-muted-foreground text-xl leading-none cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}

function ModalDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-2 border-blue-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">1. createPortal 模态框</h2>
      <p className="text-sm text-muted-foreground mb-3">
        点击下方按钮打开模态框。模态框 DOM 被渲染在 <code className="bg-muted px-1 rounded">document.body</code>{' '}
        下，脱离当前组件层级，但事件（onClick）仍遵循 React 组件树冒泡。
      </p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        打开模态框
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h3 className="text-lg font-semibold mb-2">模态框标题</h3>
          <p className="text-muted-foreground text-sm mb-4">
            这个模态框通过 <code className="bg-muted px-1 rounded">createPortal</code> 渲染到
            <code className="bg-muted px-1 rounded">document.body</code> 下。
            检查 DOM 结构可以看到它不在当前组件的 DOM 嵌套中，但 React 事件系统仍能正常运作。
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="bg-muted text-muted-foreground px-3 py-1 rounded cursor-pointer hover:bg-secondary"
              onClick={() => setOpen(false)}
            >
              取消
            </button>
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-700"
              onClick={() => { alert('确认操作'); setOpen(false) }}
            >
              确认
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  const [show, setShow] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const handleMouseEnter = () => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 })
    }
    setShow(true)
  }

  return (
    <>
      <span
        ref={anchorRef}
        className="text-blue-600 underline decoration-dotted cursor-help"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      {show && createPortal(
        <div
          className="fixed z-50 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap pointer-events-none"
          style={{ top: pos.top, left: pos.left, transform: 'translateX(-50%)' }}
        >
          {content}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
        </div>,
        document.body,
      )}
    </>
  )
}

function TooltipDemo() {
  return (
    <div className="border-2 border-green-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">2. createPortal Tooltip</h2>
      <p className="text-sm text-muted-foreground mb-3">
        将 tooltip 通过 portal 渲染到 <code className="bg-muted px-1 rounded">document.body</code>，
        避免被父容器的 <code className="bg-muted px-1 rounded">overflow: hidden</code> 裁切。
      </p>
      <p className="text-sm">
        将鼠标悬停在
        <Tooltip content="这是一段通过 createPortal 渲染的提示文字">
          这段文字
        </Tooltip>
        上查看效果。即使放在带裁剪的容器中，提示框也不会被截断。
      </p>
      <div className="mt-3 overflow-hidden border border-red-300 rounded p-2 text-sm text-muted-foreground">
        ⚠️ 这个容器设置了 <code>overflow: hidden</code>，但 tooltip 依然能完整显示。
      </div>
    </div>
  )
}

export default function CreatePortalDemo() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">createPortal Demo</h1>
      <p className="text-muted-foreground mb-4">
        将子节点渲染到父组件 DOM 层级之外的指定容器中 (常用于模态框、Tooltip、全局通知等)
      </p>

      <div className="flex flex-col gap-4">
        <ModalDemo />
        <TooltipDemo />
      </div>

      <div className="mt-4 p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">createPortal 要点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>语法: <code className="bg-muted px-1 rounded">createPortal(reactNode, domNode)</code></li>
          <li>Portal 的 DOM 结构脱离父组件层级，但<strong>事件冒泡仍遵循 React 组件树</strong></li>
          <li>常用于模态框、工具提示、全局通知、悬浮菜单等需要突破 <code>overflow: hidden</code> 或 <code>z-index</code> 层叠上下文的场景</li>
          <li>Portal 内的 JSX 仍能访问父组件的 context、props、state</li>
          <li>React 18 中 portal 的 events 按照 DOM 顺序而非 React 树顺序冒泡——详见 React 18 升级说明</li>
        </ul>
      </div>
    </div>
  )
}
