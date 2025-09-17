/**
 * App - Service Item Select Screen
 */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  
    StyleSheet, 
    Text, 
    View,
    Image,
    TouchableOpacity, 
    TextInput, 
    FlatList, 
    SafeAreaView,
    ImageBackground,
  
} from "react-native";
import { appColors, parameters } from "../../global/Styles";
import { appImages } from "../../global/Data";
import { Icon, Button } from "@rneui/themed";
import LHGenericHeader from "../../components/LHGenericHeader";
import LHGenericFeatureModal from "../../components/LHGenericFeatureModal";

// The Service Items will be loaded from the server
const items = [
  { id: '1', name: 'T-Shirt', price: 3000, icon: 'tshirt-crew', category: 'Men' },
  { id: '2', name: 'Jumper', price: 4000, icon: 'jump-rope', category: 'Men' },
  { id: '3', name: 'Trousers', price: 6000, icon: 'tshirt-v', category: 'Men' },
  { id: '4', name: 'Dress', price: 6000, icon: 'tumble-dryer', category: 'Women' },
  { id: '5', name: 'Socks', price: 1000, icon: 'tumble-dryer', category: 'Men' },
  { id: '6', name: 'Cap', price: 1000, icon: 'redhat', category: 'Men' },
  { id: '7', name: 'Jumper', price: 4000, icon: 'tumble-dryer', category: 'Men' },
];


export default function ServiceItemSelectScreen({navigation}) {

    const [isFeatureModalVisible, setIsFeatureModalVisible] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('Women');
    const [quantities, setQuantities] = useState({});

    const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        {/* <Icon name={item.icon} size={24} color="#0077be" /> */}
        <View style={{ width: 35, height: 35, backgroundColor: appColors.AppBlue, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={item.icon} type="material-community" color={appColors.CardBackground} size={20} />
        </View>
        
          <View style={styles.itemDetails}>
             <Text style={styles.itemName}>{item.name}</Text>
             <Text style={styles.itemPrice}>UGX {item.price} / Per {item.name}</Text>
          </View>
          <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantities[item.id] || 0}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
          </View>
      </View>
    );

    const updateQuantity = (id, change) => {
      setQuantities(prev => ({
        ...prev,
        [id]: Math.max((prev[id] || 0) + change, 0)
      }));
    };


  return (
    <SafeAreaView style={styles.container}>
       <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>

            <View style={{ paddingVertical:parameters.headerHeightTiny }}>
                <LHGenericHeader
                    title='Select Items' 
                    showLeftIcon={true}
                    leftIconPressed={ () => { navigation.goBack(); } } 
                />
            </View>
      
            <View style={styles.categoryContainer}>
                {['Men', 'Women', 'Kids'].map(category => (
                    <TouchableOpacity
                    key={category}
                    style={[
                        styles.categoryButton,
                        selectedCategory === category && styles.selectedCategory
                    ]}
                    onPress={() => setSelectedCategory(category)}
                    >
                    <Text style={[
                        styles.categoryText,
                        selectedCategory === category && styles.selectedCategoryText
                    ]}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.servicesContainer}>
                {['Shoe Cleaning', 'Ironing', 'Washing', 'Dry Cleaning', 'Beddings'].map(service => (
                    <TouchableOpacity
                    key={service}
                    style={[
                        styles.serviceButton,
                        service === 'Washing' && styles.selectedService
                    ]}
                    >
                    <Text style={[
                        styles.serviceText,
                        service === 'Washing' && styles.selectedServiceText
                    ]}>{service}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search for Jumpers, Gloves, Bags, Suits"
                placeholderTextColor={appColors.grey3}
            />

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />

            {/* <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>CONTINUE</Text>
            </TouchableOpacity> */}

       
            <View style={{ paddingHorizontal:20, paddingVertical:10, marginBottom:5 }}>
                <Button 
                    title="CONTINUE" 
                    buttonStyle={ parameters.appButtonXLBlue }
                    titleStyle={ parameters.appButtonXLTitle }
                    onPress={
                        () => {
                            // Proceed to the next step
                            // TODO: Implement the next step
                            // navigate to pickup details screen
                            navigation.navigate('PickupDetailsScreen');
                        }
                    }
                />
            </View>

        
            {/** Generic Feature Modal */}
            <LHGenericFeatureModal 
                isModVisible={ isFeatureModalVisible } 
                visibilitySetter={setIsFeatureModalVisible} 
                isDismissable={true}
                title="Proceed to Pickup Details"
                description="You will be required to provide the pickup details. We will pick up your laundry and deliver it to you. Coming soon."
            />

        </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: appColors.AppBlue,
  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: appColors.grey6,
  },

  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: appColors.CardBackground,
    // some shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  selectedCategory: {
    backgroundColor: appColors.AppBlue,
  },

  categoryText: {
    color: appColors.AppBlue,
    fontWeight:'700',
  },

  selectedCategoryText: {
    color: appColors.CardBackground,
  },

  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },

  serviceButton: {
    paddingVertical: 8,
    
  },
  selectedService: {
    borderBottomWidth: 2,
    borderBottomColor: appColors.AppBlue,
  },

  serviceText: {
    color: appColors.AppBlue,
  },

  selectedServiceText: {
    color: appColors.AppBlue,
    fontWeight:'700',
  },

  searchInput: {
    margin: 16,
    padding: 8,
    backgroundColor: appColors.grey6,
    borderRadius: 8,
    color: appColors.AppBlue,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },

  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },

  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
  },

  itemPrice: {
    color: appColors.grey3,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityButton: {
    fontSize: 24,
    color: appColors.AppBlue,
    paddingHorizontal: 8,
  },

  quantity: {
    fontSize: 16,
    paddingHorizontal: 8,
    color: appColors.AppBlue,
    fontWeight: 'bold',
  },

  continueButton: {
    backgroundColor: appColors.AppBlue,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  continueButtonText: {
    color: appColors.CardBackground,
    fontWeight: 'bold',
  },

  
});




