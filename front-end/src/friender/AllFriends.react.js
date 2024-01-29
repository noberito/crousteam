import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import KivCard from '../common/KivCard.react';

import axios from 'axios';
import { baseUrl } from '../common/const';
import FriendProfile from './FriendProfile';

const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 16,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 24,
  },
  profilePicture: {
    width: 24,
    height: 24,
  },
  userRow: {
    flexDirection: 'row',
  },
  incorrectWarning: {
    backgroundColor: '#FF8A80',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
});

/**
 * Displays all the users in Kivapp
 */
export default function AllFriends({ authToken }) {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermissionError, setPermissionError] = useState(false);

  const getAllUsersRequest = () => {
    setIsLoading(true);
    axios({
      baseURL : baseUrl,
      url : '/users',
      method : 'GET',
      headers : { Authorization : 'Bearer ' + authToken}
    }).then(response => {
      setIsLoading(false);
      if (response.status == 200) {
        const parsedData = response.data.map(user => ({
          name: user[0], isAdmin: user[1]
        }))
        console.log(parsedData);
        setUsers(parsedData);
        setPermissionError(false);
      } else if(response.status == 403) {
        setPermissionError(true);
      }
    }).catch(err => {console.error(`Something went wrong ${err.message}`); setIsLoading(false)})
  }

  useEffect(() => {
    getAllUsersRequest();
  }, [authToken]);

  const renderItem = ({item}) => <FriendProfile item={item} key={item.lid} />;

  return (
    <View>
      {hasPermissionError && <View style={styles.incorrectWarning}>
        <Text
          style={styles.inputLabel}>
          Access Forbidden
        </Text>
      </View>}
      {isLoading &&
        <ActivityIndicator size='large' animating={true} color='#FF0000' />}
      {users != null ? <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.name}
      /> : null}
      <Button title="Reload" disabled={isLoading} onPress={() => { getAllUsersRequest(); }} />
    </View>
  );
}
