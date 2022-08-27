import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors} from '../shared/styles';
import {H2, H3} from '../shared/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera, faImages} from '@fortawesome/free-solid-svg-icons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const includeExtra = true;
const Camera = () => {
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [whichCamera, setWhichCamera] = useState('back');
  const onPressZero = () => {
    setActiveTab(0);
    setWhichCamera('back');
  };
  const onPressOne = () => {
    setActiveTab(1);
    setWhichCamera('front');
  };
  //   const actions = [
  //     {
  //       title: 'Take Image',
  //       type: 'capture',
  //       options: {
  //         saveToPhotos: true,
  //         mediaType: 'photo',
  //         includeBase64: false,
  //         includeExtra,
  //       },
  //     },
  //     {
  //       title: 'Select Image',
  //       type: 'library',
  //       options: {
  //         selectionLimit: 0,
  //         mediaType: 'photo',
  //         includeBase64: false,
  //         includeExtra,
  //       },
  //     },
  //     {
  //       title: 'Take Video',
  //       type: 'capture',
  //       options: {
  //         saveToPhotos: true,
  //         mediaType: 'video',
  //         includeExtra,
  //       },
  //     },
  //     {
  //       title: 'Select Video',
  //       type: 'library',
  //       options: {
  //         selectionLimit: 0,
  //         mediaType: 'video',
  //         includeExtra,
  //       },
  //     },
  //     {
  //       title: `Select Image or Video\n(mixed)`,
  //       type: 'library',
  //       options: {
  //         selectionLimit: 0,
  //         mediaType: 'mixed',
  //         includeExtra,
  //       },
  //     },
  //   ];
  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      launchCamera(options, setResponse);
    } else {
      launchImageLibrary(options, setResponse);
    }
  }, []);
  return (
    <View style={styles.viewContainer}>
      <H2>TO THE MOON</H2>
      {/* {actions.map(({title, type, options}) => {
        return ( */}
      <View style={styles.moonContainer}>
        <TouchableOpacity
          onPress={() =>
            onButtonPress('capture', {
              saveToPhotos: true,
              mediaType: 'photo',
              cameraType: whichCamera,
              includeBase64: false,
              includeExtra,
            })
          }
          style={{
            width: 50,
            height: 50,
            backgroundColor: colors.primary,
            borderRadius: 25,
            borderWidth: 1,
            borderBottomWidth: 3,
            borderRightWidth: 3,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <FontAwesomeIcon icon={faCamera} size={30} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            onButtonPress('selector', {
              saveToPhotos: true,
              mediaType: 'photo',
              includeBase64: false,
              includeExtra,
            })
          }
          style={{
            width: 50,
            height: 50,
            backgroundColor: colors.primary,
            borderRadius: 25,
            borderWidth: 1,
            borderBottomWidth: 3,
            borderRightWidth: 3,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <FontAwesomeIcon icon={faImages} size={30} color={colors.white} />
        </TouchableOpacity>
        {/* ); */}
        {/* })} */}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={onPressZero}
          style={[styles.tab, activeTab === 0 ? styles.activetab : null]}>
          <H3>Front Camera</H3>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressOne}
          style={[styles.tab, activeTab === 1 ? styles.activetab : null]}>
          <H3>Back Camera</H3>
        </TouchableOpacity>
      </View>
      <View style={{width: '100%', marginTop: 20}}>
        <FlatList
          key="_"
          numColumns={3}
          style={{flexWrap: 'wrap', flexDirection: 'column'}}
          contentContainerStyle={{
            alignItems: 'flex-start',
          }}
        //   extraData={images}
        //   data={images}
          keyExtractor={item => item}
          renderItem={({item}) => <ImageGallery imageUrl={item} />}
        />
      </View>
    </View>
  );
};

const ImageGallery = ({imageUrl}) => {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(imageUrl)}>
      <Image
        resizeMode="contain"
        source={{uri: imageUrl}}
        style={{
          borderColor: 'black',
          borderWidth: 1,
          width: windowWidth * 0.3,
          height: 120,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: colors.primaryLight,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moonContainer: {
    padding: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '30%',
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderColor: colors.black,
    borderWidth: 1,
    width: '100%',
  },
  tab: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  activetab: {
    backgroundColor: colors.primary,
    borderColor: colors.black,
    borderBottomWidth: 2.5,
    borderRightWidth: 3,
    borderWidth: 0.5,
  },
});

export default Camera;