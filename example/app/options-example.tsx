import { createAnimatedPressable } from 'pressto';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { interpolate, interpolateColor } from 'react-native-reanimated';

// Pressable that responds to all three option states
const PressableToggle = createAnimatedPressable(
  (progress, { isPressed, isToggled, isSelected }) => {
    'worklet';

    // Base scale animation on press - uses progress AND isPressed
    const scale = interpolate(progress, [0, 1], [1, 0.95]);

    // Additional opacity change when actively pressed
    const opacity = isPressed ? 0.9 : 1;

    // Background color changes based on toggle state
    const backgroundColor = interpolateColor(
      progress,
      [0, 1],
      isToggled
        ? ['#4CAF50', '#388E3C'] // Green when toggled
        : ['#2196F3', '#1976D2'] // Blue when not toggled
    );

    // Slight rotation when toggled
    const rotate = isToggled ? '5deg' : '0deg';

    // Add a border for selected items
    const borderWidth = isSelected ? 3 : 0;
    const borderColor = '#FFD700'; // Gold border

    return {
      transform: [{ scale }, { rotate }],
      backgroundColor,
      borderWidth,
      borderColor,
      opacity,
    };
  }
);

type ToggleState = { isToggled: boolean; isSelected: boolean };
const initialButtonState: ToggleState = { isToggled: false, isSelected: false };

export default function OptionsExample() {
  // Mirror each button's pressto options (isToggled/isSelected) into React
  // state so the result is rendered as text — visible in the demo and
  // assertable by e2e on both iOS and Android.
  const [state, setState] = useState<{
    b1: ToggleState;
    b2: ToggleState;
    b3: ToggleState;
  }>({
    b1: initialButtonState,
    b2: { isToggled: true, isSelected: false },
    b3: initialButtonState,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pressable Options Demo</Text>
      <Text style={styles.subtitle}>
        • isPressed: Active during press{'\n'}• isToggled: Flips on each press
        (green when toggled){'\n'}• isSelected: Gold border on last pressed
        button{'\n'}• Callbacks receive options object
      </Text>

      <View style={styles.section}>
        <PressableToggle
          testID="options-button-1"
          style={styles.item}
          onPress={(options) => {
            setState((s) => ({ ...s, b1: options }));
          }}
        >
          <Text style={styles.itemText}>Button 1</Text>
          <Text testID="options-status-1" style={styles.hint}>
            {`btn1 toggled=${state.b1.isToggled} selected=${state.b1.isSelected}`}
          </Text>
        </PressableToggle>

        <PressableToggle
          testID="options-button-2"
          style={styles.item}
          initialToggled={true}
          onPress={(options) => {
            setState((s) => ({ ...s, b2: options }));
          }}
        >
          <Text style={styles.itemText}>Button 2 (starts toggled)</Text>
          <Text testID="options-status-2" style={styles.hint}>
            {`btn2 toggled=${state.b2.isToggled} selected=${state.b2.isSelected}`}
          </Text>
        </PressableToggle>

        <PressableToggle
          testID="options-button-3"
          style={styles.item}
          onPress={(options) => {
            setState((s) => ({ ...s, b3: options }));
          }}
        >
          <Text style={styles.itemText}>Button 3</Text>
          <Text testID="options-status-3" style={styles.hint}>
            {`btn3 toggled=${state.b3.isToggled} selected=${state.b3.isSelected}`}
          </Text>
        </PressableToggle>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
  },
  section: {
    gap: 12,
  },
  item: {
    padding: 20,
    borderRadius: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  checkmark: {
    fontSize: 20,
    color: '#fff',
  },
});
