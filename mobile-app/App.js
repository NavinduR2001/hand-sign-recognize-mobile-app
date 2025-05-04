
import { StyleSheet, Text, View } from 'react-native';
import Example from './components/Example';

export default function App() {
  return (
    <View style={styles.container}>
     <Example/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
});