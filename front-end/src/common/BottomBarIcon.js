import React from 'react'
import { Button, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

const iconStyles = StyleSheet.create({

});

const BottomBarIcon = ({image, title, onPress}) => {
    return(
        <View>
            <TouchableOpacity>
                <Image></Image>
            </TouchableOpacity>
        </View>
    )
};

export default BottomBarIcon;