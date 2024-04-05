import { SET_DATA, SET_ERROR, SET_LOADING, SET_URL, SET_EMAIL, SET_LOGIN, SET_PASSWORD, SET_USER_NAME, SET_TITLE, SET_DESCRIPTION, SET_TASK_STATUS, SET_MODEL_ADD, SET_MODEL_LOADING, SET_TASK_ID, SET_PAGES, SET_CURRENT_PAGE, SET_NAME, SET_DEADLINE } from "./actionType";

const initialstate = {
    login:true,
    userName:"",
    email:"",
    loading:false,
    error:false,
    url:"",
    title:"",
    description:"",
    deadline:"",
    taskStatus:false,
    addModel:true,
    modelLoading:false,
    pages:1,
    currentPage:1,
    taskId:"",
    password:"",
    name:"",
    data:[]
};

export const reducer = (state=initialstate,{type,payload})=>{
    switch(type){
        case SET_DATA :
            return {...state,data:payload};
         
        case SET_LOGIN :
            return {...state,login:payload};
        
        case SET_USER_NAME :
            return {...state,userName:payload};    
          
        case SET_EMAIL :
            return {...state,email:payload};    

        case SET_PASSWORD :
            return {...state,password:payload}    

        case SET_URL:
            return {...state,url:payload};

        case SET_LOADING :
            return {...state,loading:payload};

        case SET_ERROR :
            return {...state,error:payload};   
        case SET_TITLE :
            return {...state,title:payload};
            
        case SET_DESCRIPTION :
            return {...state,description:payload};
        
        case SET_DEADLINE :
            return {...state };    
        
        case SET_TASK_STATUS :
            return {...state,taskStatus:payload}; 
        case SET_MODEL_ADD :
            return {...state,addModel:payload};
        case SET_MODEL_LOADING :
            return {...state,modelLoading:payload}; 
            
        case SET_TASK_ID : 
            return {...state,taskId:payload};
        case SET_PAGES :
            return {...state,pages:payload};
        case SET_CURRENT_PAGE :
            return{...state,currentPage:payload}; 
        case SET_NAME :
            return {...state,name:payload};       
        default :
            return {...state};
    }
}