import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import Aquafier from 'aqua-js-sdk/react-native'; // ✨ New simplified import!

/**
 * This component demonstrates the new simplified Aqua SDK setup for React Native.
 * No more manual polyfills or complex configuration needed!
 */
export default function SimplifiedAquaExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testAquaSDK = async () => {
    setIsLoading(true);
    setResult('');

    try {
      // Initialize the SDK - all polyfills are handled automatically!
      const aquafier = new Aquafier();
      
      // Test basic functionality
      const testFileObject = {
        fileContent: "Hello, Aqua Protocol!",
        fileName: "test.txt",
        path: "/test/test.txt",
        fileSize: 22
      };

      // Create a genesis revision
      const result = await aquafier.createGenesisRevision(testFileObject);
      
      if (result.isErr()) {
        Alert.alert('Error', `Failed to create genesis revision: ${JSON.stringify(result.data)}`);
        setResult('❌ Test failed');
      } else {
        Alert.alert('Success', 'Aqua SDK is working perfectly!');
        setResult('✅ Test passed - SDK initialized and working!');
      }
    } catch (error) {
      console.error('Test error:', error);
      Alert.alert('Error', `Test failed: ${error instanceof Error ? error.message : String(error)}`);
      setResult('❌ Test failed with error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simplified Aqua SDK Test</Text>
      <Text style={styles.subtitle}>
        Using the new aqua-js-sdk/react-native import with automatic polyfills!
      </Text>
      
      <Button
        title={isLoading ? "Testing..." : "Test Aqua SDK"}
        onPress={testAquaSDK}
        disabled={isLoading}
      />
      
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>What's Different:</Text>
        <Text style={styles.infoText}>• No manual polyfill imports needed</Text>
        <Text style={styles.infoText}>• No complex Metro configuration</Text>
        <Text style={styles.infoText}>• Automatic crypto and buffer setup</Text>
        <Text style={styles.infoText}>• Just import and use!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#1976d2',
  },
});
