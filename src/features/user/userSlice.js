import { createSlice } from "@reduxjs/toolkit";

 /* User Token object structure
    userToken = {
        userId: 13552,
        name: 'Janee',
        email: 'admin@gmail.io',
        phone: '+25689888885',
        image: '',
    }
*/

export const userSlice = createSlice({
    name: 'user',
    initialState: {
      isLoading: true,
      isSignout: false,
      userToken: null,
      localAuthToken: null, // user local authentication token 
    },
    reducers: {
        restoreToken: (state, action) => {
            state.userToken = action.payload,
            state.isLoading = false
        },
        signin: (state, action) => {
            state.isSignout = false,
            state.userToken = action.payload
        },
        signout: state => {
            state.isSignout = true,
            state.userToken = null
        },
        updateUserToken: (state, action) => {
            state.userToken = action.payload
        },
        updateLocalAuthToken: (state, action) => {
            state.localAuthToken = action.payload            
        },

    }
})

// Action creators are generated for each case function
export const { 
    restoreToken, 
    signin, 
    signout, 
    updateUserToken, 
    updateLocalAuthToken,

} = userSlice.actions

export default userSlice.reducer