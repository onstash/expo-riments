import { Pressable, StyleSheet, Text, View } from "react-native";
import REAnimated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

const FloatingActionButtonVariant1 = () => {
  const width = useSharedValue(60);
  const height = useSharedValue(60);
  const borderRadius = useSharedValue(50);
  const isOpen = useSharedValue(false);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0),
  );

  const onPressHandler = () => {
    if (isOpen.value) {
      width.value = withTiming(60);
      height.value = withTiming(60);
      borderRadius.value = withTiming(50);
      isOpen.value = false;
    } else {
      width.value = withSpring(200);
      height.value = withSpring(200);
      borderRadius.value = withSpring(10);
      isOpen.value = true;
    }
  };

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      borderRadius: borderRadius.value,
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <REAnimated.View style={[styles.container, animatedStyle]}>
        <Pressable style={styles.iconContainer} onPress={onPressHandler}>
          <REAnimated.View style={[styles.iconContainer, plusIcon]}>
            <AntDesign
              name="plus"
              size={26}
              color="white"
              style={styles.icon}
            />
          </REAnimated.View>
        </Pressable>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Entypo name="images" size={26} color="white" style={styles.icon} />
          </View>
          <Text style={styles.text}>Upload Photos</Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Entypo name="video" size={26} color="white" style={styles.icon} />
          </View>
          <Text style={styles.text}>Upload Video</Text>
        </View>
      </REAnimated.View>
    </View>
  );
};

export default FloatingActionButtonVariant1;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F56B3",
    position: "absolute",
    bottom: 30,
    right: 30,
    overflow: "hidden",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 26,
    height: 26,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
