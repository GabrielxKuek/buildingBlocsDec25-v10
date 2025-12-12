import { useState, useEffect } from 'react'
import { Plus, Search, Package } from 'lucide-react'
import PostCard from '../components/PostCard'
import CreatePostForm from '../components/CreatePostForm'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'
import { getPosts, createPost } from '../services/api/posts'

export default function Dashboard() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [claimPopupOpen, setClaimPopupOpen] = useState(false)
  const [claimedPost, setClaimedPost] = useState(null)


  // ---------------------------
  // Load Data (LocalStorage → API → Mock)
  // ---------------------------
  useEffect(() => {
    const saved = localStorage.getItem('foodshare_posts')
    if (saved) {
      const parsed = JSON.parse(saved)
      setPosts(parsed)
      setFilteredPosts(parsed)
      setLoading(false)
    } else {
      loadPosts()
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts)
    } else {
      const q = searchQuery.toLowerCase()
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.location.toLowerCase().includes(q)
      )
      setFilteredPosts(filtered)
    }
  }, [searchQuery, posts])

  const saveToStorage = (postsArr) => {
    localStorage.setItem('foodshare_posts', JSON.stringify(postsArr))
  }

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await getPosts()
      setPosts(data)
      setFilteredPosts(data)
      saveToStorage(data)
    } catch (error) {
      console.error('Failed to load posts:', error)

      // fallback mock posts
      const mock = [
        {
          id: 1,
          title: 'Fresh Vegetables',
          description: 'Leftover fresh vegetables from event catering.',
          quantity: '5 kg',
          location: 'Downtown Community Center, Singapore',
          imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
          expiryDate: '2025-12-15',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
      setPosts(mock)
      setFilteredPosts(mock)
      saveToStorage(mock)
    } finally {
      setLoading(false)
    }
  }

  // ---------------------------
  // Handle Create Post (with Image Upload Conversion)
  // ---------------------------

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  const handleCreatePost = async (postData) => {
    try {
      let imageBase64 = null

      // If user uploaded a file, convert it to base64
      if (postData.imageFile) {
        imageBase64 = await convertImageToBase64(postData.imageFile)
      }

      const finalPost = {
        id: Date.now(), // local fallback id
        ...postData,
        imageUrl: imageBase64 || postData.imageUrl || '',
        createdAt: new Date().toISOString()
      }

      let newPost = finalPost

      try {
        // Try backend API
        newPost = await createPost(finalPost)
      } catch (err) {
        console.warn('API failed, storing locally instead.')
      }

      const updated = [newPost, ...posts]
      setPosts(updated)
      saveToStorage(updated)

      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const handleClaimPost = (postId) => {
    const post = posts.find(p => p.id === postId)
    setClaimedPost(post)
    setClaimPopupOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <img src="./logo.png" className="h-10 sm:h-12" alt="FoodShare Logo" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-green-600">FoodShare</h1>
                <p className="text-gray-600 text-xs sm:text-sm">Reducing waste, sharing care</p>
              </div>
            </div>

            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for food items, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-8 pb-20">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            Loading posts...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Package className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-semibold">
              {searchQuery ? 'No Search Found' : 'No posts found'}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Available Food ({filteredPosts.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} onClaim={handleClaimPost} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* CREATE POST DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Food</DialogTitle>
            <DialogDescription>
              Create a post to share your surplus food.
            </DialogDescription>
          </DialogHeader>

          <CreatePostForm
            onSubmit={handleCreatePost}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={claimPopupOpen} onOpenChange={setClaimPopupOpen}>
        <DialogContent className="animate-in fade-in-50 zoom-in-95">
          <DialogHeader>
            <DialogTitle className="text-green-600">Claim Successful!</DialogTitle>
            <DialogDescription>
              {claimedPost && (
                <span>
                  The owner of <strong>{claimedPost.title}</strong> has been notified.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4">
            <Button
              onClick={() => setClaimPopupOpen(false)}
              className="w-full"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
