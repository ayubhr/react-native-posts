import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { PostProvider } from "@/context/PostContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PostProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="posts/index"
            options={{
              title: "Posts",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="posts/[id]"
            options={{
              title: "Post Details",
              headerShown: true,
            }}
          />
        </Stack>
      </PostProvider>
    </QueryClientProvider>
  );
}
