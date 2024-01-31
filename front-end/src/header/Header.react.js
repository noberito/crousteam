import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../common/Colors.react';

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.background,
        padding: 8
    },
    textstyle: {
        fontFamily : 'Arista-Pro-Alternate-Bold-trial',
        color: colors.primaryText,
    }
});

export default function Header({ username }) {
    const text = username == null ? <Text>Logged out</Text>
        : <Text style={styles.textstyle}>Logged in as {username}</Text>;
    return (<View style={styles.header}>{text}</View>);
}
