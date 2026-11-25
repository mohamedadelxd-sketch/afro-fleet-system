
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

export default function App() {
  const [tracking, setTracking] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>AFRO EGYPT</Text>
      <Text style={styles.subtitle}>DRIVER APP</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Driver Name</Text>
        <Text style={styles.value}>Driver Name</Text>

        <Text style={styles.label}>Assigned Vehicle</Text>
        <Text style={styles.value}>Vehicle Number</Text>

        <Text style={styles.label}>Tracking Status</Text>
        <Text style={styles.status}>
          {tracking ? 'Tracking Active' : 'Not Tracking'}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: tracking ? '#dc3545' : '#198754' }
          ]}
          onPress={() => setTracking(!tracking)}
        >
          <Text style={styles.buttonText}>
            {tracking ? 'STOP TRACKING' : 'START TRACKING'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Afro Egypt Fleet Management
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    justifyContent: 'center',
    padding: 25
  },
  logo: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitle: {
    color: '#38bdf8',
    textAlign: 'center',
    marginBottom: 35
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25
  },
  label: {
    color: '#64748b',
    marginTop: 15,
    fontSize: 14
  },
  value: {
    color: '#101827',
    fontSize: 19,
    fontWeight: 'bold'
  },
  status: {
    color: '#198754',
    fontWeight: 'bold',
    marginTop: 5
  },
  button: {
    padding: 18,
    borderRadius: 10,
    marginTop: 30
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  footer: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 30
  }
});
