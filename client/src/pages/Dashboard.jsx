import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Package } from 'lucide-react'
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

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts)
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPosts(filtered)
    }
  }, [searchQuery, posts])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await getPosts()
      setPosts(data)
      setFilteredPosts(data)
    } catch (error) {
      console.error('Failed to load posts:', error)
      // If API fails, use mock data
      const mockPosts = [
        {
          id: 1,
          title: 'Fresh Vegetables',
          description: 'Leftover fresh vegetables from event catering. All organic and in great condition.',
          quantity: '5 kg',
          location: 'Downtown Community Center, Singapore',
          imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
          expiryDate: '2025-12-15',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          title: 'Cooked Rice & Curry',
          description: 'Freshly cooked food from restaurant surplus. Suitable for immediate consumption.',
          quantity: '10 servings',
          location: 'Little India Restaurant, Singapore',
          imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
          expiryDate: '2025-12-11',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          title: 'Bakery Items',
          description: 'End of day bread, pastries and cakes. Still fresh and delicious!',
          quantity: '20 items',
          location: 'Orchard Bakery, Singapore',
          imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
          expiryDate: '2025-12-12',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ]
      setPosts(mockPosts)
      setFilteredPosts(mockPosts)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (postData) => {
    try {
      const newPost = await createPost(postData)
      setPosts([newPost, ...posts])
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create post:', error)
      // Fallback: add locally if API fails
      setPosts([postData, ...posts])
      setIsCreateDialogOpen(false)
    }
  }

  const handleClaimPost = (postId) => {
    alert(`Claim functionality for post ${postId} - To be implemented with backend`)
    // This would typically open a dialog or navigate to a claim page
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="./logo.png" className="h-12" alt="FoodShare Logo" />
              {/* <img src="./appName.png" className="h-12" alt="FoodShare" /> */}
              <div>
                <h1 className="text-3xl font-bold text-green-600">FoodShare</h1>
                <p className="text-gray-600 text-sm">Reducing waste, sharing care</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Post
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for food items, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading posts...</div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Package className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-semibold">
              {searchQuery ? 'No Search Found' : 'No posts found'}
            </p>
            <p className="text-sm">
              {searchQuery 
                ? `No results for "${searchQuery}". Try a different search term.`
                : 'Try adjusting your search or create a new post'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Available Food ({filteredPosts.length})
              </h2>
              <p className="text-sm text-gray-600">
                Browse and claim food items near you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onClaim={handleClaimPost}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent onClose={() => setIsCreateDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Share Food</DialogTitle>
            <DialogDescription>
              Create a post to share your surplus food with those who need it.
            </DialogDescription>
          </DialogHeader>
          <CreatePostForm 
            onSubmit={handleCreatePost}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
