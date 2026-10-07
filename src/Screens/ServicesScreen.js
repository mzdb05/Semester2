import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { SERVICES } from '../data/services';

export default function ServicesScreen() {
  const { savedServices, addSavedService, removeSavedService, colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={SERVICES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSaved = savedServices.some((s) => s.id === item.id);
          return (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={{ color: colors.muted }}>{item.description}</Text>
              <Pressable
                style={[styles.button, { backgroundColor: isSaved ? colors.danger : colors.primary }]}
                onPress={() => (isSaved ? removeSavedService(item.id) : addSavedService(item))}
              >
                <Text style={styles.buttonText}>{isSaved ? 'Remove' : 'Save'}</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1 },
  name: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  button: { marginTop: 10, padding: 10, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});