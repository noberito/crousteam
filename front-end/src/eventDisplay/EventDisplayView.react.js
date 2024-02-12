import React, { useContext, useState, useCallback, useEffect, Image } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import AppContext from '../common/appcontext';
import CrousteamButton from '../common/CrousteamButton.react';
import ReturnButton from '../common/ReturnButton.react'
import colors from '../common/Colors.react';
import Line from '../common/Line.react';



export default function EventDisplayView({ eid, setEid, gid, setGid }) {
  const { username, setPage, authToken } = useContext(AppContext)

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermissionError, setPermissionError] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(false);
  const [info, setInfo] = useState([[]]);

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      padding: 16,
      justifyContent: ""
    },

    identityContainer: {
      flexDirection: 'row',
      flexGrow: 0.4,
      justifyContent: 'space-between',
    },
    footer: {
      // Ensure the footer is always at the bottom
      // FlexBasis removed to allow the footer to grow with its content up to 8% of the container
      // If the BottomBar component has its own padding, this might not be necessary
      height: '8%', // You can use height instead of flexBasis for a fixed height footer
    },
    image: {
      width: '30%',
      height: '70%',
      marginLeft: '10%'
    },
    nameContainer: {
      marginRight: '10%'
    },
    name: {
      fontFamily: 'Arista-Pro-Alternate-Bold-trial',
      fontSize: 40,
      color: colors.primaryText
    },
    pseudo: {
      fontFamily: 'Arista-Pro-Alternate-Bold-trial',
      fontSize: 20,
      color: colors.secondaryText
    },
    buttonContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    biographyContainer: {
      marginHorizontal: 20
    },
    biography: {
      marginBottom: 20,
      fontFamily: 'Arista-Pro-Alternate-Bold-trial',
      fontSize: 20,
      color: colors.primaryText
    },
    sectionTitle: {
      marginTop: 20,
      fontFamily: 'Arista-Pro-Alternate-Bold-trial',
      fontSize: 40,
      color: colors.secondaryText,
    },
    preferenceItem: {
      fontFamily: 'Arista-Pro-Alternate-Bold-trial',
      fontSize: 24,
      color: colors.primaryText
    },
    Text: {
      fontFamily: 'Arista-Pro-Alternate-Bold-trial',
      fontSize: 24,
    }

  });

  const getGroup = useCallback(() => {
    setIsLoading(true);
    // Set refreshing to true when we are loading data on pull to refresh
    setRefreshing(true);
    axios({
      baseURL: baseUrl,
      url: '/event-gid',
      method: 'GET',
      headers: { Authorization: 'Bearer ' + authToken },
      params: {
        eid: eid
      }
    }).then(response => {
      setIsLoading(false);
      setRefreshing(false); // Set refreshing to false when data is loaded
      if (response.status == 200) {
        console.log(response.data[0])
        setGid(response.data[0]);
        setPermissionError(false);
      } else if (response.status == 403) {
        setPermissionError(true);
      }
    }).catch(err => {
      console.error(`Something went wrong ${err.message}`);
      setIsLoading(false);
      setRefreshing(false);
    });
  }, [authToken]);

  const getInfo = () => {
    axios({
      baseURL: baseUrl,
      url: `/event-info/${gid}`,
      method: 'GET',
      headers: { Authorization: 'Bearer ' + authToken },
    }).then(response => {
      if (response.status == 200) {
        console.log(response.data);
        setInfo(response.data);
        setPermissionError(false);
      } else if (response.status == 403) {
        setPermissionError(true);
      }
    }
    ).catch(err => {
      console.error(`Something went wrong ${err.message}`);
      setIsLoading(false);
      setRefreshing(false);
    });
  }

  useEffect(() => {

    getInfo();
  }, [authToken, getGroup]);

  return (
    <View>
      <ReturnButton title="Retour" onPress={() => { setEid(-1); setPage("listevent") }}></ReturnButton>


      <View style={styles.identityContainer}>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{info[0][0]}  </Text>
        </View>
      </View>
      <Line />
      <Text style={styles.sectionTitle}> LOCALISATION</Text>
      <View style={styles.biographyContainer}>
        <Text style={styles.biography}>{info[0][1]} - {info[0][2]}</Text>

      </View>
      <Line />
      <Text style={styles.sectionTitle}> DESCRIPTION</Text>
      <View style={styles.biographyContainer}>
        <Text style={styles.biography}>{info[0][4]}</Text>
      </View>
      <Line />
      <Text style={styles.sectionTitle}> PREFERENCES </Text>

      <CrousteamButton title="Chat" styleText={styles.Text} onPress={() => { setPage("chatdisplay") }}></CrousteamButton>
    </View>
  );
};