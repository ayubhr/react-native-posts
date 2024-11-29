// Importing axios for making HTTP requests and the Post type from the post module
import axios from "axios";
import { Post } from "../types/post";

// Creating an instance of axios with a base URL for all requests
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000, // Set timeout to 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Defining the number of items to fetch per page
const ITEMS_PER_PAGE = 10;

// Exporting a function to fetch posts with pagination
export const getPosts = async (
  page: number = 1 // Default page number is 1 if not provided
): Promise<{
  data: Post[]; // Array of posts
  hasMore: boolean; // Boolean indicating if there are more posts to fetch
}> => {
  // Calculating the start index for the current page
  const start = (page - 1) * ITEMS_PER_PAGE;
  // Making a GET request to fetch posts with the calculated start index and limit
  const response = await api.get<Post[]>(
    `/posts?_start=${start}&_limit=${ITEMS_PER_PAGE}`
  );
  // Extracting the total count of posts from the response headers
  const totalCount = parseInt(response.headers["x-total-count"] || "100");
  // Determining if there are more posts to fetch based on the current page and total count
  const hasMore = start + ITEMS_PER_PAGE < totalCount;

  // Returning the fetched posts and a boolean indicating if there are more posts
  return {
    data: response.data,
    hasMore,
  };
};
