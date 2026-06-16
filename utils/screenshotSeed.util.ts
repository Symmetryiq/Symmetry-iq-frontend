import { usePlanStore } from '@/hooks/usePlanStore';
import { ScanScores, useScanStore } from '@/hooks/useScanStore';
import { Image } from 'react-native';

/**
 * Plausible feature scores for screenshot/demo builds. All features are
 * "higher is better", so a mix of high (green) and mid (yellow) values shows
 * the app has something to work on without looking broken.
 */
const SAMPLE_SCORES: ScanScores = {
  overall_symmetry: 82,
  facial_thirds: 71,
  eye_alignment: 88,
  nose_centering: 79,
  jawline_symmetry: 68,
  chin_alignment: 84,
  lower_face_proportion: 76,
  eye_spacing_ratio: 73,
};

const SAMPLE_IMAGE_URI =
  Image.resolveAssetSource(require('@/assets/images/scan.jpg')).uri;

/**
 * Seeds a realistic scan + 4-week plan so the result and tab screens can be
 * captured on a Simulator without running on-device face detection.
 * Only ever called behind the SCREENSHOT_MODE flag.
 */
export function seedSampleScan(): void {
  useScanStore.getState().saveScan(SAMPLE_IMAGE_URI, SAMPLE_SCORES);
  const scan = useScanStore.getState().currentScan;
  if (scan) {
    usePlanStore.getState().regenerate(scan.scores, scan.id);
  }
}
