export interface Project {
  id: number;
  title: string;
  videoUrl: string; // Full video (Vimeo)
  previewUrl?: string; // Preview video (Kinescope)
  description: string;
  software: string[];
  date: string;
  styleframes?: string[];
}

export type ViewState = 'HOME' | 'PROJECT_DETAIL';

export type Language = 'EN' | 'RU';