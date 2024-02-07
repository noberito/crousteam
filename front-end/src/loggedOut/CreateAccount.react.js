import React, { useContext, useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import CrousteamTextInput from '../common/CrousteamTextInput.react';
import CrousteamCard from '../common/CrousteamCard.react';
import AppContext from '../common/appcontext';
import colors from '../common/Colors.react';

import axios from 'axios';
import { baseUrl } from '../common/const';
import CrousteamButton from '../common/CrousteamButton.react';

const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 16,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 24,
    color: colors.primaryText,
    fontFamily: 'Arista-Pro-Alternate-Bold-trial'
  },
  incorrectWarning: {
    backgroundColor: '#FF8A80',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  buttonRow: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flexGrow: 1,
    padding: 2
  },
  Text: {
    fontFamily: 'Arista-Pro-Alternate-Bold-trial',
    fontSize: 24,
  }
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
    <CrousteamCard>
      <View
        style={styles.titleContainer}>
        <Text
          style={styles.title}>
          CREATE ACCOUNT
        </Text>
      </View>
      {hasFailure && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          Something went wrong while creating the user
        </Text>
      </View>}
      <CrousteamTextInput label="Username" value={username} onChangeText={value => setUsername(value)} />
      <CrousteamTextInput label="Password" value={password} onChangeText={value => setPassword(value)} />
      <View style={styles.buttonRow}>
        <CrousteamButton title="Continue" disabled={isLoading} styleText={styles.Text} onPress={() => { sendUserCreationRequest(); }} />
        <CrousteamButton title="Login" disabled={isLoading} styleText={styles.Text} onPress={() => { onCancel(); }} />
      </View>
    </CrousteamCard>
  );
}
