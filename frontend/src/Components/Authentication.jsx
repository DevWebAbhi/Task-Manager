import { useEffect } from 'react';
import {
  Flex,
  Box,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useMediaQuery,
  Button,
  Text,
  useToast,
  Spinner
} from '@chakra-ui/react';
import {useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { SET_DATA, SET_EMAIL, SET_LOADING, SET_LOGIN, SET_PASSWORD, SET_USER_NAME } from '../Redux/actionType';
import axios from "axios";
const Authentication = () => {
  const selector = useSelector(store=>store);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const toast =useToast();
    const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [isSmallerThan900] = useMediaQuery('(max-width: 900px)');
    const [isSmallerThan600] = useMediaQuery('(max-width: 600px)');
    const [isSmallerThan400] = useMediaQuery('(max-width: 400px)');
    const [isSmallerThan300] = useMediaQuery('(max-width: 300px)');


  async function handleAuth(){
    if(!selector.login){
      if(selector.email=="" || selector.password=="" || selector.userName==""){
        toast({
          title: `Please fill all credentials`,
          position: "top-right",
          isClosable: true,
        })
        return;
      }
        try {
          dispatch({type:SET_LOADING,payload:true});
            const authenticate = await axios.post(`${REACT_APP_BACKEND_URL}user/signup`,{userName:selector.userName,email:selector.email,password:selector.password});
            if(authenticate.data.message=="invalid email"){
                toast({
                    title: `Invalid User`,
                    position: "top-right",
                    isClosable: true,
                  })
            }else if(authenticate.data.message=="already registered"){
                toast({
                    title: `User is already registered please login!`,
                    position: "top-right",
                    isClosable: true,
                  })
            }else if(authenticate.data.message=="internal server error"){
                toast({
                    title: `Something went wrong`,
                    position: "top-right",
                    isClosable: true,
                  })
            }else{
                localStorage.setItem("TASK-MANAGER-AUTH-TOKEN",JSON.stringify({token:authenticate.data.token,userName:authenticate.userName}));
                navigate("/tasks");
            }
            dispatch({type:SET_LOADING,payload:false});
        } catch (error) {
            toast({
                title: `Something went wrong please check your network`,
                position: "top-right",
                isClosable: true,
              })
              dispatch({type:SET_LOADING,payload:false});
        }
    }else{
      if(selector.email=="" || selector.password=="" ){
        toast({
          title: `Please fill all credentials`,
          position: "top-right",
          isClosable: true,
        })
        return;
      }
        try {
          dispatch({type:SET_LOADING,payload:true});
          console.log(selector.email,selector.password)
            const authenticate = await axios.post(`${REACT_APP_BACKEND_URL}user/login`,{email:selector.email,password:selector.password});
            if(authenticate.data.message=="unauthorized access"){
                toast({
                    title: `Invalid User`,
                    position: "top-right",
                    isClosable: true,
                  })
            }else{
                localStorage.setItem("TASK-MANAGER-AUTH-TOKEN",JSON.stringify({token:authenticate.data.token,userName:authenticate.userName}));
                navigate("/tasks");
            }
            dispatch({type:SET_LOADING,payload:false});
        } catch (error) {
            toast({
                title: `Invalid user or Network error`,
                position: "top-right",
                isClosable: true,
              })
              dispatch({type:SET_LOADING,payload:false});
        }
    }
  }

  function handleClick(status){
    if (selector.login) {
        dispatch({
          type: SET_LOGIN,
          payload: status
        });
      } else {
        dispatch({
          type: SET_LOGIN,
          payload: status
        });
      }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('TASK-MANAGER-AUTH-TOKEN');
    dispatch({type:SET_LOGIN,payload:true});
    dispatch({type:SET_USER_NAME,payload:""});
    dispatch({type:SET_EMAIL,payload:""});
    dispatch({type:SET_PASSWORD,payload:""})
    dispatch({type:SET_DATA,payload:[]});
    if (storedToken) {
      const token = JSON.parse(storedToken);
      if (token.token) {
        navigate("/tasks");
      }
    }
  }, []);

  return (
    <Box 
    height="100vh"
    background= "-webkit-linear-gradient(left, #003366,#004080,#0059b3, #0073e6)"
    overflow="auto"
    >
        <Box
        width={isSmallerThan300?"85%":isSmallerThan400?"65%":isSmallerThan600?"55%":isSmallerThan900?"35%":"25%"}
        margin="auto"
        padding="2rem"
        background="white"
        borderRadius="0.6rem"
        shadow = "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        marginTop="15vh"
        boxSizing="border-box"
        >
        <FormControl>
        <FormLabel display={!selector.login?"flex":"none"} fontFamily="Poppins" marginBottom="0.5rem">UseName</FormLabel>
        <Input 
        fontFamily="Poppins"
        display={!selector.login?"block":"none"} 
        width="100%" 
        borderRadius="0.5rem" 
        borderWidth="thin" 
        type="text"
        placeholder="User Name "
        marginBottom="0.79rem"
        onChange={(e)=>dispatch({type:SET_USER_NAME,payload:e.target.value})}
        /> 
    <FormLabel fontFamily="Poppins" marginBottom="0.5rem">Email</FormLabel>
        <Input
        fontFamily="Poppins"
        display="block" 
        width="100%" 
        borderRadius="0.5rem" 
        borderWidth="thin" 
        type='email' 
        marginBottom="0.79rem"
        placeholder="Email"
        onChange={(e)=>dispatch({type:SET_EMAIL,payload:e.target.value})}
        />
    <FormLabel fontFamily="Poppins" marginBottom="0.5rem">Password</FormLabel>
        <Input
        fontFamily="Poppins"
        display="block" 
        width="100%" 
        borderRadius="0.5rem" 
        borderWidth="thin" 
        type="password"
        marginBottom="0.79rem"
        placeholder="Password"
        onChange={(e)=>dispatch({type:SET_PASSWORD,payload:e.target.value})}
        />

        <Button 
        marginTop="0.7rem" 
        background= "-webkit-linear-gradient(left, #003366,#004080,#0059b3, #0073e6)"
        padding="0.35rem 0.75rem"
        borderRadius="0.5rem"
        fontFamily="Poppins"
        border="none"
        fontSize="medium"
        color="white"
        _hover={{padding:"0.6rem 0.95rem"}}
        onClick={handleAuth}
        >{!selector.loading?(selector.login?"Login":"Signup"):<Spinner/>}</Button>

        <Flex 
        width="80%" 
        flexDirection="row" 
        justifyContent="space-around"
         margin="auto" marginTop="0.7rem">
            <Text
            fontFamily="Poppins"
            fontSize="large"

            >{selector.login?"New ?":"have account ?"}
             &nbsp;
            <Button 
            marginTop="0.7rem" 
            background= "-webkit-linear-gradient(left, #003366,#004080,#0059b3, #0073e6)"
            padding="0.35rem 0.75rem"
            borderRadius="0.5rem"
            fontFamily="Poppins"
            border="none"
            fontSize="medium"
            color="white"
            _hover={{padding:"0.6rem 0.95rem"}}
            onClick={()=>handleClick(selector.login?false:true)}
            >
                {selector.login?"Signup":"Login"}
                </Button>
                </Text>
                </Flex>
       </FormControl>
        </Box>
    </Box>
  );
};

export default Authentication;