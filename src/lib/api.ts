export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  created_by: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  group_members: Array<{ count: number }>;
}

export interface Business {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  image_url: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

export interface PostComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

export interface Conversation {
  id: string;
  updated_at: string;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: { display_name: string | null } | null;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const AUTH_STORAGE_KEY = "alief-locals-session";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function getStoredSession(): AuthSession | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function persistSession(session: AuthSession | null) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  if (!session) {
    storage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function getToken() {
  return getStoredSession()?.token ?? null;
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  const token = getToken();

  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 204) {
    return null as T;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

export async function signUp(input: { name: string; email: string; password: string }) {
  return apiRequest<AuthSession>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function signIn(input: { email: string; password: string }) {
  return apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser() {
  const response = await apiRequest<{ user: AuthUser }>("/auth/me");
  return response.user;
}

export async function listBusinesses(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const response = await apiRequest<{ businesses: Business[] }>(`/businesses${query}`);
  return response.businesses;
}

export async function getBusinessBySlug(slug: string) {
  const response = await apiRequest<{ business: Business }>(`/businesses/${encodeURIComponent(slug)}`);
  return response.business;
}

export async function listReviews(businessId: string) {
  const response = await apiRequest<{ reviews: Review[] }>(`/businesses/${businessId}/reviews`);
  return response.reviews;
}

export async function createReview(businessId: string, input: { rating: number; comment: string }) {
  return apiRequest<{ ok: true }>(`/businesses/${businessId}/reviews`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listPosts() {
  const response = await apiRequest<{ posts: Post[] }>("/posts");
  return response.posts;
}

export async function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<{ url: string; mediaType: "image" | "video" }>("/uploads/media", {
    method: "POST",
    body: formData,
  });
}

export async function createPost(input: { content?: string; mediaUrl?: string | null; mediaType?: string | null }) {
  return apiRequest<{ id: string }>("/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deletePost(postId: string) {
  return apiRequest<null>(`/posts/${postId}`, {
    method: "DELETE",
  });
}

export async function getPostLikes(postId: string) {
  return apiRequest<{ count: number; liked: boolean }>(`/posts/${postId}/likes`);
}

export async function likePost(postId: string) {
  return apiRequest<{ ok: true }>(`/posts/${postId}/likes`, {
    method: "POST",
  });
}

export async function unlikePost(postId: string) {
  return apiRequest<null>(`/posts/${postId}/likes`, {
    method: "DELETE",
  });
}

export async function listPostComments(postId: string) {
  const response = await apiRequest<{ comments: PostComment[] }>(`/posts/${postId}/comments`);
  return response.comments;
}

export async function addPostComment(postId: string, content: string) {
  return apiRequest<{ ok: true }>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function listPeople() {
  const response = await apiRequest<{ people: Profile[] }>("/people");
  return response.people;
}

export async function listFriendships() {
  const response = await apiRequest<{ friendships: Friendship[] }>("/friendships");
  return response.friendships;
}

export async function sendFriendRequest(addresseeId: string) {
  return apiRequest<{ ok: true }>("/friendships", {
    method: "POST",
    body: JSON.stringify({ addresseeId }),
  });
}

export async function acceptFriendRequest(requesterId: string) {
  return apiRequest<{ ok: true }>("/friendships/accept", {
    method: "PATCH",
    body: JSON.stringify({ requesterId }),
  });
}

export async function createConversation(participantIds: string[]) {
  const response = await apiRequest<{ conversation: { id: string } }>("/conversations", {
    method: "POST",
    body: JSON.stringify({ participantIds }),
  });
  return response.conversation;
}

export async function listConversations() {
  const response = await apiRequest<{ conversations: Conversation[] }>("/conversations");
  return response.conversations;
}

export async function listMessages(conversationId: string) {
  const response = await apiRequest<{ messages: Message[] }>(`/conversations/${conversationId}/messages`);
  return response.messages;
}

export async function sendMessage(conversationId: string, content: string) {
  return apiRequest<{ ok: true }>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function listGroups() {
  const response = await apiRequest<{ groups: Group[] }>("/groups");
  return response.groups;
}

export async function createGroup(input: { name: string; description?: string }) {
  const response = await apiRequest<{ group: { id: string } }>("/groups", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.group;
}

export async function joinGroup(groupId: string) {
  return apiRequest<{ ok: true }>(`/groups/${groupId}/join`, {
    method: "POST",
  });
}
