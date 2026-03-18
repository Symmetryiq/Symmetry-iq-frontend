export interface Score {
  overall: number;
  thirds: number;
  mid: number;
  jaw: number;
  puff: number;
  ret: number;
  clar: number;
  sleep: number;
  smile: number;
  brow: number;
  eye: number;
  nose: number;
  mouth: number;
  chin: number;
  tilt: number;
}

export interface Scan {
  id: string;
  userId: string;
  scores: Score;
  createdAt: string;
  updatedAt: string;
}
