import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

import REAnimated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const progressBarMaxWidth = width - 32;

const useProgressBarAnimation = (
  animationConfig: {
    enabled: boolean;
    duration: number;
    onAnimationEnd: () => void;
  },
  deps: Array<unknown>,
) => {
  const progressBarWidth = useSharedValue<number>(0);

  useEffect(() => {
    if (animationConfig.enabled) {
      const onAnimationEndCallback = () => {
        cancelAnimation(progressBarWidth);
        progressBarWidth.value = withTiming(0, { duration: 0 });
        animationConfig.onAnimationEnd();
      };
      progressBarWidth.value = withTiming(
        1,
        { duration: animationConfig.duration },
        (hasAnimationFinished) => {
          if (hasAnimationFinished) {
            runOnJS(onAnimationEndCallback)();
          }
        },
      );

      return () => {
        cancelAnimation(progressBarWidth);
        progressBarWidth.value = withTiming(0, { duration: 0 });
      };
    }
  }, [animationConfig.enabled, ...deps]);

  return progressBarWidth;
};

export default function Page() {
  // Demo story for the route - in a real app, this would come from route params or state
  const story = {
    id: '1',
    source: { uri: 'https://picsum.photos/400/800' }
  };

  const { id, source } = story;
  const [mediaLoadedAtTimestamp, setMediaLoadedAtTimestamp] = useState<
    number | null
  >(null);

  // Users can play pause
  const [storyPlayingStatus, setStoryPlayingStatus] = useState<
    "playing" | "paused"
  >("paused");

  const [storyDuration, setStoryDuration] = useState<number>(5000);

  const progressBarAnimVal = useProgressBarAnimation(
    {
      enabled:
        Boolean(id &&
        storyPlayingStatus === "playing" &&
        mediaLoadedAtTimestamp !== null),
      duration: storyDuration,
      onAnimationEnd: () => {

      }
    },
    [id],
  );

  function updateMediaLoaded() {
    setMediaLoadedAtTimestamp(performance.now());
    setStoryPlayingStatus("playing");
  }

  function onAnimationEnd() {
    // Move to next story
  }

  function onAnimationPause(percentRemaining: number) {
    setStoryDuration((prev) => prev * percentRemaining);
  }

  return (
    <>
      <ProgressBar
        animVal={progressBarAnimVal}
        onAnimationEnd={onAnimationEnd}
      />
      <Image source={source} style={styles.image} onLoad={updateMediaLoaded} />
    </>
  );
}

interface ProgressBarProps {
  animVal: SharedValue<number>;
  onAnimationEnd: () => void;
}

function ProgressBar(props: ProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        props.animVal.value,
        [0, 1],
        [0, progressBarMaxWidth],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <REAnimated.View
      style={(styles.progressBarContainer, { width: progressBarMaxWidth })}
    >
      <REAnimated.View
        style={(styles.progressBar, animatedStyle)}
      ></REAnimated.View>
    </REAnimated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    width,
    height,
  },
  progressBarContainer: {
    height: 1,
    backgroundColor: "#CBCBCB",
  },
  progressBar: {
    height: 1,
    backgroundColor: "#FFFFFF",
  },
});