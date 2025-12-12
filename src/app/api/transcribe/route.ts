import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';
import { Caption, Word } from '@/types';
import { generateId } from '@/lib/utils';

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.ASSEMBLYAI_API_KEY) {
      return NextResponse.json({
        error: 'AssemblyAI API key not configured',
        message: 'Please add ASSEMBLYAI_API_KEY to .env.local',
        captions: getDemoCaptions(),
        demo: true,
      });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('Received file:', audioFile.name, 'Size:', audioFile.size);

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Uploading to AssemblyAI...');
    
    // Upload file to AssemblyAI
    const uploadUrl = await client.files.upload(buffer);
    console.log('Upload complete:', uploadUrl);

    // Transcribe with AssemblyAI - AUTO DETECT language for Hinglish
    console.log('Starting transcription with auto language detection...');
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      language_detection: true, // Let it auto-detect the language
      punctuate: true,
      format_text: true,
      language_confidence_threshold: 0.5, // Lower threshold for mixed languages
    });

    console.log('Transcription status:', transcript.status);
    console.log('Detected language:', transcript.language_code);

    if (transcript.status === 'error') {
      throw new Error(transcript.error || 'Transcription failed');
    }

    // Parse into captions
    const captions: Caption[] = [];

    if (transcript.words && transcript.words.length > 0) {
      // Group words into caption segments (~3-4 seconds each)
      let wordBuffer: Word[] = [];
      let textBuffer: string[] = [];
      let segmentStartTime = 0;

      for (let i = 0; i < transcript.words.length; i++) {
        const word = transcript.words[i];
        const wordObj: Word = {
          text: word.text,
          startTime: word.start / 1000, // Convert ms to seconds
          endTime: word.end / 1000,
          confidence: word.confidence,
        };

        if (wordBuffer.length === 0) {
          segmentStartTime = wordObj.startTime;
        }

        wordBuffer.push(wordObj);
        textBuffer.push(word.text);

        // Create new caption every ~3.5 seconds or at punctuation
        const duration = wordObj.endTime - segmentStartTime;
        const isPunctuation = /[.!?।,]$/.test(word.text);
        const isLastWord = i === transcript.words.length - 1;

        if (duration >= 3.5 || isPunctuation || wordBuffer.length >= 12 || isLastWord) {
          captions.push({
            id: generateId(),
            text: textBuffer.join(' '),
            startTime: wordBuffer[0].startTime,
            endTime: wordBuffer[wordBuffer.length - 1].endTime,
            words: [...wordBuffer],
          });
          wordBuffer = [];
          textBuffer = [];
        }
      }
    } else if (transcript.text) {
      // Fallback: single caption from full text
      captions.push({
        id: generateId(),
        text: transcript.text,
        startTime: 0,
        endTime: transcript.audio_duration || 10,
      });
    }

    console.log('Captions generated:', captions.length);

    return NextResponse.json({
      captions,
      language: transcript.language_code || 'en',
      duration: transcript.audio_duration || 0,
      provider: 'assemblyai',
      detected_language: transcript.language_code,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({
      error: 'Transcription failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      captions: getDemoCaptions(),
      demo: true,
    }, { status: 500 });
  }
}

// Demo captions for fallback
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
      text: 'आप किसी भी style को choose कर सकते हैं',
      startTime: 3.5,
      endTime: 7,
      words: [
        { text: 'आप', startTime: 3.5, endTime: 3.8 },
        { text: 'किसी', startTime: 3.9, endTime: 4.2 },
        { text: 'भी', startTime: 4.3, endTime: 4.5 },
        { text: 'style', startTime: 4.6, endTime: 5 },
        { text: 'को', startTime: 5.1, endTime: 5.3 },
        { text: 'choose', startTime: 5.4, endTime: 5.8 },
        { text: 'कर', startTime: 5.9, endTime: 6.2 },
        { text: 'सकते', startTime: 6.3, endTime: 6.6 },
        { text: 'हैं', startTime: 6.7, endTime: 7 },
      ],
    },
    {
      id: generateId(),
      text: 'Export your video with beautiful captions!',
      startTime: 7.5,
      endTime: 11,
      words: [
        { text: 'Export', startTime: 7.5, endTime: 8 },
        { text: 'your', startTime: 8.1, endTime: 8.4 },
        { text: 'video', startTime: 8.5, endTime: 8.9 },
        { text: 'with', startTime: 9, endTime: 9.3 },
        { text: 'beautiful', startTime: 9.4, endTime: 10 },
        { text: 'captions!', startTime: 10.1, endTime: 11 },
      ],
    },
  ];
}
