<<<<<<< HEAD
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Controller, useWatch } from "react-native"
=======
import React, { useEffect, useState, useContext} from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Controller, useWatch, ScrollView } from "react-native"
>>>>>>> 6635e0a (to push)
import { baseUrl } from '../common/const';
import axios from 'axios';
import CrousteamButton from '../common/CrousteamButton.react';
import AppContext from '../common/appcontext';
import ReturnButton from '../common/ReturnButton.react';
import CrousteamCard from '../common/CrousteamCard.react';
import colors from '../common/Colors.react';
import CrousteamTextInput from '../common/CrousteamTextInput.react';
import DatePicker from 'react-native-date-picker';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    title: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        fontSize: 40,
        marginBottom: 20,
        color: colors.secondaryText
    },
    titleContainer: {
        alignItems: 'center'
    },
    buttonContainer: {
        alignItems: "center"
    },
    preferenceContainer: {
        backgroundColor: colors.background,
        height: 'auto',
        width: 'auto',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        elevation: 3, // for Android
        shadowColor: colors.secondaryText,
        shadowOffset: { width: 0, height: 7 },
    },
    preference: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial'
    },
<<<<<<< HEAD
    dateStyle: {
        fontFamily: 'Arista-Pro-Alternate-Bold-trial'
    }
=======
    dateStyle:{
        fontFamily:'Arista-Pro-Alternate-Bold-trial'
    },
    inputLabel: {
        fontSize: 16,
        alignSelf: 'center',
        justifyContent: 'center',
        color:colors.secondaryText,
        fontFamily:'Arista-Pro-Alternate-Bold-trial'
    },
>>>>>>> 6635e0a (to push)
}
)



export default function AddEventView({ }) {

    const { setPage, authToken, username } = useContext(AppContext)
    const [selectedPreferences, setSelectedPreferences] = useState({})
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [preferences, setPreferences] = useState([]);
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [hasFailure, setHasFailure] = useState(false);
    const [isPosting, setIsPosting] = useState(false)
    const [postError, setPostError] = useState(false);
    const [state, setState] = useState({ date: new Date(), open: false })
    const [duration, setDuration] = useState(() => {
        const initialTime = new Date();
        initialTime.setHours(0, 0, 0, 0); // Sets time to 00:00:00.000
        return { time: initialTime, open: false };
    });

    const postEvent = () => {
        setIsPosting(true)
        axios({
            baseURL: baseUrl,
            url: '/event',
            method: 'POST',
            headers: { Authorization: 'Bearer ' + authToken },
            data: {
                login: username,
                ename: name,
                eloc: location,
                edate: state.date.toISOString().substr(0, 10),
                etime: state.date.toLocaleTimeString(),
                eduree: duration.time.toLocaleTimeString(),
                preferences_elist: selectedPreferences, // Ajustez le nom de cette propriété selon votre API
            }
        }).then(response => {
            setIsPosting(false);
            if (response.status === 200 || response.status === 201) {
                // Message posté avec succès
                console.log('Event posted successfully');
                // Vous pouvez ici actualiser la liste des messages ou gérer la réponse comme souhaité
            } else {
                // Gérer d'autres codes de statut selon votre API
                setPostError(true);
            }
        }).catch(err => {
            console.error(`Something went wrong while posting the event: ${err.message}`);
            setIsPosting(false);
            setPostError(true);
        });
    }; // Ajoutez d'autres dépendances si nécessaire

    const getPreferences = () => {
        setIsLoading(true);
        axios({
            baseURL: baseUrl,
            url: '/all-possible-preferences-with-id',
            method: 'GET',
            headers: { Authorization: 'Bearer ' + authToken },
        }).then(response => {
            setIsLoading(false)
            if (response.status >= 200 && response.status < 300) {
                const parsedData = response.data.map(preferences => ({
                    id: preferences[0], name: preferences[1]
                }));
                setHasFailure(false)
                setPreferences(parsedData)

            } else {
                setHasFailure(true)
            }
        }).catch(err => {
            console.error(`something went wrong ${err.message}`)
            setIsLoading(false)
            setHasFailure(true)
        })
    };

    useEffect(() => {
        getPreferences();
    }, [authToken]);

    const toggleItemSelection = (id) => {

        setSelectedPreferences((prevSelectedItems) => ({
            ...prevSelectedItems,
            [id]: !prevSelectedItems[id],
        })); // Basculer la sélection

    };

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={[styles.preferenceContainer, { backgroundColor: (selectedPreferences[item.id]) ? colors.primaryText : colors.background }]}
                onPress={() => { toggleItemSelection(item.id) }}>
                <Text style={styles.preference}> {item.name} </Text>
            </TouchableOpacity>
        )
    }

    const getSelectedPreferenceFormatted = () => {
        // Use Object.entries to iterate over key-value pairs and filter based on value
        const selectedPreferenceIDs = Object.entries(selectedPreferences)
            .filter(([key, value]) => value) // Filter pairs where the value is true
            .map(([key, value]) => key)
            ; // Map to the key (ID) of the preference
        return selectedPreferenceIDs;
    };


    return (
        <ScrollView style={styles.mainContainer}>
            <ReturnButton onPress={() => { setPage('listevent') }} />
            <CrousteamCard>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}> NEW EVENT </Text>
                </View>
<<<<<<< HEAD
                <CrousteamTextInput onChangeText={(text) => { setName(text) }} label="Name" placeholder="Enter a name" />
                <CrousteamTextInput onChangeText={(text) => { setDescription(text) }} label="Description" placeholder="Enter a Description" />
                <CrousteamTextInput onChangeText={(text) => { setLocation(text) }} label="Location" placeholder="Enter a Location" />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
=======
                <CrousteamTextInput onChangeText={(text)=> {setName(text)}}label = "Name" placeholder ="Enter a name"/>
                <CrousteamTextInput onChangeText={(text)=> {setLocation(text)}} label = "Location" placeholder ="Enter a Location"/>
                <View style={{ flexDirection:'row', justifyContent: 'center', alignItems:'center'}}>
>>>>>>> 6635e0a (to push)
                    <Text >
                        {state.date.toDateString()}
                    </Text>
                    <CrousteamButton
                        title="Select date"
                        styleText={styles.inputLabel}
                        onPress={() => setState({ date: state.date, open: true })}
                    />
                    <DatePicker
                        modal
                        open={state.open}
                        date={state.date}
                        onConfirm={(date) => setState({ date, open: false })}
                        onCancel={() => setState({ date: state.date, open: false })}
                        androidVariant="nativeAndroid"
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text >
                        {duration.time.toLocaleTimeString()}
                    </Text>
                    <CrousteamButton
                        title="Select duration"
                        styleText={styles.inputLabel}
                        onPress={() => setDuration({ time: duration.time, open: true })}
                    />
                    <DatePicker
                        modal
                        mode={'time'}
                        open={duration.open}
                        date={duration.time}
                        onConfirm={(duration) => { console.log(duration), setDuration({ time: duration, open: false }) }}
                        onCancel={() => setDuration({ time: duration.time, open: false })}
                        androidVariant="nativeAndroid"
                    />
                </View>

<<<<<<< HEAD
=======
                <CrousteamTextInput onChangeText={(text)=> {setDescription(text)}} label = "Description" placeholder ="Enter a Description"/>
                
>>>>>>> 6635e0a (to push)
                <View>
                    <FlatList
                        data={preferences}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        numColumns={3}
                        nestedScrollEnabled={true} />
                </View>
                <View style={styles.buttonContainer}>
                    <CrousteamButton title="ADD EVENT" onPress={() => { postEvent(), setPage("listevent") }} />
                </View>
            </CrousteamCard>

        </ScrollView>
    );
}