import { useState, useTransition, type ChangeEvent } from 'react'

interface Item {
  id: number
  name: string
  category: string
  tags: string[]
}

const ITEM_COUNT = 15000

function generateItems(): Item[] {
  const cats = ['电子产品', '家居用品', '服装', '食品', '运动器材', '图书', '玩具', '美妆']
  const adjs = ['新款', '经典', '超值', '精品', '热销', '旗舰', '轻量', '专业', '便携', '智能']
  const nouns = ['笔记本电脑', '耳机', '键盘', '鼠标', '显示器', '手机', '平板', '手表',
    '椅子', '台灯', '收纳盒', '书架', '水杯', '背包', '钱包', 'T恤', '运动鞋', '夹克',
    '巧克力', '茶叶', '咖啡', '瑜伽垫', '哑铃', '跳绳', '编程书', '拼图', '积木', '面膜']

  return Array.from({ length: ITEM_COUNT }, (_, i) => ({
    id: i + 1,
    name: `${adjs[i % adjs.length]}${nouns[i % nouns.length]}${i + 1}`,
    category: cats[i % cats.length],
    tags: ['tag' + (i % 20), 'tag' + (i % 7)].filter((v, idx, a) => a.indexOf(v) === idx),
  }))
}

const allItems = generateItems()

function filterItems(items: Item[], query: string): Item[] {
  if (!query.trim()) return items
  const q = query.toLowerCase()
  return items.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.tags.some(t => t.includes(q))
  )
}

function ItemList({ items, query }: { items: Item[]; query?: string }) {
  const emptyQuery = !query?.trim()
  const displayItems = emptyQuery && items.length > 200 ? items.slice(0, 50) : items

  return (
    <div>
      <ul className="divide-y divide-border text-sm max-h-[500px] overflow-y-auto border rounded">
        {displayItems.map(item => (
          <li key={item.id} className="px-3 py-2 hover:bg-muted/50 flex justify-between">
            <span>{item.name}</span>
            <span className="text-muted-foreground text-xs">{item.category}</span>
          </li>
        ))}
      </ul>
      {emptyQuery && items.length > 200 && (
        <p className="text-xs text-muted-foreground mt-1">
          显示前 50 条，共 {items.length} 条。输入关键词搜索全部数据。
        </p>
      )}
    </div>
  )
}

function WithoutTransition() {
  const [query, setQuery] = useState('')

  const filtered = filterItems(allItems, query)

  return (
    <div className="border-2 border-red-300 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">不使用 useTransition</h2>
      <input
        className="border rounded px-3 py-2 text-base"
        placeholder="输入关键词搜索 15000 条数据..."
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>匹配结果: {filtered.length} 条</span>
      </div>
      <ItemList items={filtered} query={query} />
    </div>
  )
}

function WithTransition() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = filterItems(allItems, query)

  return (
    <div className="border-2 border-green-400 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">使用 useTransition</h2>
      <input
        className="border rounded px-3 py-2 text-base"
        placeholder="输入关键词搜索 15000 条数据..."
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          startTransition(() => setQuery(e.target.value))
        }}
      />
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">匹配结果: {filtered.length} 条</span>
        {isPending && (
          <span className="text-green-600 font-semibold animate-pulse">
            更新中...
          </span>
        )}
      </div>
      <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <ItemList items={filtered} query={query} />
      </div>
    </div>
  )
}

export default function TransitionDemo() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">React useTransition Demo</h1>
      <p className="text-muted-foreground mb-6">
        useTransition 将状态更新标记为低优先级，不会阻塞用户输入等高优先级更新
      </p>

      <div className="mb-6 p-4 bg-muted border border-border rounded text-sm">
        <p className="font-semibold mb-1">操作说明：</p>
        <p>在两边的搜索框中快速输入文字，观察左侧输入框的卡顿感与右侧的流畅度差异。
        右侧的列表在输入时会变半透明并显示「更新中...」，说明列表渲染被降级为 Transition。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WithoutTransition />
        <WithTransition />
      </div>

      <div className="mt-6 p-4 bg-muted rounded text-sm">
        <p className="font-semibold mb-1">useTransition 要点:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>返回 <code className="bg-muted px-1 rounded">[isPending, startTransition]</code></li>
          <li>将 <code className="bg-muted px-1 rounded">startTransition</code> 内的状态更新标记为低优先级</li>
          <li>高优先级更新（如输入框）可打断 Transition 渲染，保持界面流畅</li>
          <li><code className="bg-muted px-1 rounded">isPending</code> 指示 Transition 是否仍在进行，可用于展示加载状态</li>
          <li>适用于大数据量过滤、复杂列表渲染等耗时操作</li>
        </ul>
      </div>
    </div>
  )
}
