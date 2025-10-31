export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  error?: string;
}

export interface WebhookResponse {
  message: string;
  success: boolean;
  error?: string;
}