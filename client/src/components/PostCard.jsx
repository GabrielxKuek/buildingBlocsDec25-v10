import React from 'react'
import { MapPin, Calendar, Package, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

export default function PostCard({ post, onClaim }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {post.imageUrl && (
        <div className="w-full h-48 overflow-hidden bg-gray-100">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{post.title}</CardTitle>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {getTimeAgo(post.createdAt)}
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {post.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Package className="w-4 h-4 mr-2 text-green-600" />
          <span className="font-medium">Quantity:</span>
          <span className="ml-2">{post.quantity}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-green-600" />
          <span className="font-medium">Location:</span>
          <span className="ml-2 line-clamp-1">{post.location}</span>
        </div>

        {post.expiryDate && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-green-600" />
            <span className="font-medium">Best Before:</span>
            <span className="ml-2">{formatDate(post.expiryDate)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={() => onClaim(post.id)} 
          className="w-full"
        >
          Claim This Food
        </Button>
      </CardFooter>
    </Card>
  )
}
