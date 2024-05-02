import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map() {
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });
  const [locationUpdates, setLocationUpdates] = useState([]);
  const [lastKnownLocation, setLastKnownLocation] = useState(null);
  const [routeLength, setRouteLength] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [watchObj, setWatchObj] = useState(null);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (isTracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [isTracking]);

  useEffect(() => {
    if (!isTracking) {
      if (lastKnownLocation) {
        setCoordinates({
          latitude: lastKnownLocation.coords.latitude,
          longitude: lastKnownLocation.coords.longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        });
      }
    }
  }, [lastKnownLocation, isTracking]);

  useEffect(() => {
    if (isTracking) {
      calculateRouteLength();
    }
  }, [locationUpdates]);

  useEffect(() => {
    const updateSpeed = () => {
      if (lastKnownLocation) {
        const mpsSpeed = lastKnownLocation.coords.speed || 0;
        const kphSpeed = (mpsSpeed * 3600) / 1000;
        setSpeed(kphSpeed);
      }
    };
  
    const speedInterval = setInterval(updateSpeed, 1000);
    return () => clearInterval(speedInterval);
  }, [lastKnownLocation]);

  const startLocationTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('No permission to access location');
      return;
    }

    const watchObj = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000 },
      (location) => {
        const { latitude, longitude } = location.coords;
        setCoordinates({ latitude, longitude, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
        setLocationUpdates(prevUpdates => [...prevUpdates, { latitude, longitude }]);
        setLastKnownLocation(location);
      }
    );
    setWatchObj(watchObj);
  };

  const stopLocationTracking = () => {
    if (watchObj && watchObj.remove) {
      watchObj.remove();
    }
    setLocationUpdates([]);
    setLastKnownLocation(null);
    setRouteLength(0);
    setSpeed(0);
  };

  const calculateRouteLength = () => {
    let length = 0;
    for (let i = 1; i < locationUpdates.length; i++) {
      const { latitude: lat1, longitude: lon1 } = locationUpdates[i - 1];
      const { latitude: lat2, longitude: lon2 } = locationUpdates[i];
      length += calculateDistance(lat1, lon1, lat2, lon2);
    }
    setRouteLength(length);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return distance;
  };

  const toggleTracking = () => {
    setIsTracking(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapstyle}
        region={coordinates}
      >
        <Marker
          title="Location"
          coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
        />
        <Polyline coordinates={locationUpdates} strokeWidth={4} strokeColor="#000000" />
      </MapView>
      <TouchableOpacity style={styles.button} onPress={toggleTracking}>
        <Text style={styles.buttonText}>{isTracking ? 'Stop Tracking' : 'Start Tracking'}</Text>
      </TouchableOpacity>
      <View style={styles.infoBox}>
        <Text style={styles.routeLengthText}>Route Length: {routeLength.toFixed(2)} meters</Text>
        <Text style={styles.speedText}>Speed: {speed.toFixed(2)} KM/H</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapstyle: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  routeLengthText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  speedText: {
    color: 'white',
    fontSize: 16,
  },
});