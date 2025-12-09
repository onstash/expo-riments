import { Button, StyleSheet, View } from "react-native";

export default function FloatingActionButtonVariant1() {
  return (
    <View style={styles.container}>
      <Button title="Floating Action Button" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
