import { NextRequest, NextResponse } from 'next/server';
import { Caption, Word } from '@/types';
import { generateId } from '@/lib/utils';

interface WhisperWord {
  word: string;
  start: number;
  end: number;
}

interface WhisperSegment {
  start: number;
  end: number;
  text: string;
}

interface WhisperResponse {
  language?: string;
  duration?: number;
  segments?: WhisperSegment[];
  words?: WhisperWord[];
}

// Lazy-initialize OpenAI client
async function getOpenAIClient() {
  const OpenAI = (await import('openai')).default;
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('No OpenAI API key configured, returning demo captions');
      return NextResponse.json({
        captions: getDemoCaptions(),
        language: 'hi',
        duration: 14,
        demo: true,
      });
    }

    // Convert File to Buffer for OpenAI
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a File object that OpenAI can accept
    const file = new File([buffer], audioFile.name, { type: audioFile.type });

    // Get OpenAI client
    const openai = await getOpenAIClient();

    // Call OpenAI Whisper API with word-level timestamps
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word', 'segment'],
      language: 'hi', // Support for Hindi/Hinglish
    }) as unknown as WhisperResponse;

    // Parse segments into captions
    const captions: Caption[] = [];
    
    if (transcription.segments) {
      for (const segment of transcription.segments) {
        const words: Word[] = [];
        
        // Extract words for this segment
        if (transcription.words) {
          const segmentWords = transcription.words.filter(
            (w) => w.start >= segment.start && w.end <= segment.end
          );
          
          for (const word of segmentWords) {
            words.push({
              text: word.word,
              startTime: word.start,
              endTime: word.end,
            });
          }
        }

        captions.push({
          id: generateId(),
          text: segment.text.trim(),
          startTime: segment.start,
          endTime: segment.end,
          words: words.length > 0 ? words : undefined,
        });
      }
    }

    return NextResponse.json({
      captions,
      language: transcription.language || 'hi',
      duration: transcription.duration || 0,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    
    // Return demo captions on error
    return NextResponse.json({
      captions: getDemoCaptions(),
      language: 'hi',
      duration: 14,
      demo: true,
      error: 'Transcription failed, using demo captions',
    });
  }
}

// Demo captions for testing without API key
function getDemoCaptions(): Caption[] {
  return [
    {
      id: generateId(),
      text: 'नमस्ते! Welcome to Simora AI',
      startTime: 0,
      endTime: 3,
      words: [
        { text: 'नमस्ते!', startTime: 0, endTime: 1 },
        { text: 'Welcome', startTime: 1.2, endTime: 1.8 },
        { text: 'to', startTime: 1.9, endTime: 2.1 },
        { text: 'Simora', startTime: 2.2, endTime: 2.6 },
        { text: 'AI', startTime: 2.7, endTime: 3 },
      ],
    },
    {
      id: generateId(),
      text: 'This is a demo of Hinglish captions',
      startTime: 3.5,
      endTime: 6,
      words: [
        { text: 'This', startTime: 3.5, endTime: 3.8 },
        { text: 'is', startTime: 3.9, endTime: 4.1 },
        { text: 'a', startTime: 4.2, endTime: 4.3 },
        { text: 'demo', startTime: 4.4, endTime: 4.8 },
        { text: 'of', startTime: 4.9, endTime: 5.1 },
        { text: 'Hinglish', startTime: 5.2, endTime: 5.6 },
        { text: 'captions', startTime: 5.7, endTime: 6 },
      ],
    },
    {
      id: generateId(),
      text: 'आप किसी भी style को choose कर सकते हैं',
      startTime: 6.5,
      endTime: 10,
      words: [
        { text: 'आप', startTime: 6.5, endTime: 6.8 },
        { text: 'किसी', startTime: 6.9, endTime: 7.2 },
        { text: 'भी', startTime: 7.3, endTime: 7.5 },
        { text: 'style', startTime: 7.6, endTime: 8 },
        { text: 'को', startTime: 8.1, endTime: 8.3 },
        { text: 'choose', startTime: 8.4, endTime: 8.8 },
        { text: 'कर', startTime: 8.9, endTime: 9.2 },
        { text: 'सकते', startTime: 9.3, endTime: 9.6 },
        { text: 'हैं', startTime: 9.7, endTime: 10 },
      ],
    },
    {
      id: generateId(),
      text: 'Export your video with beautiful captions!',
      startTime: 10.5,
      endTime: 14,
      words: [
        { text: 'Export', startTime: 10.5, endTime: 11 },
        { text: 'your', startTime: 11.1, endTime: 11.4 },
        { text: 'video', startTime: 11.5, endTime: 11.9 },
        { text: 'with', startTime: 12, endTime: 12.3 },
        { text: 'beautiful', startTime: 12.4, endTime: 13 },
        { text: 'captions!', startTime: 13.1, endTime: 14 },
      ],
    },
  ];
}
