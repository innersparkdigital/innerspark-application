import { createSlice } from "@reduxjs/toolkit"

 // Recycle Flow Object data

export const recycleFlowSlice = createSlice({
    name: 'recycleFlow',
    initialState: {
        recycleData: null, // recycle data -- made of categories, userID, etc
       
    },
    reducers: {
        updateRecycleData: (state, action) => {
            state.recycleData = action.payload
        },
    }
})

// Action creators are generated for each case function
export const {
    updateRecycleData,
   

} = recycleFlowSlice.actions 

export default recycleFlowSlice.reducer