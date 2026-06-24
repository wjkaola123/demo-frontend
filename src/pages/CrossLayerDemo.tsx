import { useState, useEffect } from 'react'
import { AppProvider, useAppContext } from '../lib/context'
import { bus } from '../lib/event-bus'

function Layer1() {
  const { state, setMessage, increment } = useAppContext()
  const [received, setReceived] = useState('')

  useEffect(() => {
    return bus.on('layer3-to-1', (data) => {
      setReceived(data as string)
    })
  }, [])

  const sendToLayer3 = () => {
    bus.emit('layer1-to-3', `Layer1 says: ${Date.now()}`)
  }

  return (
    <div className="border-2 border-red-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2">Layer 1 (顶层)</h2>
      <p>Context message: {state.message}</p>
      <p>Context count: {state.count}</p>
      <p>Event Bus received: {received || '(none)'}</p>
      <div className="flex gap-2 mt-2 flex-wrap">
        <input
          className="border rounded px-2 py-1"
          value={state.message}
          onChange={e => setMessage(e.target.value)}
        />
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={increment}>+1</button>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={sendToLayer3}>Send to Layer 3</button>
      </div>
    </div>
  )
}

function Layer2() {
  const ctx = useAppContext()

  return (
    <div className="border-2 border-green-400 rounded-lg p-4 my-2">
      <h2 className="font-bold text-lg mb-2">Layer 2 (中间层)</h2>
      <p className="mb-2">
        Context count (read only, no write): <span className="font-mono">{ctx.state.count}</span>
      </p>
      <Layer3 />
    </div>
  )
}

function Layer3() {
  const { state, increment } = useAppContext()
  const [received, setReceived] = useState('')

  useEffect(() => {
    return bus.on('layer1-to-3', (data) => {
      setReceived(data as string)
    })
  }, [])

  const sendToLayer1 = () => {
    bus.emit('layer3-to-1', `Layer3 says: ${Date.now()}`)
  }

  return (
    <div className="border-2 border-blue-400 rounded-lg p-4 mt-2">
      <h2 className="font-bold text-lg mb-2">Layer 3 (深层)</h2>
      <p>Context message (from Layer 1): {state.message}</p>
      <p>Context count (shared): {state.count}</p>
      <p>Event Bus received: {received || '(none)'}</p>
      <button className="bg-blue-500 text-white px-3 py-1 rounded mt-2" onClick={() => { increment(); sendToLayer1() }}>
        Increment & Send to Layer 1
      </button>
    </div>
  )
}

export default function CrossLayerDemo() {
  return (
    <AppProvider>
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">跨层传递数据 Demo</h1>
        <p className="text-gray-500 mb-4">
          Layer 1 ↔ Layer 3 直接通信，中间 Layer 2 不感知传递过程
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <Layer1 />
          <Layer2 />
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p className="font-semibold mb-1">两种跨层通信方式:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong>React Context</strong> — Layer 1 写入数据，Layer 2 和 Layer 3 直接消费，
              无需逐层 props 传递
            </li>
            <li>
              <strong>Event Bus</strong> — 任意两层通过发布/订阅直接通信，完全解耦
              (发布者不关心谁在订阅)
            </li>
          </ul>
        </div>
      </div>
    </AppProvider>
  )
}
