import React, { useState } from 'react'
import { MapPin, Calendar, Package, Image as ImageIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'

export default function CreatePostForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    location: '',
    imageUrl: '',
    expiryDate: ''
  })

  const [imageFile, setImageFile] = useState(null)      // ← NEW

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    onSubmit({
      ...formData,
      imageFile: imageFile || null,       // ← PASS FILE TO PARENT
      id: Date.now(),
      createdAt: new Date().toISOString()
    })

    // Reset form
    setFormData({
      title: '',
      description: '',
      quantity: '',
      location: '',
      imageUrl: '',
      expiryDate: ''
    })
    setImageFile(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Food Item Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Fresh Vegetables, Cooked Rice"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the food item..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">
            <Package className="inline w-4 h-4 mr-1" />
            Quantity *
          </Label>
          <Input
            id="quantity"
            name="quantity"
            placeholder="e.g., 5 kg, 10 servings"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">
            <Calendar className="inline w-4 h-4 mr-1" />
            Best Before
          </Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">
          <MapPin className="inline w-4 h-4 mr-1" />
          Location *
        </Label>
        <Input
          id="location"
          name="location"
          placeholder="e.g., 123 Main St, Singapore"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      {/* NEW: Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="imageUpload">
          <ImageIcon className="inline w-4 h-4 mr-1" />
          Upload Image
        </Label>
        <Input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {imageFile && (
          <p className="text-sm text-green-600">
            Selected: {imageFile.name}
          </p>
        )}
      </div>

      {/* Keep existing Image URL input (optional fallback) */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">
          <ImageIcon className="inline w-4 h-4 mr-1" />
          Image URL (optional)
        </Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Create Post
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}
