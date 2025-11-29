/**
 * Dev Test Screen
 * @format
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { testAllGetEndpoints } from '../api/client/clientApiTestHelper';

const DevTestScreen = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = useSelector(state => state.userData.userDetails.userId);

  const runTests = async () => {
    setLoading(true);
    const testResults = await testAllGetEndpoints(userId);
    setResults(testResults);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Client API Test Screen</Text>
      <Text style={styles.subtitle}>User ID: {userId}</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={runTests}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Run All GET Tests'}
        </Text>
      </TouchableOpacity>

      {results && (
        <View style={styles.results}>
          <Text style={styles.resultTitle}>Results:</Text>
          <Text style={styles.passed}>
            ✅ Passed: {results.passed.length}
          </Text>
          <Text style={styles.failed}>
            ❌ Failed: {results.failed.length}
          </Text>
          
          {results.failed.length > 0 && (
            <View style={styles.failedList}>
              <Text style={styles.failedTitle}>Failed Tests:</Text>
              {results.failed.map((item, index) => (
                <View key={index} style={styles.failedItemContainer}>
                  <Text style={styles.failedItem}>
                    • {item.name}
                  </Text>
                  <Text style={styles.failedError}>
                    {item.error}
                  </Text>
                  {item.status === 404 && (
                    <Text style={styles.failedNote}>
                      ⚠️ Backend endpoint not implemented
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  results: { marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  passed: { fontSize: 16, color: 'green', marginBottom: 5 },
  failed: { fontSize: 16, color: 'red', marginBottom: 10 },
  failedList: { marginTop: 10 },
  failedTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  failedItemContainer: { marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  failedItem: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 2 },
  failedError: { fontSize: 11, color: '#666', marginLeft: 10 },
  failedNote: { fontSize: 10, color: '#FF9800', marginLeft: 10, marginTop: 2, fontStyle: 'italic' },
});

export default DevTestScreen;








