import { Colors } from '@/constants/theme'
import { getColorByScore } from '@/helpers/analyze'
import { scale, verticalScale } from '@/helpers/scale'
import { router } from 'expo-router'
import { ArrowRightIcon } from 'phosphor-react-native'
import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import Typography from './common/typography'

import { Scan } from '@/stores/scan-store'

interface PastScoreProps {
  scan: Scan
}

const PastScore = ({ scan }: PastScoreProps) => {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(scan.scanDate));

  const overallScore = Math.round(scan.scores.overallSymmetry);
  const jawSymmetry = Math.round(scan.scores.jawlineSymmetry);


  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('@/assets/images/face-capture.jpg')}
          style={styles.image}
        />
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <Typography size={18} color='onMuted'>{formattedDate}</Typography>

        <View style={styles.progressBarWrapper}>
          <View style={{ gap: verticalScale(4) }}>
            <View style={styles.progressBarContainer}>
              <Typography size={14} color='onTertiary' font='semiBold'>Overall Score</Typography>
              <Typography size={16} color='onPrimary' font='semiBold'>{overallScore}%</Typography>
            </View>

            <ProgressBar progress={overallScore} />
          </View>

          <View style={{ gap: verticalScale(4) }}>
            <View style={styles.progressBarContainer}>
              <Typography size={14} color='onTertiary' font='semiBold'>Jaw Symmetry</Typography>
              <Typography size={16} color='onPrimary' font='semiBold'>{jawSymmetry}%</Typography>
            </View>

            <ProgressBar progress={jawSymmetry} />
          </View>
        </View>

        <View style={{ alignSelf: 'flex-end' }}>
          <Pressable
            onPress={() => router.push({
              pathname: '/insights',
              params: { scanId: scan['_id'] }
            })}
            style={{ flexDirection: 'row', alignItems: 'center', gap: scale(4) }}
          >
            <Typography color='onSecondary'>View Details</Typography>
            <ArrowRightIcon size={16} color={Colors.onSecondary} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default PastScore

function ProgressBar({ progress }: { progress: number }) {

  return (
    <View style={styles.progressBar}>
      <View style={[styles.progress, { width: `${progress}%`, backgroundColor: getColorByScore(progress) }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: verticalScale(28),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(16)
  },

  imageWrapper: {
    width: scale(140),
    aspectRatio: 1,
    borderRadius: verticalScale(28),
    overflow: 'hidden',
  },

  image: {
    height: '100%',
    width: '100%',
  },

  contentWrapper: {
    gap: verticalScale(12),
    flex: 1
  },

  progressBarWrapper: {
    gap: verticalScale(8)
  },

  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  progressBar: {
    height: verticalScale(8),
    borderRadius: 200,
    backgroundColor: Colors.border,
    overflow: 'hidden'
  },

  progress: {
    height: '100%',
    borderRadius: 200,
    backgroundColor: Colors.primary
  }
})