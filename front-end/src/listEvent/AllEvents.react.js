import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import EventIcon from './EventIcon.react';
import AppContext from '../common/appcontext';
import axios from 'axios';
import { baseUrl } from '../common/const';

const styles = StyleSheet.create({
    
});



export default function AllEvents({eid, setEid, log, setLog}){

    const {page, setPage, authToken} = useContext(AppContext)  

    const [events, setEvents] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasPermissionError, setPermissionError] = useState(false);

  const getAllEvents = useCallback(() => {
    setIsLoading(true);
    // Set refreshing to true when we are loading data on pull to refresh
    axios({
      baseURL : baseUrl,
      url : '/events',
      method : 'GET',
      headers : { Authorization : 'Bearer ' + authToken},
    }).then(response => {
      setIsLoading(false);
      setRefreshing(false); // Set refreshing to false when data is loaded
      if (response.status == 200) {
        const parsedData = response.data.map(event => ({
          eid: event[0], title:event[1], loc: event[2], time:event[3], description:event[4]
        }));
        console.log(parsedData);
        setEvents(parsedData);
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
    getAllEvents();
  }, [authToken, getAllEvents]);
    
    
    const renderEventItem = ({item}) => {return(<EventIcon item={item} setEid={setEid}></EventIcon>)}

    return(
        <View>
        {isLoading && <ActivityIndicator size='large' animating={true} color='#FF0000' />}
            <FlatList
                data={events}
                keyExtractor={(item) => item.eid}
                renderItem={renderEventItem}
                numColumns={2}
            />
        </View>
)};