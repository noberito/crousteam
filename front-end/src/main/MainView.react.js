import React, {useState} from 'react';
import { Button, View, StyleSheet, } from 'react-native';
import AllUsers from './AllUsers.react';
import BottomBar from './BottomBar.react';
import Menu from './Menu.react';

const styles = StyleSheet.create({
  mainContainer: {
    flex:1,
    padding:16,
    justifyContent:"space-between"
  },
  cardContainer: {
    flexGrow:1,
    justifyContent:'center',
    marginBottom:8,
  },
  footer: {
    flexBasis:100,
  }
});

/**
 *
 * @param {string} authToken authToken for the authenticated queries
 * @param {()=>{}} logOutUser return to the logged out state
 * @returns
 */


export default function MainView({ authToken, logoutUser}) {
  const [page, setPage] = useState('friender')
  return (
    <View style = {styles.mainContainer}>
      <Menu choixPage={page} authToken={authToken}/>
      <View style = {styles.footer}>
        <BottomBar page={page} setPage={setPage}/>
      </View>
    </View>
  );
}
