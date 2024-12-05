import { View, Text, StyleSheet, Image, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import './assets/images/logo_moms_cafe.png';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import FontAwesome from '@expo/vector-icons/FontAwesome5';

import { Ionicons } from '@expo/vector-icons';


const HomeScreen = () => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  return (
    <TouchableWithoutFeedback onPress={() => 
      router.push('/second_page')}>
      <SafeAreaView style={styles.container}>
        <Image 
          source={require("./assets/images/logo_moms_cafe.png")}
          style={styles.image}
        />
        <Text style={styles.textCon}>
          <FontAwesome name='hand-point-up' size={15}/>  Tap Anywhere To Begin</Text>
      </SafeAreaView>

      
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#b78876',
    cursor: 'pointer',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 300,
    backgroundColor: '#F4ECD8',
    borderRadius: 100
  },
  textCon: {
    marginBottom: 50,
    color: 'white',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: .5,
  }
  

});

export default HomeScreen;



//Function
// import React, { useEffect, useState } from 'react';
// import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
// import { db, ref, onValue } from '../firebaseConfig';

// const DetailsScreen = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const productRef = ref(db, 'product');
//     onValue(productRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const productList = Object.values(data);
//         setProducts(productList);
//       }
//     });
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       {products.map((product, index) => (
//         <View key={index} style={styles.productItem}>
//           <Text style={styles.productText}>{product.name}</Text>
//         </View>
//       ))}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   productItem: {
//     padding: 15,
//     marginVertical: 5,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//   },
//   productText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default DetailsScreen;
