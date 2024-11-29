// Importing necessary React hooks and the Post type from the project's types
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Post } from "@/types/post";

// Defining the structure of the context
interface PostContextType {
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  favorites: Set<number>;
  toggleFavorite: (postId: number) => void;
  showFavorites: boolean;
  setShowFavorites: (value: boolean) => void;
  isTogglingFavorite: boolean;
  getFavoritePosts: (posts: Post[]) => Post[];
}

// Creating the context with an initial value of undefined
const PostContext = createContext<PostContextType | undefined>(undefined);

// The provider component that wraps the application
export function PostProvider({ children }: { children: React.ReactNode }) {
  // State to manage the selected post
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  // State to manage the set of favorite post IDs
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  // State to manage showing favorites
  const [showFavorites, setShowFavorites] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Optimized toggle favorite function
  const toggleFavorite = useCallback(async (postId: number) => {
    setIsTogglingFavorite(true);
    try {
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(postId)) {
          newFavorites.delete(postId);
        } else {
          newFavorites.add(postId);
        }
        return newFavorites;
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  }, []);

  // Optimized function to get favorite posts
  const getFavoritePosts = useCallback(
    (posts: Post[]) => {
      return posts.filter((post) => favorites.has(post.id));
    },
    [favorites]
  );

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      selectedPost,
      setSelectedPost,
      favorites,
      toggleFavorite,
      showFavorites,
      setShowFavorites,
      isTogglingFavorite,
      getFavoritePosts,
    }),
    [
      selectedPost,
      favorites,
      toggleFavorite,
      showFavorites,
      isTogglingFavorite,
      getFavoritePosts,
    ]
  );

  // Providing the context values to the children
  return (
    <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>
  );
}

// Hook to use the context
export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePost must be used within a PostProvider");
  return context;
};
