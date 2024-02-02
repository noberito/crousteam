import React, { useCallback, useContext, useState } from 'react';
import { TextInput, View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import colors from '../common/Colors.react';
import CrousteamTextInput from '../common/CrousteamTextInput.react';
import AppContext from '../common/appcontext';
import axios from 'axios';
import { baseUrl } from '../common/const';
import { counterEvent } from 'react-native/Libraries/Performance/Systrace';

const styles = StyleSheet.create({
  postButton:{
    backgroundColor:colors.primaryText,
    justifyContent:'center',
    alignItems:'center',
    height:'auto',
    width:'7%',
    borderRadius: 10,
    margin:10,
    elevation: 3, // for Android
    shadowColor: colors.secondaryText, 
    shadowOffset: { width: 0, height: 7 }, 
  },
  message:{
    color: 'black',
    width:'90%',
    margin: 10,
    backgroundColor: colors.background,
    borderRadius: 4,
    fontFamily:'Arista-Pro-Alternate-Bold-trial',
    elevation: 3, // for Android
    shadowColor: colors.secondaryText, 
    shadowOffset: { width: 0, height: 7 }, 
  },
  messageText:{
    fontFamily:'Arista-Pro-Alternate-Bold-trial'
  },
  iconPost:{
    fontSize:40
  }
});

const MessageInput= ({gid, username}) => {
  
    const defaultContent = 'Hello'
    const { authToken } = useContext(AppContext);
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState(false);
    const [content, setContent] = useState(defaultContent)

    const postMessage = useCallback(() => {
        setIsPosting(true);
        axios({
            baseURL: baseUrl, // Assurez-vous que baseUrl est défini quelque part dans votre code
            url: '/messages', // Modifiez ceci par l'URL appropriée pour poster un message
            method: 'POST',
            headers: { Authorization: 'Bearer ' + authToken },
            data: {
                login: username, // Supposé que 'username' est l'utilisateur actuel, sinon ajustez selon le contexte
                mtext: content,
                gid: gid, // Ajustez le nom de cette propriété selon votre API
            }
        }).then(response => {
            setIsPosting(false);
            if (response.status === 200 || response.status === 201) {
        // Message posté avec succès
                console.log(username, content, gid)
                console.log('Message posted successfully');
        // Vous pouvez ici actualiser la liste des messages ou gérer la réponse comme souhaité
            } else {
        // Gérer d'autres codes de statut selon votre API
                setPostError(true);
            }
        }).catch(err => {
            console.error(`Something went wrong while posting the message: ${err.message}`);
            setIsPosting(false);
             setPostError(true);
            });
        }, ); // Ajoutez d'autres dépendances si nécessaire

    return(
        <View style={{flexDirection:'row'}}>
        <TextInput style={styles.message} value={content} onChangeText={(text) => setContent(text)} placeholder="Enter a chat">
        </TextInput>
        <TouchableOpacity style={styles.postButton} onPress={() => {console.log(username, content, gid), postMessage(), setContent('')}}  >
            <Text style={styles.iconPost}>{'>'}</Text>
        </TouchableOpacity>
        </View>
)};

export default MessageInput;