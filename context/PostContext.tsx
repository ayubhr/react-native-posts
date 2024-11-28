// Importing necessary React hooks and the Post type from the project's types
import { createContext, useContext, useState } from "react";
import { Post } from "@/types/post";

// Defining the structure of the context
interface PostContextType {
  selectedPost: Post | null; // The currently selected post or null if none
  setSelectedPost: (post: Post | null) => void; // Function to set the selected post
  favorites: Set<number>; // A set of IDs of favorite posts
  toggleFavorite: (postId: number) => void; // Function to toggle a post as favorite or not
}

// Creating the context with an initial value of undefined
const PostContext = createContext<PostContextType | undefined>(undefined);

// The provider component that wraps the application
export function PostProvider({ children }: { children: React.ReactNode }) {
  // State to manage the selected post
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  // State to manage the set of favorite post IDs
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Function to toggle a post as favorite or not
  const toggleFavorite = (postId: number) => {
    // Updating the favorites state
    setFavorites(prev => {
      // Creating a new set from the previous state
      const newFavorites = new Set(prev);
      // If the post is already a favorite, remove it; otherwise, add it
      if (newFavorites.has(postId)) {
        newFavorites.delete(postId);
      } else {
        newFavorites.add(postId);
      }
      // Returning the updated set
      return newFavorites;
    });
  };

  // Providing the context values to the children
  return (
    <PostContext.Provider value={{ 
      selectedPost, 
      setSelectedPost, 
      favorites, 
      toggleFavorite 
    }}>
      {children}
    </PostContext.Provider>
  );
}

// Hook to use the context
export const usePost = () => {
  // Getting the context
  const context = useContext(PostContext);
  // Throwing an error if the context is not found (i.e., not used within a PostProvider)
  if (!context) throw new Error("usePost must be used within a PostProvider");
  // Returning the context
  return context;
};
