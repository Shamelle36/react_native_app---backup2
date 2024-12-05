import { View, Text, Image, StyleSheet, TouchableOpacity, Button, SafeAreaView} from "react-native";
import './assets/images/dineIn.png'
import './assets/images/takeOut.png'
import { router } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';



const secondScreen = () => {

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
      });

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('./assets/images/logo_moms_cafe.png')}
                style={styles.image}
            />
            <Text style={styles.textCon}>Where will you be eating today?</Text>

                <View style={styles.conWrap}> 
                    <View>
                        <TouchableOpacity style={styles.wrapperButton}>
                                <Image 
                                    source={require('./assets/images/dineIn.png')}
                                    style={styles.buttonImage}
                                />
                                <Text style={styles.txtChoose}>Dine In</Text>
                        </TouchableOpacity>
                    </View>

                    
                    <View>
                            <TouchableOpacity style={styles.wrapperButton}>
                                    <Image 
                                        source={require('./assets/images/takeOut.png')}
                                        style={styles.buttonImage}
                                    />
                                    <Text style={styles.txtChoose}>Take Out</Text>
                            </TouchableOpacity>
                    </View>

                    
                    
                </View>
                
                <SafeAreaView style={styles.buttonContainer}>
                    <Button 
                        title="Continue"
                        color="#5C4033"
                        onPress={() => router.push('/home')} // Text color
                    />
            </SafeAreaView>

                
                    
                

            
        </SafeAreaView>

    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#b78876',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        
    },
    image: {
        width: 150,
        height: 150,
        marginTop: 100,
        backgroundColor: '#F4ECD8',
        borderRadius: 100
    },
    textCon: {
        padding: 10,
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Poppins_700Bold'
    },
    wrapperButton: {
        backgroundColor: '#F4ECD8',
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    buttonImage: {
        width: 150,
        height: 80,
        marginTop: 5
    },
    txtChoose: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 10,
        fontFamily: 'Poppins_700Bold',
        paddingBottom: 10
    },
    conWrap: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 50,
        marginTop: 50
    },
    buttonContainer: {
        backgroundColor: '#ff8c00',
        borderRadius: 10,
        overflow: 'hidden', 
        width: 200,
        marginTop: 200
        
    },


})

export default secondScreen;