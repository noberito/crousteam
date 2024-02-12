Listeventview
import React, { useContext, useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BottomBar from '../friender/BottomBar.react';
import AppContext from '../common/appcontext';
import AllEvents from './AllEvents.react';
import CrousteamButton from '../common/CrousteamButton.react';
import MYEvents from '../MyEvent/MYEvents.react';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '10%'
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
    correction: {
        width: '20%',
    },
    Text: { fontSize: 5 }
});



export default function ListEventView({ eid, setEid, gid, setGid }) {
    const { page, setPage } = useContext(AppContext)
    const [state, setState] = useState('ALL')

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <Image source={require('../loggedOut/ic_launcher_round.png')}></Image>
                <CrousteamButton title="My events" styleText={styles.Text} onPress={() => { setPage('mylistevent') }}></CrousteamButton>
                <CrousteamButton title="All events" onPress={() => { setPage('listevent') }}></CrousteamButton>
                <View style={styles.correction}>
                    <CrousteamButton title="+" onPress={() => { setPage('addevent') }}></CrousteamButton>
                </View>
            </View>
            <View style={{ height: '78%' }}>
                <AllEvents eid={eid} setGid={setGid} />
            </View>
            <View style={styles.footer}>
                <BottomBar page={page} setPage={setPage} />
            </View>
        </View>
    );
};
