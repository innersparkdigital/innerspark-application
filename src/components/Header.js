import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appColors, parameters } from '../global/Styles';
import { Icon } from '@rneui/base';

// the header functional component
export default function Header({title, type, navigation}) {
    return(
        <View style={styles.header}>
            <View style={{ marginLeft: 10 }}>
                <Icon 
                    type = "material-community" 
                    name = {type}
                    color = {appColors.headerText}
                    size = {28}
                    onPress = { () => {
                        navigation.goBack()
                    } }
                />
            </View>
            <View>
                <Text style={styles.headerText}>{title}</Text>
            </View>
            {/* <View style={{ marginRight: 10 }}>
                <Icon 
                    type = "material-community" 
                    name = {type}
                    color = {colors.headerText}
                    size = {28}
                    onPress = { () => {} }
                />
            </View> */}
        </View>
    );
}


// Header Styles
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        backgroundColor: appColors.DoffeeGreen,
        height: parameters.headerHeight,
        //justifyContent: "space-between"
    },
    headerText: {
        color: appColors.headerText,
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 20,
    }
});