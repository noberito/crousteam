
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const EventList = [
    { id: '1', title: 'Fête de Quartier', description: 'Venez nombreux pour une soirée de détente!', image: require('./images/event1.jpg') },
    { id: '2', title: 'Cours de Yoga en Plein Air', description: 'Rejoignez-nous pour une séance de yoga relaxante.', image: require('./images/event2.jpg') },
    // ... Autres événements
];

const EventView = ({ navigation }) => {
    const handleEventPress = (eventId) => {
        // Navigation vers la page détaillée de l'événement avec l'ID de l'événement
        navigation.navigate('EventDetails', { eventId });
    };

    const renderEventItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleEventPress(item.id)}>
            <View style={styles.eventItem}>
                <Image source={item.image} style={styles.eventImage} />
                <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventDescription}>{item.description}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={EventList}
                keyExtractor={(item) => item.id}
                renderItem={renderEventItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    eventItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2, // Pour l'ombre sur Android
    },
    eventImage: {
        width: 100,
        height: 100,
    },
    eventInfo: {
        flex: 1,
        padding: 12,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    eventDescription: {
        color: '#555555',
    },
});

export default EventView;
