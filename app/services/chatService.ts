import { WebhookResponse } from '../types/chat';

export class ChatService {
  private static WEBHOOK_URL = 'https://n8n-web.jailbreak.pro/webhook/81fa7810-4ed8-4ead-8b27-61a6e16d4a72';

  static async sendMessage(message: string): Promise<WebhookResponse> {
    try {
      const response = await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: message
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response);
      

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle array response format: [{"output":"hasil"}]
      let outputMessage = 'No response received';
      
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        outputMessage = data[0].output;
      } else if (data.output) {
        // Fallback for direct object format: {"output":"hasil"}
        outputMessage = data.output;
      }
      
      return {
        message: outputMessage,
        success: true,
      };
    } catch (error) {
      console.error('Chat API Error:', error);
      return {
        message: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}