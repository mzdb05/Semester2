import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

// Example initial services matching your project structure
const INITIAL_SERVICES = [
  { id: '1', name: 'Library Support', category: 'Academic', description: 'Research help, study spaces' },
  { id: '2', name: 'ICT Helpdesk', category: 'Technical', description: 'Wi-Fi, student portal and password resets' },
  { id: '3', name: 'Academic Consultation', category: 'Academic', description: 'Book time with lecturers' },
  { id: '4', name: 'Career Services', category: 'Support', description: 'CV reviews, interviews and job search' },
];

export default function HomeScreen() {
  const { savedServices, themeName, toggleTheme, colors, storageError } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [services] = useState(INITIAL_SERVICES);

  // Filtering logic handled outside individual components
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>UJ Campus Services</Text>

      {/* Saved Services Count Card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.count, { color: colors.text }]}>
          Saved Services: {savedServices.length}
        </Text>
      </View>

      {/* Controlled Search Input */}
      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.primary }]}
        placeholder="Search services..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category Filter Controls */}
      <View style={styles.filterContainer}>
        {['All', 'Academic', 'Technical', 'Support'].map(category => (
          <Pressable
            key={category}
            style={[
              styles.filterButton, 
              { backgroundColor: selectedCategory === category ? colors.primary : colors.card }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.filterText, { color: selectedCategory === category ? '#fff' : colors.text }]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* FlatList for Services */}
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.serviceItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.serviceTitle, { color: colors.primary }]}>{item.name}</Text>
            <Text style={[styles.serviceDesc, { color: colors.text }]}>{item.description}</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.text, fontStyle: 'italic' }}>No services found matching your search.</Text>
          </View>
        }
        style={styles.list}
      />

      {/* Theme Toggle Button */}
      <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={toggleTheme}>
        <Text style={styles.buttonText}>
          Switch to {themeName === 'light' ? 'Dark' : 'Light'} mode
        </Text>
      </Pressable>

      {storageError ? <Text style={{ color: colors.danger, marginTop: 12 }}>{storageError}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  count: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  searchInput: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 12, fontSize: 16 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterButton: { flex: 1, padding: 8, marginHorizontal: 3, borderRadius: 6, alignItems: 'center' },
  filterText: { fontWeight: '600', fontSize: 12 },
  list: { flex: 1, marginBottom: 12 },
  serviceItem: { padding: 14, borderRadius: 8, marginBottom: 8, elevation: 1 },
  serviceTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  serviceDesc: { fontSize: 13 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  button: { padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});