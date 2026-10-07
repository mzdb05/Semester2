import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function SavedServicesScreen() {
  const { savedServices, removeSavedService, colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={savedServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={{ color: colors.muted }}>{item.description}</Text>
            <Pressable style={[styles.button, { backgroundColor: colors.danger }]} onPress={() => removeSavedService(item.id)}>
              <Text style={styles.buttonText}>Remove</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.muted }]}>
            No saved services yet. Save one from the Services tab.
          </Text>
        }
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
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
});