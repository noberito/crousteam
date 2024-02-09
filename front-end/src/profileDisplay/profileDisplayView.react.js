import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList } from "react-native"
import { baseUrl } from '../common/const';
import axios from 'axios';
import CrousteamButton from '../common/CrousteamButton.react';
import AppContext from '../common/appcontext';
import colors from '../common/Colors.react';
import Line from '../common/Line.react';
import ReturnButton from '../common/ReturnButton.react';

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
    alignItems: 'center', // Center the content horizontally
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

export default function ProfileDisplayView({ gid, setGid, log, setLog, }) {

  const { username, setPage, authToken } = useContext(AppContext)

  const [preferences, setPreferences] = useState([])
  const [, setIsLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [lid, setLid] = useState();
  const [hasPermissionError, setPermissionError] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(false);
  const [hasFailure, setHasFailure] = useState(false);

  const getUserPreferences = () => {
    setIsLoading(true);
    axios({
      baseURL: baseUrl,
      url: `/preferences-for-given-user/${log}`,
      method: 'GET',
    }).then(response => {
      setIsLoading(false)
      if (response.status >= 200 && response.status < 300) {
        setHasFailure(false)
        setPreferences(response.data)
        console.log(`les préférences sélectionnées sont ${response.data}`)
      } else {
        setHasFailure(true)
      }
    }).catch(err => {
      console.error(`something went wrong ${err.message}`)
      setIsLoading(false)
      setHasFailure(true)
    })
  }


  const getGid = useCallback(() => {
    setIsLoading(true)
    axios({
      baseURL: baseUrl,
      url: '/group-gid',
      method: 'GET',
      headers: { Authorization: 'Bearer ' + authToken },
      params: { login2: log }
    }).then(response => {
      setIsLoading(false); // Set refreshing to false when data is loaded
      if (response.status == 200) {
        const parsedData1 = response.data
        setGid(parsedData1.gid);
        setPermissionError(false);
      } else if (response.status == 403) {
        setPermissionError(true);
      }
    }).catch(err => {
      console.error(`Something went wrong when getting the gid ${err.message}`);
      setIsLoading(false);
    });
  }, [postGid]);


  const postGid = useCallback(() => {
    setIsPosting(true);
    axios({
      baseURL: baseUrl, // Assurez-vous que baseUrl est défini quelque part dans votre code
      url: '/group-chat-2', // Modifiez ceci par l'URL appropriée pour poster un message
      method: 'POST',
      headers: { Authorization: 'Bearer ' + authToken },
      data: {
        login1: username, // Supposé que 'username' est l'utilisateur actuel, sinon ajustez selon le contexte
        login2: log, // Ajustez le nom de cette propriété selon votre API
      }
    }).then(response => {
      setIsPosting(false);
      if (response.status === 200 || response.status === 201) {
        // Message posté avec succès
        console.log(response.data)
        setGid(response.data)
        console.log('Group posted successfully');
        // Vous pouvez ici actualiser la liste des messages ou gérer la réponse comme souhaité
      }

      else {
        // Gérer d'autres codes de statut selon votre API
        setPostError(true);
      }

    }).catch(err => {
      console.error(`Something went wrong while posting the group: ${err.message}`);
      setIsPosting(false);
      setPostError(true);
    });
  },); // Ajoutez d'autres dépendances si nécessaire

  const loadInfo = () => {
    setIsLoading(true);

    console.log(`Request GET on ${baseUrl}/all-info`)

    axios({
      baseURL: baseUrl,
      url: `/all-info/${log}`,
      method: 'GET',
      // auth : {username : username, password : password} "Property 'btoa' doesn't exist"
    }).then(result => {
      console.log('OK ! ' + result.data)
      setIsLoading(false)
      setInfo(result.data)
      setLid(info['naissance'])
    }).catch(err => {
      console.error(`something went wrong here: ${err.message}`)
      alert(`something went wrong: ${err.message}`)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadInfo();
    getUserPreferences();
    getGid();
  }, [authToken]);

  const BoutonChat = () => {
    if (gid == "") {
      return (
        <CrousteamButton title="Ajout ami" styleText={styles.Text} onPress={() => { postGid() }} />
      )
    }
    else {
      return (
        <CrousteamButton title="CHAT" styleText={styles.Text} onPress={() => { setPage("chatdisplay") }} />
      )
    }
  }

  const renderItem = ({ item }) => { return (<Text style={styles.preferenceItem}> {item}</Text>) }

  return (
    <View style={styles.mainContainer}>
      <ReturnButton title="Retour" onPress={() => { setLog('null'); setPage("friender") }}></ReturnButton>
      <View style={styles.identityContainer}>
        <Image style={styles.image} source={require('../loggedOut/ic_launcher_round.png')}></Image>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{info[1]} {info[2]} </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.secondaryText, fontWeight: 'bold' }} >@</Text>
            <Text style={styles.pseudo}>{log}</Text>
          </View>
        </View>
      </View>
      <Line />
      <Text style={styles.sectionTitle}> BIOGRAPHY</Text>
      <View style={styles.biographyContainer}>
        <Text style={styles.biography}>{info[3]}</Text>
      </View>
      <Line />
      <Text style={styles.sectionTitle}> PREFERENCES </Text>
      <View style={styles.biographyContainer}>
        <FlatList
          data={preferences}
          keyExtractor={(item) => { item }}
          renderItem={renderItem} />
      </View>
      <View style={styles.buttonContainer}>
        <BoutonChat />
      </View>

    </View>
  )
};