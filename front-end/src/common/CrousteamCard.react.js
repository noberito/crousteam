import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from './Colors.react';

const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    backgroundColor: colors.background,
    width: '100%',
    padding: 16,
    borderRadius: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1,
    elevation: 6,
  },
});

export default function KivCard({ children }) {
  return (<View style={styles.container}>
    {children}
  </View>);
}
