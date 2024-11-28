import axios from "axios";
import { Post } from "../types/post";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

const ITEMS_PER_PAGE = 10;

export const getPosts = async (
  page: number = 1
): Promise<{
  data: Post[];
  hasMore: boolean;
}> => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const response = await api.get<Post[]>(
    `/posts?_start=${start}&_limit=${ITEMS_PER_PAGE}`
  );
  const totalCount = parseInt(response.headers["x-total-count"] || "100");
  const hasMore = start + ITEMS_PER_PAGE < totalCount;

  return {
    data: response.data,
    hasMore,
  };
};
