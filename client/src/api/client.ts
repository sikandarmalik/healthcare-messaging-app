import axios, { AxiosInstance } from 'axios';
import { AuthResponse, User, Conversation, Message } from '../types';

const API_URL = '/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor to handle 401 errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.token = null;
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = storedToken;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    dateOfBirth?: string;
    phone?: string;
    address?: string;
  }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async getMe(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  // Users endpoints
  async getDoctors(): Promise<Array<{ id: string; email: string; profile: { fullName: string; specialty: string } }>> {
    const response = await this.client.get('/users/doctors');
    return response.data;
  }

  // Conversations endpoints
  async getConversations(): Promise<Conversation[]> {
    const response = await this.client.get<Conversation[]>('/conversations');
    return response.data;
  }

  async getConversation(id: string): Promise<Conversation> {
    const response = await this.client.get<Conversation>(`/conversations/${id}`);
    return response.data;
  }

  async createConversation(participantId: string): Promise<Conversation> {
    const response = await this.client.post<Conversation>('/conversations', {
      participantId,
    });
    return response.data;
  }

  // Messages endpoints
  async getMessages(conversationId: string, limit = 50, before?: string): Promise<Message[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (before) {
      params.append('before', before);
    }
    const response = await this.client.get<Message[]>(
      `/conversations/${conversationId}/messages?${params.toString()}`
    );
    return response.data;
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const response = await this.client.post<Message>(
      `/conversations/${conversationId}/messages`,
      { content }
    );
    return response.data;
  }

  async sendMessageWithAttachment(
    conversationId: string,
    content: string,
    file: File
  ): Promise<Message> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('file', file);

    const response = await this.client.post<Message>(
      `/conversations/${conversationId}/messages/with-attachment`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    await this.client.post(`/conversations/${conversationId}/messages/mark-read`);
  }
}

export const apiClient = new ApiClient();
