import React, {useState} from 'react';
import { Text, Button, View, StyleSheet, } from 'react-native';
import AllUsers from '../AllUsers.react';

const styles = StyleSheet.create({
    mainContainer: {
      flexGrow:1,
    },
    cardContainer: {
      flexGrow:1,
      justifyContent:'center',
      marginBottom:8,
    },
    bottom: {
      flexBasis:100,
    },
  });

const FrienderView = (authToken) => {
    <View
    style={styles.cardContainer}>
        <AllUsers authToken={authToken}/>
    </View>
};

export default FrienderView;