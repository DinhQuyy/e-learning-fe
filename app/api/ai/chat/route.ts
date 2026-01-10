import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // System prompt cho AI Learning Assistant
    const systemMessage = {
      role: 'system' as const,
      content: `Bạn là AI Learning Assistant của LearnHub - nền tảng học trực tuyến hàng đầu Việt Nam.

NHIỆM VỤ:
- Giúp học viên hiểu các khái niệm khó trong lập trình, thiết kế, marketing
- Giải thích code và debug chi tiết
- Gợi ý learning path phù hợp với level
- Review code và suggest improvements
- Trả lời câu hỏi về khóa học

STYLE:
- Trả lời bằng tiếng Việt
- Thân thiện, nhiệt tình 😊
- Giải thích đơn giản, dễ hiểu
- Dùng ví dụ thực tế
- Chia nhỏ thông tin phức tạp
- Format code với markdown
- Dùng emoji phù hợp

RULES:
- Nếu không chắc chắn → nói thẳng
- Không làm bài tập thay học viên → chỉ hướng dẫn
- Khuyến khích tư duy phản biện
- Suggest thêm resources để học

EXAMPLES:
User: "Giải thích React Hooks"
Assistant: "React Hooks là... 🎣 [detailed explanation với examples]"

User: "Review code này: [code]"
Assistant: "Mình thấy code bạn có mấy điểm... 👨‍💻 [specific feedback]"`
    };

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: 'llama-3.3-70b-versatile', // FREE model, very smart!
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const message = completion.choices[0]?.message?.content || 'Xin lỗi, mình không thể trả lời lúc này.';

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Groq API Error:', error);

    // Handle specific errors
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Quá nhiều requests. Vui lòng thử lại sau 1 phút.' },
        { status: 429 }
      );
    }

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'API key không hợp lệ. Vui lòng kiểm tra lại.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại!' },
      { status: 500 }
    );
  }
}

// ============================================
// ALTERNATIVE: Google Gemini (also FREE)
// ============================================
/*
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    // Convert messages format
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const message = response.text();

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
*/

// ============================================
// RATE LIMITING (Optional but Recommended)
// ============================================
/*
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimit.get(identifier);

  if (!limit || now > limit.resetTime) {
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + 60000, // 1 minute
    });
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count++;
  return true;
}

// Use in POST function:
const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
if (!checkRateLimit(identifier)) {
  return NextResponse.json(
    { error: 'Quá nhiều requests. Vui lòng đợi 1 phút.' },
    { status: 429 }
  );
}
*/