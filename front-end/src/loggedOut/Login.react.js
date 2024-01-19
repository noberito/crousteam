import React, { useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import KivTextInput from '../common/KivTextInput.react';
import KivCard from '../common/KivCard.react';

import axios from 'axios';
import { baseUrl } from '../common/const';
import { encode } from 'base-64';


const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 16,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 24,
  },
  incorrectWarning: {
    backgroundColor: '#FF8A80',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row'
  },
  button: {
    flexGrow: 1,
    padding: 2
  },
});

/**
 * Login component with User & Password
 * @param {(username:string, authToken:string) => {}} onSuccess
 * @param {() => {}} onCancel
 */
export default function Login({ onSuccess, onCancel }) {
  const [username, setUsername] = useState('kiva');
  const [password, setPassword] = useState('bien');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInvalidLogin, setHasInvalidLogin] = useState(false);

  const sendLoginRequest = () => {
    setIsLoading(true);

    console.log(`Request GET on ${baseUrl}/login`)

    axios({
      baseURL : baseUrl,
      url : '/login',
      method : 'GET',
      headers : {'Authorization' : 'Basic ' + encode(username + ':' + password)}
      // auth : {username : username, password : password} "Property 'btoa' doesn't exist"
    }).then(result => { 
      console.log('OK ! ' + result.data)
      setIsLoading(false)
      if (result.status == 200) {
        setHasInvalidLogin(false)
        onSuccess(username, result.data)
      } else {
        setHasInvalidLogin(true)
      }
    }).catch(err => {
      console.error(`something went wrong: ${err.message}`)
      alert(`something went wrong: ${err.message}`)
      setIsLoading(false)
      setHasInvalidLogin(true)
    })
  }

  return (
    <KivCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          Login
        </Text>
      </View>
      {hasInvalidLogin && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          The username or password is incorrect
        </Text>
      </View>}
      <KivTextInput label="Username" value={username} onChangeText={value => setUsername(value)} />
      <KivTextInput label="Password" value={password} onChangeText={value => setPassword(value)} />
      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button title="< Create Account" disabled={isLoading} onPress={() => { onCancel(); }} />
        </View>
        <View style={styles.button}>
          <Button title="Login" disabled={isLoading} onPress={() => { sendLoginRequest(); }} />
        </View>
      </View>
    </KivCard>
  );
}
