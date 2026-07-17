import { Suspense, use, useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  bio: string
}

interface Post {
  id: number
  title: string
  body: string
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchUser(): Promise<User> {
  await delay(2000)
  return {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    bio: '全栈工程师，热爱 React 和 TypeScript',
  }
}

async function fetchPosts(): Promise<Post[]> {
  await delay(3000)
  return [
    { id: 1, title: 'React 19 新特性', body: 'React 19 带来了 use() Hook、Actions、Server Components 等令人兴奋的新特性，让异步开发更加简洁。' },
    { id: 2, title: 'Suspense 进阶指南', body: 'Suspense 结合 use() 可以实现优雅的异步数据加载，配合骨架屏能大幅提升用户体验。' },
    { id: 3, title: 'TypeScript 6.0 更新', body: 'TypeScript 6.0 进一步优化了类型系统，新增了更好的类型收窄和错误提示。' },
  ]
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className ?? ''}`} />
}

function UserSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Skeleton className="size-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  )
}

function PostsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-2 rounded-lg border p-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
        {user.name[0]}
      </div>
      <div>
        <h3 className="text-lg font-bold">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="mt-1 text-muted-foreground">{user.bio}</p>
      </div>
    </div>
  )
}

function PostsList({ postsPromise }: { postsPromise: Promise<Post[]> }) {
  const posts = use(postsPromise)
  return (
    <div className="space-y-3">
      {posts.map(post => (
        <div key={post.id} className="rounded-lg border p-4">
          <h3 className="font-semibold">{post.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{post.body}</p>
        </div>
      ))}
    </div>
  )
}

export default function SuspenseDemo() {
  const [userPromise, setUserPromise] = useState<Promise<User> | null>(null)
  const [postsPromise, setPostsPromise] = useState<Promise<Post[]> | null>(null)

  const handleLoad = () => {
    setUserPromise(fetchUser())
    setPostsPromise(fetchPosts())
  }

  const handleReset = () => {
    setUserPromise(null)
    setPostsPromise(null)
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">React Suspense 骨架屏 Demo</h1>
      <p className="text-muted-foreground mb-6">
        点击"加载数据"，Suspense 会在数据就绪前展示骨架屏（fallback），
        数据加载完成后自动切换为真实内容。每个 Suspense 边界独立工作，互不阻塞。
      </p>

      <div className="mb-6 flex gap-3">
        <button
          onClick={handleLoad}
          className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          加载数据
        </button>
        <button
          onClick={handleReset}
          className="rounded bg-muted px-4 py-2 text-muted-foreground transition-colors hover:bg-secondary"
        >
          重置
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-2 font-semibold text-muted-foreground">用户信息 （2s 延迟）</h2>
          <Suspense fallback={<UserSkeleton />}>
            {userPromise && <UserProfile userPromise={userPromise} />}
          </Suspense>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-muted-foreground">文章列表 （3s 延迟）</h2>
          <Suspense fallback={<PostsSkeleton />}>
            {postsPromise && <PostsList postsPromise={postsPromise} />}
          </Suspense>
        </div>
      </div>

      <div className="mt-6 rounded bg-muted p-4 text-sm">
        <p className="mb-1 font-semibold">Suspense + use() 要点:</p>
        <ul className="list-disc space-y-1 pl-4">
          <li><code className="rounded bg-muted px-1">use(promise)</code> 是 React 19 的新 API，在组件内直接消费 Promise 并触发 Suspense</li>
          <li>每个 <code className="rounded bg-muted px-1">&lt;Suspense&gt;</code> 边界独立工作，一个区域加载不影响其他区域</li>
          <li><code className="rounded bg-muted px-1">fallback</code> 在数据加载期间展示，完成后自动切换到子组件</li>
          <li>骨架屏（Skeleton）相比传统 loading spinner 能减少用户感知的等待时间</li>
        </ul>
      </div>
    </div>
  )
}
