import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

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
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <Text style={styles.textStyle}>Sélectionner votre photo</Text>
        </TouchableOpacity>
        {filePath && (
          <View style={styles.imageContainer}>
            <Image source={{uri: filePath.uri}} style={styles.imageStyle} />
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => removeImage(index)}></TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default KivImagePicker;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    display: 'flex',
    alignItems: 'center',
    gap: 30,
  },
  textStyle: {
    padding: 10,
    fontSize: 20,
    color: 'blue',
    textAlign: 'center',
  },
  buttonStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
});
