import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
// Import from the React Native entry point
import Aquafier, { FileObject } from 'aqua-js-sdk/react-native';
import * as FileSystem from 'react-native-fs';

type SelectedFile = {
  name: string;
  uri: string;
  type: string | null;
  size: number | null;
};

const AquaFileExample = () => {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [aquaData, setAquaData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const openFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: '*/*',
      });

      if (!result.canceled) {
        const file = result.assets && result.assets[0];
        if (file) {
          setSelectedFile({
            name: file.name,
            uri: file.uri,
            type: file.mimeType ?? null,
            size: file.size ?? null,
          });
          
          // Process the file with Aquafier
          await processFile(file);
        }
      } else {
        console.log('User canceled file selection');
      }
    } catch (error) {
      console.error('Error picking file:', error);
      setError(`Error picking file: ${error.message}`);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const processFile = async (file: { name: string, uri: string, size?: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      // Read the file content
      let fileContent = '';
      
      try {
        // Try to read the file using react-native-fs
        if (file.uri.startsWith('file://')) {
          fileContent = await FileSystem.readFile(file.uri.replace('file://', ''), 'utf8');
        } else {
          fileContent = await FileSystem.readFile(file.uri, 'utf8');
        }
      } catch (fsError) {
        console.warn('Error reading file with FileSystem:', fsError);
        // If reading fails, use an empty string (binary files will be handled differently)
        fileContent = `Binary file content (${file.size} bytes)`;
      }

      // Create the file object for Aquafier
      const fileObject: FileObject = {
        fileName: file.name,
        fileContent: fileContent,
        path: file.uri,
        fileSize: file.size
      };

      // Initialize Aquafier
      const aquafier = new Aquafier();
      
      // Create genesis revision
      const result = await aquafier.createGenesisRevision(fileObject);
      
      if (result.isErr()) {
        setError(`Error generating Aqua JSON: ${JSON.stringify(result.data, null, 2)}`);
        Alert.alert('Error Generating Aqua JSON', `Error: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        const data = JSON.stringify(result.data.aquaTree, null, 2);
        setAquaData(data);
      }
    } catch (error) {
      console.error('Error processing file with Aquafier:', error);
      setError(`Error processing file: ${error.message}`);
      Alert.alert('Error', `Failed to process file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Aqua JS SDK React Native Example</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={openFilePicker}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Select File'}
          </Text>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error:</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {selectedFile && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileInfoTitle}>Selected File:</Text>
            <Text style={styles.fileName}>Name: {selectedFile.name}</Text>
            <Text style={styles.fileDetails}>Type: {selectedFile.type}</Text>
            <Text style={styles.fileDetails}>Size: {selectedFile.size} bytes</Text>
            <Text style={styles.fileDetails}>URI: {selectedFile.uri}</Text>
          </View>
        )}

        {aquaData && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileInfoTitle}>Aqua JSON:</Text>
            <ScrollView style={styles.jsonContainer}>
              <Text style={styles.jsonText}>{aquaData}</Text>
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },
  errorText: {
    color: '#b71c1c',
    fontSize: 14,
  },
  fileInfo: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fileInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  fileDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  jsonContainer: {
    maxHeight: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
});

export default AquaFileExample;
