import React, { useEffect } from 'react'
import {Box,Heading,Text,Button, useToast, Spinner,useMediaQuery} from '@chakra-ui/react';
import { EditIcon,DeleteIcon } from '@chakra-ui/icons'
import axiosInstance from '../axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { SET_MODEL_LOADING } from '../Redux/actionType';
import { useNavigate } from 'react-router-dom';

const colorCodes={
    one:"#F1C40F",two:"#F39C12 ",three:"#E67E22",four:"#8E44AD",five:"#C0392B",six:"#3498DB"
}

const DataCard = ({data,idx,dataEdit,handleReset}) => {
  const [isSmallerThan475] = useMediaQuery('(max-width: 475px)');
const toast = useToast();
const selector = useSelector(store=>store);
const dispatch = useDispatch();
const navigate = useNavigate();

async function handleDelete(id){
  try {
    dispatch({type:SET_MODEL_LOADING,payload:true})
    const deleteTask = await axiosInstance.delete(`task/delete/${id}`);
    handleReset();
    toast({
      title: `Deleted Sucessfully`,
      position: "top-right",
      isClosable: true,
    })
    
    dispatch({type:SET_MODEL_LOADING,payload:false});

  } catch (error) {
    toast({
      title: `Something went wrong`,
      position: "top-right",
      isClosable: true,
    })
    dispatch({type:SET_MODEL_LOADING,payload:false});
  }
}



  return (
    <Box 
    borderRadius="1rem"
    width={isSmallerThan475?"10rem":"15rem"}
    padding={"1rem"}
    boxSizing="border-box"
    height="15rem"
    background={idx%6==0?colorCodes.six:idx%5==0?colorCodes.five:idx%4==0?colorCodes.four:idx%3==0?colorCodes.three:idx%2==0?colorCodes.two:colorCodes.one}>
        <Heading color="#212F3D" textAlign='start' fontFamily="Poppins" fontSize="medium">
            {data.title}
        </Heading>
        <Text color="#212F3D" marginTop={"1rem"} textAlign='start' fontFamily="Poppins" width={"8rem"} height={"4.5rem"} maxHeight="6rem" overflow="hidden">{data.description}</Text>
        <Box display={!isSmallerThan475?"flex":"block"} justifyContent={"space-between"} >
          <Box display={"flex"}>
          <Text fontFamily={"Poppins"} color={"#7B7D7D"}>Status</Text>{": "}
          <Text  display={"flex"}  color="#212F3D" textAlign='start' fontFamily="Poppins">{data.status?"Completed":"Pending"}</Text>
          </Box>
        
        <Box width={"max-content"} display={isSmallerThan475?"flex":"block"} marginTop={!isSmallerThan475?"0":"1rem"}>
        <Box>
        <Button marginBottom={"1rem"} padding={!selector.modelLoading?"1.5rem 1rem":"1.35rem 0.7rem"} borderRadius={"50%"} background="#17202A" isDisabled={selector.modelLoading} onClick={()=>handleDelete(data._id)}>{selector.modelLoading?<Spinner/>:<DeleteIcon color="white"/>}</Button>
        </Box>
        <Box>
        <Button  padding={"1.5rem 1rem"} borderRadius={"50%"} background="#17202A" onClick={()=>dataEdit(data._id,idx)}><EditIcon color="white"/></Button>
        </Box>
        </Box>
        </Box>
    </Box>
  )
}

export default DataCard
