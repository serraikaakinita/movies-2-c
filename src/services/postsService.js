import api from "../api/axios";

export const postsService = {
  // GET /api/posts?page=0&size=2
  async getPosts(page = 0, size = 10) {
    const res = await api.get("/posts", { params: { page, size } });
    return res.data;
  },

  // POST /api/posts/upload (multipart/form-data)
  async uploadPost({ file, movieId, mediaType, caption }) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("movieId", movieId);
    formData.append("mediaType", mediaType);
    formData.append("caption", caption);

    const res = await api.post("/posts/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  // POST /api/posts/{postId}/rate
  async ratePost(postId, rating) {
    const res = await api.post(`/posts/${postId}/rate`, { rating });
    return res.data;
  },

  // GET /api/posts/{postId}/replies
  async getReplies(postId) {
    const res = await api.get(`/posts/${postId}/replies`);
    return res.data;
  },

  // POST /api/posts/{postId}/replies  Body: {content:"..."}
  async createReply(postId, content) {
    const res = await api.post(`/posts/${postId}/replies`, { content });
    return res.data;
  },

  // DELETE /api/posts/replies/{replyId}
  async deleteReply(replyId) {
    const res = await api.delete(`/posts/replies/${replyId}`);
    return res.data;
  },

  // PUT /api/posts/replies/{replyId} Body:{content:"..."}
  async editReply(replyId, content) {
    const res = await api.put(`/posts/replies/${replyId}`, { content });
    return res.data;
  },
};
