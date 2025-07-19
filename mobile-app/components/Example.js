import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Example() {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Hi</Text>
        <StatusBar backgroundColor="darkblue"
         barStyle="light-content"
        style="light"
       />
       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
