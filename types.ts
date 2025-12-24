
export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16'
}

export interface GenerationState {
  originalImage: string | null;
  career: string;
  ratio: AspectRatio;
  resultImage: string | null;
  isGenerating: boolean;
  error: string | null;
}
