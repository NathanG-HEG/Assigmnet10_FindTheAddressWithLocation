import {StatusBar} from 'expo-status-bar';
import {Alert, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useEffect, useState} from "react";
import MapView, {Marker} from "react-native-maps";
import * as Location from 'expo-location';

export default function App() {

    const key = "yl6UPIzrcqBjwUJpfHUGGElMaqDGNECG";
    const latitudeDelta = 0.0322;
    const longitudeDelta = 0.0221;

    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
    });
    const [marker, setMarker] = useState({
        latitude: 60.201373,
        longitude: 24.934041
    });
    const [input, setInput] = useState("Haaga-Helia");

    const fetchLocation = () => {
        fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${input}`)
            .then(response => response.json())
            .then(data => {
                location = data.results[0].locations[0]

                setRegion({
                    latitude: location.latLng.lat,
                    longitude: location.latLng.lng,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                });

                setMarker({
                    latitude: location.latLng.lat,
                    longitude: location.latLng.lng,
                })
            })
            .catch(error => {
                Alert.alert('Error', error);
            });
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission to get location')
                return;
            }
            console.log("Before getCurrentPositionAsync");
            let location = await Location.getCurrentPositionAsync({});
            console.log("After getCurrentPositionAsync");
            console.log(location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                longitudeDelta: longitudeDelta,
                latitudeDelta: latitudeDelta
            });
            setMarker({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={{flex: 1, height: '100%', width: '100%'}}
                region={region}>
                <Marker
                    coordinate={marker}
                    title={input}/>
            </MapView>
            <TextInput style={styles.text}
                       placeholderTextColor='grey'
                       placeholder='Haaga-Helia'
                       onChangeText={text => setInput(text)}
            />
            <Pressable style={{backgroundColor: 'cyan', width: '100%', justifyContent: 'center'}}
                       onPress={fetchLocation}>
                <Text style={styles.text}>Show on map</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: '1%',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 25,
        justifyContent: 'center'
    }
});
