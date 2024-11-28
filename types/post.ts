export interface Post {
  id: number;
  title: string;
  imageUrl?: string;
  excerpt?: string;
  body: string;
  userId: number;
}
