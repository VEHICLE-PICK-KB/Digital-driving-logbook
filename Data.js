import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('Apkdb.db');

const Data = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    db.transaction(tx => {
      tx.executeSql('select * from routesProd;', [], (_, { rows }) => {
        setData(rows._array);
      });
    });
  };
 
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={{fontSize: 26, color: '#fff'}}>Date: {item.date}</Text>
      <Text style={styles.itemText}>Start Point: {item.startPoint}</Text>
      <Text style={styles.itemText}>Destination: {item.destination}</Text>
      <Text style={styles.itemText}>Distance driven: {item.distance}</Text>
      <Text style={styles.itemText}>Vehicle Odometer at arrival: {item.vehicleOdo}</Text>
    </View>
  );

  return (
    
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      />
      
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    backgroundColor: '#000',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Data;