import React, {useState} from 'react';
import { Text, Button, View, StyleSheet, } from 'react-native';
import AllUsers from '../AllUsers.react';



const FrienderView = (authToken) => {
    <View>
      <AllUsers authToken={authToken}/>
    </View>
};

export default FrienderView;