# 🔗 Webhook Configuration Update

## ✅ n8n Webhook Integration

### 🚀 **New Webhook Configuration**

#### **Endpoint**
```
https://n8n-web.argfhrz.site/webhook/81fa7810-4ed8-4ead-8b27-61a6e16d4a72
```

#### **Request Format**
```json
{
  "data": "user message here"
}
```

#### **Response Format**
```json
{
  "output": "AI response here"
}
```

### 🔧 **Implementation Details**

#### **Updated ChatService**
```typescript
export class ChatService {
  private static WEBHOOK_URL = 'https://n8n-web.argfhrz.site/webhook/81fa7810-4ed8-4ead-8b27-61a6e16d4a72';

  static async sendMessage(message: string): Promise<WebhookResponse> {
    try {
      const response = await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: message  // Changed from 'message' to 'data'
        }),
      });

      const data = await response.json();
      return {
        message: data.output || 'No response received',  // Changed from 'data.message' to 'data.output'
        success: true,
      };
    } catch (error) {
      // Error handling...
    }
  }
}
```

### 📋 **Key Changes Made**

#### 1. **Hardcoded Webhook URL**
- **Before**: Used environment variable `NEXT_PUBLIC_CHAT_WEBHOOK_URL`
- **After**: Direct n8n webhook URL in code

#### 2. **Request Body Format**
- **Before**: `{ "message": "...", "timestamp": "..." }`
- **After**: `{ "data": "..." }`

#### 3. **Response Parsing**
- **Before**: `data.message || data.response`
- **After**: `data.output`

#### 4. **Removed Timestamp**
- **Before**: Included timestamp in request
- **After**: Only send user message

### 🔄 **Data Flow**

```
User Input → ChatService.sendMessage()
    ↓
POST https://n8n-web.argfhrz.site/webhook/...
    ↓
Request: {"data": "Hello, how are you?"}
    ↓
n8n Processing (AI/GPT Integration)
    ↓
Response: {"output": "I'm doing well, thank you!"}
    ↓
Display in Chat Interface
```

### 🧪 **Testing**

#### **Manual Test**
```bash
curl -X POST https://n8n-web.argfhrz.site/webhook/81fa7810-4ed8-4ead-8b27-61a6e16d4a72 \
  -H "Content-Type: application/json" \
  -d '{"data": "Hello, can you help me?"}'
```

#### **Expected Response**
```json
{
  "output": "Hello! I'd be happy to help you. What do you need assistance with?"
}
```

### 🚀 **Ready for Production**

- ✅ **Webhook URL** - Configured dengan n8n endpoint
- ✅ **Request Format** - Sesuai dengan spesifikasi `{"data": "..."}`
- ✅ **Response Parsing** - Extract `output` field dari response
- ✅ **Error Handling** - Maintained untuk robustness
- ✅ **Integration** - Seamless dengan existing chat interface

Chatbot sekarang siap untuk berkomunikasi dengan n8n workflow! 🤖✨