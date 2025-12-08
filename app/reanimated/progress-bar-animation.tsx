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

const clog = (...args: unknown[]) => console.log('@onstash', performance.now(), '->', ...args);

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
      clog('Animation enabled');
      const onAnimationEndCallback = () => {
        clog('Animation ended');
        cancelAnimation(progressBarWidth);
        clog('Animation cancelled');
        progressBarWidth.value = withTiming(0, { duration: 0 });
        clog('Animation reset');
        animationConfig.onAnimationEnd();
      };
      clog('Animation enabled', animationConfig.duration);
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
        clog('Animation disabled');
        cancelAnimation(progressBarWidth);
        progressBarWidth.value = withTiming(0, { duration: 0 });
        clog('Animation reset');
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

  const [storyDuration, setStoryDuration] = useState<number>(5000 * 3);

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
    clog('Media loaded');
    setMediaLoadedAtTimestamp(performance.now());
    clog('Media loaded at', mediaLoadedAtTimestamp);
    setStoryPlayingStatus("playing");
    clog('Story playing status', storyPlayingStatus);
  }

  function onAnimationEnd() {
    // Move to next story
    clog('Animation ended');
  }

  function onAnimationPause(percentRemaining: number) {
    setStoryDuration((prev) => prev * percentRemaining);
    clog('Animation paused', percentRemaining);
  }

  return (
    <>
      <ProgressBar
        animVal={progressBarAnimVal}
        onAnimationEnd={onAnimationEnd}
      />
      <REAnimated.View style={styles.pageContainer}>
      <Image source={source} style={styles.image} onLoad={updateMediaLoaded} />
      </REAnimated.View>
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
      style={[styles.progressBarContainer, { width: progressBarMaxWidth }]}
    >
      <REAnimated.View
        style={[styles.progressBar, animatedStyle]}
      ></REAnimated.View>
    </REAnimated.View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  image: {
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#CBCBCB",
    marginHorizontal: 16,
    zIndex: 2,
    borderRadius: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
});
