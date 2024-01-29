import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import FriendProfile from './FriendProfile';

export default function AllFriends({username, page, setPage, log, setLog, authToken }) {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermissionError, setPermissionError] = useState(false);

  const getAllUsersRequest = useCallback(() => {
    setIsLoading(true);
    // Set refreshing to true when we are loading data on pull to refresh
    setRefreshing(true);
    axios({
      baseURL : baseUrl,
      url : '/profile',
      method : 'GET',
      headers : { Authorization : 'Bearer ' + authToken},
    }).then(response => {
      setIsLoading(false);
      setRefreshing(false); // Set refreshing to false when data is loaded
      if (response.status == 200) {
        const parsedData = response.data.map(user => ({
          login: user[1], bio: user[3]
        }));
        console.log(parsedData);
        setUsers(parsedData);
        setPermissionError(false);
      } else if(response.status == 403) {
        setPermissionError(true);
      }
    }).catch(err => {
      console.error(`Something went wrong ${err.message}`);
      setIsLoading(false);
      setRefreshing(false); 
    });
  }, [authToken]);

  useEffect(() => {
    getAllUsersRequest();
  }, [authToken, getAllUsersRequest]);

  const renderItem = ({item}) => <FriendProfile setPage={setPage} setLog={setLog} item={item}/>;

  return (
    <View>
      {hasPermissionError && <View style={styles.incorrectWarning}>
        <Text style={styles.inputLabel}>
          Access Forbidden
        </Text>
      </View>}
      {isLoading && <ActivityIndicator size='large' animating={true} color='#FF0000' />}
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.login}
        // Add RefreshControl to FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={getAllUsersRequest}
            colors={['#FF0000']} // Customize the color of the spinner
          />
        }
      />
    </View>
  );
}
