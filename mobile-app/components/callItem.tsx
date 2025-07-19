import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  name: string;
  time: string;
  image: ImageSourcePropType;
};

const CallItem = ({ name, time, image }: Props) => (
  <View style={styles.item}>
    <Image source={image} style={styles.avatar} />
    <View style={styles.info}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
    <TouchableOpacity>
      <Ionicons name="videocam" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3299FF',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  time: { fontSize: 12, color: 'white' },
});

export default CallItem;
