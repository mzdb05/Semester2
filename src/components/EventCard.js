import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EventCard({ event, onToggleInterest }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.campus}>Campus: {event.campus}</Text>
      <TouchableOpacity 
        style={[styles.button, event.isInterested ? styles.interested : styles.notInterested]} 
        onPress={() => onToggleInterest(event.id)}
      >
        <Text style={styles.buttonText}>
          {event.isInterested ? 'Interested ★' : 'Mark as Interested ☆'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, marginVertical: 8, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold' },
  campus: { color: '#666', marginVertical: 4 },
  button: { padding: 10, borderRadius: 5, marginTop: 8, alignItems: 'center' },
  interested: { backgroundColor: '#d4edda' },
  notInterested: { backgroundColor: '#f8d7da' },
  buttonText: { fontWeight: 'bold' }
});