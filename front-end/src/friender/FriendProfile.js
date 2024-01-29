import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Define the color palette from the uploaded image
const colors = {
  background: '#f6edce', // Example background color
  primaryText: '#fcb63c', // Example primary text color
  secondaryText: '#f8871f', // Example secondary text color
  accent: '#ec3124', // Example accent color
};

// Define the styles based on the color palette
const styles = StyleSheet.create({
  profile: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 3, // for Android
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4,
  },
  pseudo: {
    fontSize: 24,
    fontFamily:'Arista-Pro-Alternate-Bold-trial',
    marginBottom: 8,
    color: colors.primaryText,
  },
  bio: {
    fontSize: 16,
    color: colors.secondaryText,
    fontFamily:'Arista-Pro-Alternate-Bold-trial',
    textAlign: 'center',
  },
});

// Usage of UserBio component
export default function FriendProfile({setPage, setLog, item, key}) {
      return(
      <TouchableOpacity onPress={() => {setLog(item.name); setPage('profiledisplay')}}>
      <View style={styles.profile}>
        <Text style={styles.pseudo}>{item.name}</Text>
        <Text style={styles.bio}>{item.isAdmin ? ' - Admin' : null}</Text>
      </View>
      </TouchableOpacity>)
    };
