import { createContext, useContext, useState } from "react";

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  // ... other post properties
};

type PostContextType = {
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <PostContext.Provider value={{ selectedPost, setSelectedPost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePost must be used within PostProvider");
  return context;
}
