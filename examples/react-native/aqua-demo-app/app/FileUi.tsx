
import Aquafier, { AquaTree, AquaTreeWrapper, CredentialsData, FileObject, reorderAquaTreeRevisionsProperties } from "aqua-js-sdk/react-native";
import * as DocumentPicker from 'expo-document-picker';
import React, { useState, useEffect } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View, Clipboard, ToastAndroid, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';



export default function FileUi() {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [aquaTree, setAquaTree] = useState<AquaTree | null>(null);

  const [showSignedText, setShowSignedText] = useState(false);
  const [fileObject, setFileObject] = useState<FileObject | null>(null);
  const [isProcessingSignature, setIsProcessingSignature] = useState(false);
  const [showToast, setShowToast] = useState(false);

  let creds: CredentialsData = {
    mnemonic: "mail ignore situate guard glove physical gaze scale they trouble chunk sock", // Replace with your mnemonic
    nostr_sk: "", // Replace with your nostr secret key
    did_key: "", // Replace with your did key
    alchemy_key: "", // Replace with your alchemy private key
    witness_eth_network: "sepolia", // Replace with your Ethereum network
    witness_method: "eth", // Replace with your witness method
  };

  // Helper function to determine if file should be read as text
  const isTextFile = (extension: string | undefined): boolean => {
    const textExtensions = [
      'txt', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx',
      'md', 'csv', 'log', 'yml', 'yaml', 'ini', 'conf', 'cfg'
    ];
    return extension ? textExtensions.includes(extension) : false;
  };

  const openFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: '*/*',
      });

      if (!result.canceled) {
        const file: DocumentPicker.DocumentPickerAsset = result.assets && result.assets[0];
        if (file) {
          setSelectedFile(file);

          let fileContent: string | Uint8Array = "";

          try {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();

            if (isTextFile(fileExtension)) {
              fileContent = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.UTF8,
              });
            } else {
              const base64Content = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              fileContent = base64Content;
            }
          } catch (readError) {
            console.error('Error reading file content:', readError);
            Alert.alert('Error', 'Failed to read file content');
            return;
          }

          let fileObject: FileObject = {
            fileContent: fileContent,
            fileName: file.name,
            path: file.uri,
            fileSize: file.size
          };

          let aquafier = new Aquafier();
          let res = await aquafier.createGenesisRevision(fileObject)
          if (res.isErr()) {
            const err = JSON.stringify(res.data, null, 4)
            console.log(err)
            Alert.alert('Error Generating Aqua json', `Error: ${err}`);
          } else {
            let orderedAquaTree = reorderAquaTreeRevisionsProperties(res.data.aquaTree!!)
            setAquaTree(orderedAquaTree);
            setFileObject(fileObject);
          }
        }
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };



  const signAquaTree = async () => {
    if (!aquaTree) {
      Alert.alert('Error', 'No Aqua Tree to sign');
      return;
    }
    if (isProcessingSignature) {
      Alert.alert('Error', 'Already processing signature');
      return;
    }
    console.log('Signing Aqua Tree with cli SDK...');
    setIsProcessingSignature(true);



    try {

      // Sign the Aqua Tree with the signature and address

      console.log('Signing Aqua Tree with signature...');
      let aquafier = new Aquafier();


      let aquaTreeWrapper: AquaTreeWrapper = {
        aquaTree: aquaTree,
        revision: "",
        fileObject: fileObject!
      };

      const res = await aquafier.signAquaTree(aquaTreeWrapper, "cli", creds, true);

      if (res.isErr()) {
        const err = JSON.stringify(res.data, null, 4);
        console.log('Signing error:', err);
        Alert.alert('Error Signing Aqua JSON', err);
      } else {
        Alert.alert('Success', 'Aqua JSON signed successfully');
        setAquaTree(res.data.aquaTree);
        setShowSignedText(true);
      }

    } catch (error) {
      console.error('Error signing Aqua Tree:', error);
      Alert.alert('Error', `Failed to sign Aqua Tree: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessingSignature(false);
    }
  };



  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Aqua Demo App</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Select a File & Create Aqua tree</Text>
        <Button title="Pick a file" onPress={openFilePicker} />
        {selectedFile && (
          <Text style={styles.fileInfo}>
            Selected: {selectedFile.name} ({selectedFile.size} bytes)
          </Text>
        )}
        {aquaTree && (
          <Text style={styles.success}>Aqua Tree created successfully!</Text>
        )}
      </View>



      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Sign with Wallet address</Text>

        <Button
          title={isProcessingSignature ? "Processing..." : "Sign with Wallet address"}
          onPress={() => {


            signAquaTree()
          }}
          disabled={!aquaTree || isProcessingSignature}
        />
        {showSignedText && (
          <Text style={styles.success}>Aqua Tree signed successfully!</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. verify Aqua Tree</Text>
        <Button title="verify Aqua Tree" onPress={async () => {
          let aqua = new Aquafier();
          let res = await aqua.verifyAquaTree(aquaTree!, [fileObject!], creds);
          if (res.isErr()) {
            Alert.alert('Error Verifying Aqua JSON', JSON.stringify(res.data, null, 4));
          } else {
            Alert.alert('Success', 'Aqua JSON verified successfully');
          }

        }} disabled={!selectedFile} />

      </View>

      {aquaTree && (
        <View style={styles.section}>

          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Aqua Tree Data</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => {
                const jsonString = JSON.stringify(aquaTree, null, 2);
                Clipboard.setString(jsonString);
                if (Platform.OS === 'android') {
                  ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
                } else {
                  // For iOS, we'll use a state-based approach
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }
              }}
            >
              <Text style={styles.copyButtonText}>📋 Copy</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.jsonContainer}>
            <Text style={styles.jsonText}>
              {JSON.stringify(aquaTree, null, 2)}
            </Text>
          </TouchableOpacity>
          {showToast && Platform.OS !== 'android' && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>Copied to clipboard</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toast: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fileInfo: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  fileInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    marginBottom: 5,
  },
  fileDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  scrollContainer: {
    maxHeight: 300,
    marginTop: 10,
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    marginTop: 10,
  },
  jsonContainer: {
    backgroundColor: '#f0f0f0',
    maxHeight: 650,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});


