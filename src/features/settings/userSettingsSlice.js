import { createSlice } from "@reduxjs/toolkit";

/** User Settings Data Store */
export const userSettingsSlice = createSlice({
    name: 'userSettings',
    initialState: {
      walletBalanceVisibility: true, // toggles wallet balance visibility
      wastecoinBalanceVisibility: true, // toggles wastecoins balance visibility
    
    },
    reducers: {
        updateWalletBalanceVisibility: (state, action) => {
            state.walletBalanceVisibility = action.payload
        },

        updateWastecoinBalanceVisibility: (state, action) => {
            state.wastecoinBalanceVisibility = action.payload            
        },
       
    }
})

// Action creators are generated for each case function
export const { 
    updateWalletBalanceVisibility,
    updateWastecoinBalanceVisibility, 

} = userSettingsSlice.actions

export default userSettingsSlice.reducer