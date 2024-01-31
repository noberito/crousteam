import React, { useContext, useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import KivTextInput from '../common/CrouisteamTextInput.react';
import KivCard from '../common/CrousteamCard.react';
import AppContext from '../common/appcontext';

import axios from 'axios';
import { baseUrl } from '../common/const';

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

export default function CreateAccount({ onSuccess, onCancel }) {

  const [isLoading, setIsLoading] = useState(false);
  const [hasFailure, setHasFailure] = useState(false);

  const { setUsername, setPassword, username, password } = useContext(AppContext);

  const sendUserCreationRequest = () => { // get the lid from the server after sending post
    setUsername(username);
    setPassword(password);
    onSuccess()
  }

  return (
    <KivCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          Create Account
        </Text>
      </View>
      {hasFailure && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          Something went wrong while creating the user
        </Text>
      </View>}
      <KivTextInput label="Username" value={username} onChangeText={value => setUsername(value)} />
      <KivTextInput label="Password" value={password} onChangeText={value => setPassword(value)} />
      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button title="< Login" disabled={isLoading} onPress={() => { onCancel(); }} />
        </View>
        <View style={styles.button}>
          <Button title="Continue" disabled={isLoading} onPress={() => { sendUserCreationRequest(); }} />
        </View>
      </View>
    </KivCard>
  );
}
