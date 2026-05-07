export class FaceDetectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FaceDetectionError';
  }
}

export class NoFaceDetectedError extends FaceDetectionError {
  constructor() {
    super('No face detected in image');
    this.name = 'NoFaceDetectedError';
  }
}

export class LandmarkModelError extends FaceDetectionError {
  constructor(message: string) {
    super(message);
    this.name = 'LandmarkModelError';
  }
}
