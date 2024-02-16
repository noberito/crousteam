import React, {useState, useEffect, useContext} from 'react';
import {Text, Button, View, StyleSheet} from 'react-native';
import axios from 'axios';
import {baseUrl} from '../common/const';
import KivTextInput from '../common/CrousteamTextInput.react';
import KivCard from '../common/CrousteamCard.react';
import AppContext from '../common/appcontext';
import CrousteamButton from '../common/CrousteamButton.react';
import CrousteamCard from '../common/CrousteamCard.react';
import colors from '../common/Colors.react';
import ReturnButton from '../common/ReturnButton.react';
import uploadImage from '../loggedOut/ImageUploader';
import KivImagePicker from '../loggedOut/ImagePick';

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Arista-Pro-Alternate-Bold-trial',
    fontSize: 40,
    color: colors.secondaryText,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#f8871f',
    fontFamily: 'Arista-Pro-Alternate-Bold-trial',
    marginBottom:0
  },
});
export default function GeneralSettingsView({}) {
  const [info, setInfo] = useState([]);
  const [lid, setLid] = useState();
  const {username, setUsername, setPage, authToken} = useContext(AppContext);

  const [login, setLogin] = useState('');
  const [filePath, setFilePath] = useState(null);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [naissance, setNaissance] = useState('1999-01-08');
  const [photoPath, setPhotopath] = useState('');
  const [bio, setBio] = useState();
  const [oldPath, setOldPath] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const loadInfo = () => {
    setIsLoading(true);

    console.log(`Request GET on ${baseUrl}/all-info`);

    axios({
      baseURL: baseUrl,
      url: `/all-info`,
      method: 'GET',
      headers: {Authorization: 'Bearer ' + authToken},
      // auth : {username : username, password : password} "Property 'btoa' doesn't exist"
    })
      .then(result => {
        console.log('OK ! ' + result.data);
        setIsLoading(false);
        setInfo(result.data);
        setFirstName(result.data[1]);
        setLastName(result.data[2]);
        setBio(result.data[3]);
        if(result.data[4])
        setNaissance(result.data[4]);
        setPhotopath(result.data[5]);
        setLid(info['naissance']);
      })
      .catch(err => {
        console.error(`something went wrong: ${err.message}`);
        alert(`something went wrong: ${err.message}`);
        setIsLoading(false);
      });
  };

  const SubmitInfo = async () => {
    setIsLoading(true);
    console.log("user is " + username + " Prev image is ", photoPath);
    const resup = await uploadImage(filePath, username, baseUrl); // No need to convert to string
    setPhotopath(resup);
  };

  useEffect(() => {
    // This useEffect will trigger whenever photoPath changes
    if (photoPath !== '') {
      console.log("new photo path ", photoPath);
      console.log(`Request GET on ${baseUrl}/profile`);
  
      axios({
        baseURL: baseUrl,
        url: `/profile`,
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + authToken },
        data: { firstName, lastName, bio, naissance, photoPath },
      })
        .then(result => {
          console.log('OK ! results submitted are : ' + result.data);
          setIsLoading(false);
          setInfo(result.data);
          setLid(info['naissance']);
        })
        .catch(err => {
          console.error(`something went wrong in: ${err.message}`);
          alert(`something went wrong: ${err.message}`);
          setIsLoading(false);
        });
    }
  }, [photoPath]);

  useEffect(() => {
    loadInfo();
  }, []);

  const styles = StyleSheet.create({
    titleContainer: {
      paddingBottom: 16,

      alignItems: 'center',

      width: '100%',
    },

    title: {
      fontSize: 40,
      fontFamily: 'Arista-Pro-Alternate-Bold-trial',
      color: colors.secondaryText,
      marginBottom: 10,
    },
    buttonRow: {
      flexDirection: 'row',
    },
    button: {
      flexGrow: 1,
      padding: 2,
      alignItems: 'center',
    },
    Text: {
      fontFamily: 'Arista-Pro-Alternate-Bold-trial',
      fontSize: 24,
    },
  });

  return (
    <View>
      <ReturnButton
        onPress={() => {
          setPage('myprofile');
        }}
        title="Retour"></ReturnButton>

      <CrousteamCard>
        <View style={styles.titleContainer}>
          <Text style={styles.title}> GENERAL SETTINGS </Text>
        </View>
        <KivTextInput
          label="Login"
          value={username}
          onChangeText={value => setPseudo(value)}
        />
        <KivTextInput
          label="First Name"
          value={firstName}
          onChangeText={value => setFirstName(value)}
        />
        <KivTextInput
          label="Last Name"
          value={lastName}
          onChangeText={value => setLastName(value)}
        />
        <KivTextInput
          label="naissance"
          value={naissance}
          onChangeText={value => setNaissance(value)}
        />
        <KivTextInput
          label="bio"
          value={bio}
          onChangeText={value => setBio(value)}
        />
        <Text style={styles.inputLabel}>Import Profile Photo</Text>
        <View style={{flex: 1, height: 200, marginBottom: 200}}>
          <KivImagePicker filePath={filePath} setFilePath={setFilePath}  />
          
        </View>
        <CrousteamButton
          title="Submit changes"
          disabled={isLoading}
          styleText={styles.Text}
          onPress={() => {
            SubmitInfo();
            setPage('myprofile');
          }}
        />
      </CrousteamCard>
      <CrousteamButton
        title="Retour"
        onPress={() => {
          setPage('myprofile');
        }}></CrousteamButton>
    </View>
  );
}
