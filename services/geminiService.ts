
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export const generateFutureCareerImage = async (
  base64Image: string,
  career: string,
  ratio: AspectRatio
): Promise<string> => {
  // Khởi tạo instance mới để đảm bảo sử dụng API Key mới nhất từ môi trường
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const base64Data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

  const prompt = `
    Dựa trên hình ảnh học sinh được cung cấp, hãy tạo một hình ảnh mới với các yêu cầu cực kỳ nghiêm ngặt sau:
    1. ĐỐI TƯỢNG CHÍNH: Giữ NGUYÊN gương mặt, độ tuổi (trẻ em/học sinh) và các đặc điểm nhận dạng của học sinh trong ảnh gốc. Tuyệt đối không được biến học sinh thành người lớn hay người già. 
    2. TRANG PHỤC: Cho học sinh mặc bộ đồ chuyên nghiệp của nghề ${career}. Nếu là giáo viên Việt Nam, hãy ưu tiên Áo dài truyền thống. Nếu là nghề khác, hãy dùng trang phục đặc trưng nhất. Trang phục phải được thiết kế vừa vặn với kích thước cơ thể của một đứa trẻ.
    3. BỐI CẢNH: Đặt học sinh vào môi trường làm việc mơ ước của nghề ${career} (ví dụ: lớp học tươi sáng, phòng thí nghiệm hiện đại, sân khấu...).
    4. CHẤT LƯỢNG: Ảnh phong cách nhiếp ảnh chuyên nghiệp, ánh sáng đẹp, độ chi tiết cao, màu sắc tươi tắn phù hợp với lứa tuổi học sinh.
    5. CẤM: Không có văn bản, không có logo, không biến đổi khuôn mặt thành người khác.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: ratio as any,
        },
      },
    });

    let generatedImageUrl = "";
    
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImageUrl) {
      throw new Error("AI không thể tạo được hình ảnh lúc này. Vui lòng thử lại sau vài giây.");
    }

    return generatedImageUrl;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Xử lý lỗi thường gặp ở tầng miễn phí (ví dụ: quá giới hạn yêu cầu)
    if (error.message?.includes("429")) {
      throw new Error("Bạn đang tạo ảnh quá nhanh. Vui lòng đợi một chút rồi thử lại nhé!");
    }
    throw new Error("Đã có lỗi xảy ra. Hãy kiểm tra kết nối mạng và thử lại.");
  }
};
