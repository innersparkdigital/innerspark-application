/**
 * New Password Screen Component
 * Handles password reset functionality
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput,
    Image,
    ActivityIndicator, 
    ImageBackground,
    Pressable,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon , BottomSheet} from '@rneui/base';
import { useToast } from 'native-base';
import { appColors, parameters } from '../../global/Styles';
import { appImages } from '../../global/Data';
import LHGenericHeader from '../../components/LHGenericHeader';
import { setNewPassword } from '../../api/shared/auth';


export default function NewPasswordScreen({ navigation, route }){

    const toast = useToast();
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordResetModalVisible, setIsPasswordResetModalVisible] = useState(false);
    const storedSessionUserId = useSelector(state => state.userData.sessionUserId ); // just for temporary use
    const { resetToken, email } = route.params || {}; // Get resetToken and email from route params


    // Toast Notifications
    const notifyWithToast = (description) => {
        toast.show({
            description: description,
            duration: 1000,
        })
    }

    // Password Handler
    const onChangePasswordHandler = (password) => {
        setPassword(password);
    }

     // Password1 Handler
     const onChangePassword1Handler = (password) => {
        setPassword1(password);
    }

    /** 
     * Password Change Form Handler 
     */
    const PasswordChangeHandler = async () => {
        // some basic validation --- More validation needed
        if (!password1.trim() || !password.trim()) {
            notifyWithToast("A new password must be provided!"); // Notify with toast
            return;
        }

        if (password1 !== password) {
            notifyWithToast("Passwords don't match!"); // Notify with toast
            return;
        }
        // set loading state
        setIsLoading(true);

        // making a request to the API using auth.js setNewPassword function
        try {
            const response = await setNewPassword(email, resetToken, password.trim());
            
            // checking the status
            if (response.status === 200) {

                // IF status is successful
                // JSON.stringify(response.data)
                if (response.data.status == "success"){

                    console.log(response.data);
                    notifyWithToast("Password reset successfully!"); // notify with Toast
                    setIsPasswordResetModalVisible(true); // Make the success modal visible
                    setIsLoading(false);
                    setPassword('');
                    setPassword1('');

                } else {
                    console.log(response.data); // what happened ?
                    notifyWithToast("Password reset failed."); // notify with Toast
                    setIsLoading(false);
                    //setPassword('');
                    //setPassword1('');
                }

            } else {

                throw new Error("Oops! Something went wrong!");

            }


        } catch (error) {
            console.log(error.message);
            notifyWithToast("Oops? Something went wrong!");  // Notify with Toasts
            setIsLoading(false);
        }

    }


    return(
        <SafeAreaView style={ styles.container }>
            <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>

                {/* Header Block */}
                <View style={{ paddingVertical:parameters.headerHeightTinier }}>
                    <LHGenericHeader
                        title='Reset Password' 
                        showTitle={false}
                        showLeftIcon={true}
                        leftIconPressed={ () => { navigation.goBack(); } } 
                    />
                </View>

                {/* Main Content Block */}
                <View style={{ flex:1, paddingHorizontal:15, paddingVertical:20, }}>

                    {/* Logo and Header Text */}
                    <View style={{ paddingVertical:2 }}>
                        <View style={{ justifyContent: "center", alignItems:"center" }}>
                            <Image source={appImages.logoRound} style={{ width:280, height:60, resizeMode:'contain' }} />
                        </View>
                        <View style={{ justifyContent:'center', alignItems:'center', paddingVertical:20, paddingHorizontal:10 }}>
                            <Text style={{ fontSize:26, color:appColors.AppBlue, fontWeight:'bold', paddingVertical:5 }}>Create New Password</Text>
                            <Text style={{ fontSize:15, color:appColors.AppBlue, fontWeight:'500', paddingVertical:5, textAlign:'center' }}>
                                Enter your new password to continue
                            </Text>
                        </View>
                    </View>

                    {/* Password Input Block */}
                    <View style={{ padding:15, borderRadius:10, }}>

                        {/* Password Input Block */}
                        <View style={styles.inputBlockRow}>
                            <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                <Icon type="material-community" name="lock"  color={appColors.grey4} size={30} />
                            </View>
                            <TextInput 
                                placeholderTextColor={ appColors.grey3 } 
                                style={{ flex:3, fontSize:16, fontWeight:'bold', color:appColors.black, paddingVertical:0 }}
                                secureTextEntry={true} 
                                editable={!isLoading}
                                placeholder='Enter New Password' 
                                value={password}
                                onChangeText={ onChangePasswordHandler }
                            />   
                        </View>

                        {/* Password1 Input Block */}
                        <View style={styles.inputBlockRow}>
                            <View style={{ justifyContent: "center", alignItems:"center", paddingRight:10 }}>
                                <Icon type="material-community" name="lock" color={appColors.grey4} size={30} />
                            </View>
                            <TextInput 
                                placeholderTextColor={ appColors.grey3 } 
                                style={{ flex:3, fontSize:16, fontWeight:'bold', color:appColors.black, paddingVertical:0 }}
                                secureTextEntry={true} 
                                editable={!isLoading}
                                placeholder='Verify New Password' 
                                value={password1}
                                onChangeText={ onChangePassword1Handler }
                                
                            /> 
                        </View>

                        { isLoading && 
                            <View style={{ flexDirection:'row', justifyContent:'center' }}>
                                <ActivityIndicator style={{ marginHorizontal:5 }} />
                                <Text style={{ color:appColors.black }}>Resetting Password...</Text>
                            </View>
                        }

                        <View style={{ paddingVertical:15 }}>
                            <Button 
                                title="Reset Password"
                                buttonStyle={ parameters.appButtonXLBlue }
                                titleStyle={ parameters.appButtonXLTitleBlue }   
                                // onPress={ PasswordChangeHandler }
                                onPress={
                                    () => {
                                        setIsPasswordResetModalVisible(true);
                                    }                               
                                }
                                disabled={isLoading}
                            /> 
                        </View>

                    </View>
                </View>
                
                {/* Feature Discovery Modal */}
                <BottomSheet
                    // containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
                    containerStyle={{ 
                        backgroundColor: appColors.CardBackground, 
                        justifyContent: 'center',
                    }}
                    modalProps = {{
                        presentationStyle:"overFullScreen",
                        visible: isPasswordResetModalVisible,
                    }} 
                >

                    <View style={{ ...parameters.doffeeModalContainer, paddingVertical:120 }}>
                        <View style={{ paddingVertical:15, paddingHorizontal:20 }}>

                            {/* Modal Content */}
                            <View style={{ justifyContent:"center", alignItems:"center", paddingVertical:20 }}>
                                
                                {/* Success Icon with Background Circle */}
                                <View style={{ 
                                    justifyContent: "center", 
                                    alignItems:"center",
                                    backgroundColor: appColors.AppBlue + '15',
                                    borderRadius: 80,
                                    width: 140,
                                    height: 140,
                                    marginBottom: 20
                                }}>
                                    <Icon 
                                        type="material-community" 
                                        name="check-circle" 
                                        color={appColors.AppBlue} 
                                        size={90} 
                                    />
                                </View>

                                {/* Success Message */}
                                <View style={{ marginVertical:10, paddingHorizontal:15 }}>
                                    <Text style={{ 
                                        fontSize: 24, 
                                        textAlign:'center', 
                                        fontWeight:"700", 
                                        paddingVertical:5, 
                                        color: appColors.black,
                                        letterSpacing: 0.3
                                    }}>
                                        Password Updated!
                                    </Text>
                                    <Text style={{ 
                                        fontSize: 15, 
                                        textAlign:'center', 
                                        paddingTop:8,
                                        color: appColors.grey2,
                                        lineHeight: 22
                                    }}>
                                        Your password has been successfully updated. You can now sign in with your new password.
                                    </Text>
                                </View>
                            </View>

                            {/* Action Button */}
                            <View style={{ justifyContent:"center", marginTop:10, marginBottom:5, paddingHorizontal:10 }}>
                                <Button 
                                    title="SIGN IN NOW" 
                                    buttonStyle={{ 
                                        ...parameters.appButtonXLBlue,
                                        paddingVertical: 16,
                                        borderRadius: 12
                                    }}
                                    titleStyle={{ 
                                        ...parameters.appButtonXLTitle,
                                        fontSize: 16,
                                        fontWeight: '600',
                                        letterSpacing: 0.5
                                    }}
                                    onPress = { 
                                        () => { 
                                            navigation.popToTop();
                                            navigation.navigate('SigninScreen');
                                        }
                                    }
                                />
                            </View>
                        </View>

                    </View>
                </BottomSheet>
                {/* -- Feature Discovery Modal ends */}

            </ImageBackground>
        </SafeAreaView>
       
    )
}

// local stylesheet for the screen
const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: appColors.CardBackground,
    },

    genericInput: {
        paddingHorizontal:8, 
        borderRadius:10, 
        backgroundColor:appColors.grey7, 
        marginVertical:8,
        color: appColors.grey1,
    },

    inputBlockRow: {
        flexDirection:'row', 
        alignItems:'center', 
        paddingHorizontal:12, 
        paddingVertical:8, 
        borderWidth:1,
        borderColor: appColors.grey4,
        borderRadius:25, 
        marginVertical:8
    },

});