import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import InputField from './Common/InputField';
import {faCamera, faImages} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useState} from 'react';
import {useMoralis, useWeb3ExecuteFunction} from 'react-moralis';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import mintingNFTContractABI from '../../../smartContract/ABIs/minter.json';
import {colors} from '../shared/styles';
import {H2} from '../shared/Typography';
const includeExtra = true;

const windowWidth = Dimensions.get('window').width;
const mintingNFTContractAddress = '0x74Fd20EA4C0D0250dCA622df7638aFde0Cb96463';

const Camera = () => {
  const {Moralis, account} = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const [nftName, setNftName] = useState('Something');
  const [nftDescription, setNftDescription] = useState('something');
  const [modalVisible, setModalVisible] = useState(false);
  async function uploadFile() {
    var file = response;
    console.log(typeof file);
    setModalVisible(false);
    // var jezzon = JSON.parse(file);
    console.log('Uppppppploading to Hadron Collider server!!!');
    const imageFile = new Moralis.File('Diablo.jpg', {
      base64: file.assets[0].base64,
    });

    await imageFile.saveIPFS();
    const imageHash = await imageFile.ipfs();
    console.log(imageHash);
    setImages([...images, imageHash]);
    console.log('$$$', images);

    const metadata = {
      name: nftName,
      description: nftDescription,
      image: imageHash,
    };
    const metadataFile = new Moralis.File('metadata.json', {
      base64: btoa(JSON.stringify(metadata)),
    });

    await metadataFile.saveIPFS();
    const metadataHash = await metadataFile.ipfs();
    callingSmartContract(metadataHash);
  }

  async function callingSmartContract(metadataHash) {
    const options = {
      contractAddress: mintingNFTContractAddress,
      abi: mintingNFTContractABI,
      functionName: 'createToken',
      params: {
        tokenURI: metadataHash,
      },
    };
    await contractProcessor.fetch({
      params: options,
      onSuccess: () => console.log('NFT created successfully'),
      onError: error => console.log(error),
    });
  }

  const [response, setResponse] = useState(null);
  const [images, setImages] = useState([]);
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
    // async function imgPicked() {
    //   let promise = new Promise(() => {
    //     if (type === 'capture') launchCamera(options, setResponse);
    //     else launchImageLibrary(options, setResponse);
    //   });
    //   let result = await promise;
    //   setModalVisible(true);
    // }
    if (type === 'capture') {
      launchCamera(options, setResponse).then(response => {
        setModalVisible(true);
        // uploadFile();
      });
    } else {
      launchImageLibrary(options, setResponse).then(response => {
        setModalVisible(true);
        // uploadFile(response);
      });
    }
  }, []);
  return (
    <>
      {modalVisible ? (
        <PopUpModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          nftName={nftName}
          setNftName={setNftName}
          nftDescription={nftDescription}
          setNftDescription={setNftDescription}
          uploadFile={uploadFile}
        />
      ) : (
        <View style={styles.viewContainer}>
          <View style={styles.colContainer}>
            <H2>INSTANT NFT MINTER</H2>
            <View style={{height: 5}}></View>
            <View style={styles.moonContainer}>
              <TouchableOpacity
                onPress={() =>
                  onButtonPress('capture', {
                    saveToPhotos: true,
                    mediaType: 'photo',
                    includeBase64: true,
                    includeExtra,
                  })
                }
                style={styles.button}>
                <FontAwesomeIcon
                  icon={faCamera}
                  size={30}
                  color={colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  onButtonPress('selector', {
                    saveToPhotos: true,
                    mediaType: 'photo',
                    includeBase64: true,
                    includeExtra,
                  })
                }
                style={styles.button}>
                <FontAwesomeIcon
                  icon={faImages}
                  size={30}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
          onPress={() => uploadFile(response)}
          style={styles.buttonStyle}>
          <H3>Mint Image as NFT</H3>
        </TouchableOpacity> */}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <FlatList
              key="_"
              numColumns={3}
              style={{flexWrap: 'wrap', flexDirection: 'row'}}
              contentContainerStyle={{
                alignItems: 'flex-start',
                justifyContent: 'space-evenly',
              }}
              extraData={images}
              data={images}
              keyExtractor={item => item}
              renderItem={({item}) => <ImageGallery imageUrl={item} />}
            />
          </View>
        </View>
      )}
    </>
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
          width: windowWidth * 0.33,
          height: 120,
        }}
      />
    </TouchableOpacity>
  );
};

const PopUpModal = ({
  modalVisible,
  setModalVisible,
  nftName,
  setNftName,
  nftDescription,
  setNftDescription,
  uploadFile
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter NFT MetaData</Text>
            <InputField
              value={nftName}
              setvalue={setNftName}
              LabelName="Name"
              placeholder="Name your NFT"
              containerStyle={{marginTop: 15, width: '100%'}}
            />
            <InputField
              value={nftDescription}
              setvalue={setNftDescription}
              LabelName="Description"
              placeholder="One line description"
              containerStyle={{marginTop: 15, width: '100%'}}
            />
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                position: 'absolute',
                bottom: 20,
              }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonSubmit]}
                onPress={uploadFile}>
                <Text style={styles.textStyle}>Mint NFT</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  colContainer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    backgroundColor: colors.primaryLight,
    padding: 20,
  },
  moonContainer: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '30%',
    width: '100%',
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 25,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    color: '#fff',
    borderColor: colors.black,
    width: '80%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderRadius: 20,
    paddingHorizontal: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSubmit: {
    backgroundColor: '#F194FF',
    width: '55%',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    width: '40%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Camera;
