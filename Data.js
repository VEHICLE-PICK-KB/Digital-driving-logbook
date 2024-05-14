import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet} from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Button } from 'react-native-paper';



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

  const shareToCSV = async () => {
    const csvData = data.map(item => {
      return `${item.date},${item.startPoint},${item.destination},${item.distance},${item.vehicleOdo}`;
    }).join('\n');

    const csvFileName = FileSystem.documentDirectory + 'exported_data.csv';

    try {
      await FileSystem.writeAsStringAsync(csvFileName, csvData);
      await Sharing.shareAsync(csvFileName);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };


  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={{ fontSize: 26, color: '#fff' }}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.itemText}>Start Point: {item.startPoint}</Text>
      <Text style={styles.itemText}>Destination: {item.destination}</Text>
      <Text style={styles.itemText}>Distance driven: {item.distance}</Text>
      <Text style={styles.itemText}>Vehicle Odometer at arrival: {item.vehicleOdo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <Button mode="contained" style={{ backgroundColor: 'red', marginBottom: 15 }} onPress={shareToCSV}>Share CSV </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContainer: {
    flexGrow: 1,
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
  button: {
    backgroundColor: 'red',
    color: 'red'
  }
});

export default Data;