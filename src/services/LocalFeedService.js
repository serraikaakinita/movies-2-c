import { get, set } from "idb-keyval";

const FEED_KEY = "local_feed_posts_v1";

export async function loadPosts() {
  return (await get(FEED_KEY)) || [];
}

export async function savePosts(posts) {
  await set(FEED_KEY, posts);
}
