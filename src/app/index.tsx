import { db } from '../../firebaseConfig'; 
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

// Import your configured Firestore database instance

// --- 1. REUSABLE COMPONENTS ---

// TaskForm Component (Handles 1.2: Controlled inputs & validation)
const TaskForm = ({ onAddTask, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [priority, setPriority] = useState('Medium'); // Default selection
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !moduleCode.trim()) {
      setErrorMessage('Both Task Title and Module Code are required.');
      return;
    }
    setErrorMessage('');
    
    // Pass data back up to parent handler
    onAddTask(
      { title: title.trim(), moduleCode: moduleCode.trim(), priority },
      () => {
        // Clear input fields ONLY after write succeeds (1.2 requirement)
        setTitle('');
        setModuleCode('');
        setPriority('Medium');
      }
    );
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formHeader}>Add Academic Task</Text>
      
      {errorMessage ? <Text style={styles.validationError}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Task Title (e.g., Assignment 1)"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Module Code (e.g., DEV2A01)"
        value={moduleCode}
        onChangeText={setModuleCode}
      />

      <Text style={styles.label}>Priority:</Text>
      <View style={styles.prioritySelector}>
        {['Low', 'Medium', 'High'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.priorityBadge,
              priority === level && styles.priorityBadgeSelected,
            ]}
            onPress={() => setPriority(level)}
          >
            <Text
              style={[
                styles.priorityText,
                priority === level && styles.priorityTextSelected,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.addButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.addButtonText}>
          {isSubmitting ? 'Saving...' : 'Add Task'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// TaskCard Component (Handles 1.3: Update completion & 1.4: Delete)
const TaskCard = ({ item, onToggleComplete, onDelete }) => {
  const isCompleted = item.completed;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#d9534f';
      case 'Medium': return '#f0ad4e';
      case 'Low': return '#5cb85c';
      default: return '#6c757d';
    }
  };

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, isCompleted && styles.textCompleted]}>
          {item.title}
        </Text>
        <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityTagText}>{item.priority}</Text>
        </View>
      </View>

      <Text style={styles.moduleCode}>Module: {item.moduleCode}</Text>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, isCompleted ? styles.reopenButton : styles.completeButton]}
          onPress={() => onToggleComplete(item.id, isCompleted)}
        >
          <Text style={styles.actionButtonText}>
            {isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- 2. MAIN APPLICATION COMPONENT ---

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1.1 Real-time Firestore Listener
  useEffect(() => {
    const tasksRef = collection(db, 'tasks');

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      tasksRef,
      (snapshot) => {
        const taskList = [];
        snapshot.forEach((doc) => {
          // Convert document to JS object including document ID
          taskList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setTasks(taskList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore subscription error:', err);
        setError('Failed to connect to real-time task database.');
        setLoading(false);
      }
    );

    // Clean up/unsubscribe on component unmount
    return () => unsubscribe();
  }, []);

  // 1.2 Write new task to Firestore
  const handleAddTask = async (newTaskData, onSuccess) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTaskData.title,
        moduleCode: newTaskData.moduleCode,
        priority: newTaskData.priority,
        completed: false, // Default completion status
        createdAt: serverTimestamp(), // Server timestamp
      });
      setIsSubmitting(false);
      onSuccess(); // Executes form reset only after write succeeds
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to create task. Please try again.');
      setIsSubmitting(false);
    }
  };

  // 1.3 Update task completion state
  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, {
        completed: !currentStatus,
      });
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task completion state.');
    }
  };

  // 1.4 Delete task document
  const handleDeleteTask = async (taskId) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskDocRef);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task.');
    }
  };

  // 1.5 Reliability and Interface States
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={styles.stateText}>Loading tasks from Firestore...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (tasks.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No academic tasks found. Add one above!</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id} // Stable unique key using Firestore document ID
        renderItem={({ item }) => (
          <TaskCard
            item={item}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.appTitle}>UJ Student Task Hub</Text>
      
      <TaskForm onAddTask={handleAddTask} isSubmitting={isSubmitting} />

      <Text style={styles.sectionTitle}>Your Tasks</Text>
      {renderContent()}
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginVertical: 10,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  formHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priorityBadge: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  priorityBadgeSelected: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  priorityText: {
    color: '#333',
    fontWeight: '500',
  },
  priorityTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#88a0b8',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  validationError: {
    color: '#d9534f',
    marginBottom: 8,
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  cardCompleted: {
    backgroundColor: '#e9ecef',
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  moduleCode: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    marginBottom: 10,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#28a745',
  },
  reopenButton: {
    backgroundColor: '#6c757d',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    marginTop: 10,
    color: '#555',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    fontSize: 14,
  },
  emptyText: {
    color: '#777',
    textAlign: 'center',
    fontSize: 14,
  },
});