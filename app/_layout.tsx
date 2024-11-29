// @ts-nocheck

// Importing necessary components and hooks from various libraries

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { PostProvider } from "@/context/PostContext";
import { HeaderRight } from "@/components/HeaderRight";

// Creating a new instance of QueryClient for managing queries
const queryClient = new QueryClient();

// The main application layout component
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
              headerRight: () => (
                <HeaderRight
                  isDetailsPage={false}
                />
              ),
            }}
          />
          <Stack.Screen
            name="posts/[id]"
            options={{
              title: "Post Details",
              headerShown: true,
              headerRight: () => (
                <HeaderRight
                  isDetailsPage={true}
                />
              ),
            }}
          />
        </Stack>
      </PostProvider>
    </QueryClientProvider>
  );
}
