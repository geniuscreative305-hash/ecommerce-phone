'use server';

import { headers } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function askGeminiBrandAssistant(
  question: string,
  history: Message[] = []
) {
  // 1. IP Rate Limiting (max 10 requests / 1 minute)
  const reqHeaders = headers();
  const clientIp = getClientIp(reqHeaders);
  const rateLimit = checkRateLimit(`ai:${clientIp}`, 10, 60);

  if (!rateLimit.success) {
    return {
      success: false,
      error: 'Terlalu banyak pertanyaan dalam waktu singkat. Silakan tunggu 1 menit.',
    };
  }

  const cleanQuestion = question?.trim();
  if (!cleanQuestion || cleanQuestion.length < 2) {
    return {
      success: false,
      error: 'Pertanyaan tidak boleh kosong.',
    };
  }

  // 2. Read server-only Gemini API Key
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  // Fallback smart knowledge if GEMINI_API_KEY is not yet configured in .env.local
  if (!apiKey) {
    const fallbackAnswer = generateSmartFallback(cleanQuestion);
    return {
      success: true,
      answer: fallbackAnswer,
      isFallback: true,
    };
  }

  // 3. Call Google Gemini API (gemini-2.5-flash)
  try {
    const systemPrompt = `Anda adalah Asisten Ahli Konsultasi Smartphone resmi dari Jaya Cell (Pusat Retail Smartphone Resmi & POS di Indonesia).
Tugas Anda:
1. Membantu calon pembeli membandingkan berbagai merek smartphone (Apple, Samsung, Google, Xiaomi, OnePlus, realme, Oppo, Vivo, Asus, dll.) secara objektif, mendalam, dan adil.
2. Jelaskan kelebihan, kekurangan, ketahanan, perbandingan chipset, kamera, baterai, serta peruntukan (gaming, fotografi, produktivitas, atau budget harian).
3. Jelaskan pentingnya Garansi Resmi Indonesia (seperti iBox / GDN untuk Apple, SEIN untuk Samsung, TAM untuk Xiaomi/realme) dan jaminan keaslian IMEI terdaftar Kemenperin/Bea Cukai.
4. Gunakan bahasa Indonesia yang santun, ramah, profesional, dan gunakan formatting Markdown bullet points yang rapi dan mudah dibaca oleh pembeli.`;

    // Construct contents payload for Gemini API
    const contents: any[] = [];

    // Include recent history (max last 4 turns)
    const recentHistory = history.slice(-4);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: cleanQuestion }],
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API request failed:', response.status, errText);

      // Graceful fallback to smart local knowledge
      return {
        success: true,
        answer: generateSmartFallback(cleanQuestion),
        isFallback: true,
      };
    }

    const data = await response.json();
    const candidateText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Maaf, saya tidak dapat merumuskan jawaban saat ini. Silakan tanyakan hal lain.';

    return {
      success: true,
      answer: candidateText,
      isFallback: false,
    };
  } catch (err: any) {
    console.error('Gemini assistant error:', err);
    return {
      success: true,
      answer: generateSmartFallback(cleanQuestion),
      isFallback: true,
    };
  }
}

// Built-in Smart Fallback Knowledge Base (Active when Gemini API Key is pending)
function generateSmartFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('iphone') || q.includes('apple')) {
    return `### 🍏 Analisis Brand Apple di Jaya Cell
- **Kelebihan Utama:** Ekosistem iOS yang sangat matang, update software hingga 5-6 tahun, perekaman video terbaik di kelasnya, dan nilai jual kembali (*resale value*) yang paling stabil.
- **Kekurangan:** Harga unit dan aksesoris orisinal relatif tinggi, tidak ada slot microSD, dan opsi kustomisasi lebih tertutup dibanding Android.
- **Rekomendasi Jaya Cell:** iPhone 16 Pro sangat cocok untuk kreator konten dan profesional yang membutuhkan performa komputasi A18 Pro serta garansi resmi iBox / GDN 1 tahun.`;
  }

  if (q.includes('samsung')) {
    return `### 📱 Analisis Brand Samsung di Jaya Cell
- **Kelebihan Utama:** Kualitas layar Dynamic AMOLED 2X terbaik di dunia, integrasi Galaxy AI yang canggih (Circle to Search, Live Translate), dan varian lengkap dari entry-level (Galaxy A) hingga flagship (Galaxy S & Z Fold).
- **Kekurangan:** Kecepatan pengisian daya (fast charging) umumnya masih 25W–45W (kalah cepat dibanding brand Tiongkok).
- **Rekomendasi Jaya Cell:** Samsung Galaxy S24 Series adalah pilihan ideal bagi pengguna yang mengutamakan produktivitas, layar super cerah, dan jaminan update OS 7 tahun dari garansi resmi SEIN.`;
  }

  if (q.includes('xiaomi') || q.includes('redmi') || q.includes('poco')) {
    return `### 🟠 Analisis Brand Xiaomi di Jaya Cell
- **Kelebihan Utama:** Rasio *Price to Performance* (spesifikasi tinggi dengan harga paling terjangkau), pengisian daya super kilat (67W–120W HyperCharge), dan layar AMOLED di kelas budget.
- **Kekurangan:** Antarmuka HyperOS terkadang menampilkan notifikasi bawaan dan stabilitas sensor proximity di beberapa seri entry-level.
- **Rekomendasi Jaya Cell:** Sangat direkomendasikan bagi pengguna dengan anggaran efisien yang menginginkan performa gaming dan baterai awet bergaransi resmi TAM.`;
  }

  if (q.includes('garansi') || q.includes('ibox') || q.includes('sein') || q.includes('tam')) {
    return `### 🛡️ Panduan Tipe Garansi Resmi di Jaya Cell
1. **Garansi iBox / GDN (Apple Indonesia):** Unit resmi Indonesia (kode model ID/A, PA/A, SA/A), IMEI 100% terdaftar permanen di Bea Cukai & Kemenperin, bebas blokir sinyal seumur hidup.
2. **Garansi SEIN (Samsung Electronics Indonesia):** Layanan servis resmi di seluruh Service Center Samsung se-Indonesia.
3. **Garansi TAM (Teletama Artha Mandiri / Erajaya):** Distributor resmi untuk Xiaomi, Asus, dan Garmin di Indonesia.
*Seluruh smartphone di Jaya Cell dijamin unit resmi dengan garansi aktif dan IMEI valid.*`;
  }

  return `### 💡 Panduan Memilih Smartphone dari AI Jaya Cell
Untuk memilih smartphone terbaik sesuai kebutuhan Anda:
1. **Fokus Fotografi & Video:** Prioritaskan **Apple iPhone 16 Pro** atau **Samsung Galaxy S24 Ultra**.
2. **Fokus Gaming & Performa:** Prioritaskan chipset Snapdragon 8 Gen 3 atau Dimensity 9300 (OnePlus 12 / Xiaomi / ROG Phone).
3. **Budget Rp 3 - 7 Juta:** Varian Samsung Galaxy A series, realme, atau Xiaomi Poco menawarkan baterai besar dan layar 120Hz.

*Silakan tanyakan perbandingan spesifik (contoh: "Bandingkan iPhone 16 Pro vs Galaxy S24") untuk analisis lebih detail!*`;
}

