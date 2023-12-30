import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser : null,
    error: null,
    loading: false
  }  

  export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {  
        initialSignIn : (state) => {
         state.loading = true
      },
      signInSuccess : (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
     },
     signInfailure : (state, action) => {
        state.error = action.payload;
        state.loading = false;
     },
    }
  })

  export const { initialSignIn, signInSuccess, signInfailure} = userSlice.actions;

  export default userSlice.reducer