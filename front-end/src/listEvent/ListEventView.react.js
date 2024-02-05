import React, {useContext, useCallback, useState, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BottomBar from '../friender/BottomBar.react';
import AppContext from '../common/appcontext';
import AllEvents from './AllEvents.react';

const styles = StyleSheet.create({
    header:{
        justifyContent:'center',
        alignItems:'center',
        height:'5%'
      },
    footer: {
        flexBasis: '8%',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    mainContainer: {
        flex: 1,
        padding: 16,
        justifyContent: "space-between"
      },
});



export default function ListEventView({ }) {
    const {page, setPage, authToken} = useContext(AppContext)  

    const [events, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasPermissionError, setPermissionError] = useState(false);

  const getAllPossibleFriendsRequest = useCallback(() => {
    setIsLoading(true);
    // Set refreshing to true when we are loading data on pull to refresh
    axios({
      baseURL : baseUrl,
      url : '/event',
      method : 'GET',
      headers : { Authorization : 'Bearer ' + authToken},
    }).then(response => {
      setIsLoading(false);
      setRefreshing(false); // Set refreshing to false when data is loaded
      if (response.status == 200) {
        const parsedData = response.data.map(event => ({
          eid: event[0], bio: event[1]
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
    getAllPossibleFriendsRequest();
  }, [authToken, getAllPossibleFriendsRequest]);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <Image source={require('../loggedOut/ic_launcher_round.png')}></Image>
            </View>
            <View style={{height:'78%'}}>
                <AllEvents/>
            </View>
            <View style={styles.footer}>
                <BottomBar page={page} setPage={setPage} />
            </View>
        </View>
    );
};