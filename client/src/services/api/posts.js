const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const getPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`)
    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export const createPost = async (postData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    })
    if (!response.ok) {
      throw new Error('Failed to create post')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export const getPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch post')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

export const updatePost = async (id, postData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    })
    if (!response.ok) {
      throw new Error('Failed to update post')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

export const deletePost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Failed to delete post')
    }
    return await response.json()
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}
