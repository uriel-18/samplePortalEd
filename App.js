import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEsHoj42eDCiEU5KvN9RfJshOj-QfmGao",
  authDomain: "exampleportaled.firebaseapp.com",
  projectId: "exampleportaled",
  storageBucket: "exampleportaled.appspot.com",
  messagingSenderId: "13030385614",
  appId: "1:13030385614:web:4b8f9f94af249eee842d9f",
  measurementId: "G-FP6GRFEJ1P"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check if user is already signed in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Logged in successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        console.log('Logged out successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddData = () => {
    const userId = user.uid;
    firebase.database().ref('users/' + userId).set({
      email: user.email,
      lastLogin: new Date().toString(),
    })
      .then(() => {
        console.log('Data added successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetData = () => {
    const userId = user.uid;
    firebase.database().ref('users/' + userId).once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        console.log('Data retrieved successfully:', data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text>{user ? `Welcome, ${user.email}` : 'Please log in'}</Text>
      {user ? (
        <Button title="Log out" onPress={handleLogout} />
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Log in" onPress={handleLogin} />
        </>
      )}
      {user && (
        <>
          <Button title="Add data" onPress={handleAddData} />
          <Button title="Get data" onPress={handleGetData} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '80%',
  },
});
