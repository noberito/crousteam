import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera} from '@fortawesome/free-solid-svg-icons';
import CrousteamTextInput from '../common/CrousteamTextInput.react';

const KivImagePicker = ({filePath, setFilePath}) => {
  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response.assets[0]);
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon={faCamera} size={30} color="#000"  />
          </View>
        </TouchableOpacity>

        {filePath && (
          <View style={styles.imageContainer}>
            <Image source={{uri: filePath.uri}} style={styles.imageStyle} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default KivImagePicker;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 10,
      },
      buttonStyle: {
        borderWidth: 0,
        borderRadius: 15,
        paddingHorizontal: 5,
        paddingVertical: 20,
        marginBottom: 10,
        minWidth: 10, // Example minimum width
        alignItems: 'center', // Center content horizontally
      },
      imageStyle: {
        width: 200,
        height: 200,
      },
      imageContainer: {
        alignItems: 'center',
      },
    
      inputContainer: {
        paddingBottom: 0,
        color: '#f6edce',
        width: '100%',
      },
      inputLabel: {
        fontSize: 16,
        alignSelf: 'center',
        color: 'red',
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
      },
      iconContainer: {
        borderWidth: 1, // Adjust this value according to your icon size and desired spacing
        borderColor: '#000',
        borderRadius: 15,
        alignItems: 'center', // Center the child horizontally
        justifyContent: 'center', // Center the child vertically
        paddingHorizontal:15,
        paddingVertical:15
      }
    });
