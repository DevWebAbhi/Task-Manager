import { SET_DATA, SET_ERROR, SET_LOADING, SET_PAGES } from "./actionType";
import axiosInstance, { configureTokenAxios } from "../axiosInstance";
export const getTasks = (url)=>async(dispatch)=>{
    configureTokenAxios();
    try {
        dispatch({type:SET_ERROR,payload:false});
        dispatch({type:SET_LOADING,payload:true});
        
        const tasks= await axiosInstance.get(`task/tasks/${url}`);
        console.log(tasks)
        dispatch({type:SET_PAGES,payload:tasks.data.page});
        dispatch({type:SET_DATA,payload:tasks.data.tasks});
        dispatch({type:SET_ERROR,payload:false});
        dispatch({type:SET_LOADING,payload:false});
    } catch (error) {
        dispatch({type:SET_ERROR,payload:true});
        dispatch({type:SET_LOADING,payload:false});
    }
}