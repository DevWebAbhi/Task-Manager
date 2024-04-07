import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  useToast,
  Spinner,
  useMediaQuery,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import axiosInstance from "../axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { SET_DATA, SET_MODEL_LOADING } from "../Redux/actionType";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {timeCodes, monthCodes, colorCodes} from "../codes"

const DataCard = ({ Data, idx, dataEdit }) => {
  const [isSmallerThan400] = useMediaQuery("(max-width: 400px)");
  const toast = useToast();
  const selector = useSelector((store) => store);
  const dispatch = useDispatch();
  const loaction = useLocation();

  const data = useMemo(()=>Data,[Data.status,Data.title,Data.description,Data.updatedAt]);

  useEffect(()=>{
    console.log(data.updatedAt)
  },[])
  
  async function handleDelete(id) {
    try {
      dispatch({ type: SET_MODEL_LOADING, payload: true });
      const deleteTask = await axiosInstance.delete(`task/delete/${id}`);
      const tempElementData=selector.data;
      tempElementData.splice(idx-1,1);
      dispatch({type:SET_DATA,payload:tempElementData});

      toast({
        title: `Deleted Sucessfully`,
        position: "top-right",
        isClosable: true,
      });

      dispatch({ type: SET_MODEL_LOADING, payload: false });
    } catch (error) {
      toast({
        title: `Something went wrong`,
        position: "top-right",
        isClosable: true,
      });
      dispatch({ type: SET_MODEL_LOADING, payload: false });
    }
  }

  return (
    <Box
      borderRadius="1rem"
      width={isSmallerThan400 ? "12rem" : "17.9rem"}
      padding={"1rem"}
      boxSizing="border-box"
      height={!isSmallerThan400 ? "17.9rem":"21.5rem"}
      background={
        idx % 6 == 0
          ? colorCodes.six
          : idx % 5 == 0
          ? colorCodes.five
          : idx % 4 == 0
          ? colorCodes.four
          : idx % 3 == 0
          ? colorCodes.three
          : idx % 2 == 0
          ? colorCodes.two
          : colorCodes.one
      }
    >
      <Heading
        color="#212F3D"
        textAlign="start"
        fontFamily="Poppins"
        fontSize="medium"
        height={"1.32rem"}
        overflowY={"hidden"}
      >
        {data.title}
      </Heading>
      <Box height={"5.5rem"} overflowY={"hidden"}>
      <Text
        color="#212F3D"
        marginTop={"1rem"}
        textAlign="start"
        fontFamily="Poppins"
      >
        {data.description}
      </Text>
      </Box>
      <Box
        display={!isSmallerThan400 ? "flex" : "block"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"}>
          <Text fontFamily={"Poppins"} color={"#7B7D7D"}>
            Status
          </Text>
          {": "}
          <Text
            display={"flex"}
            color="#212F3D"
            textAlign="start"
            fontFamily="Poppins"
          >
            {data.status ? "Completed" : "Pending"}
          </Text>
        </Box>
        <Box
          width={"max-content"}
          display={isSmallerThan400 ? "flex" : "block"}
          marginTop={!isSmallerThan400 ? "0" : "1rem"}
        >
          <Box>
            <Button
              marginRight={!isSmallerThan400 ? "0" : "1rem"}
              marginBottom={"1rem"}
              padding={
                !selector.modelLoading ? "1.5rem 1rem" : "1.35rem 0.7rem"
              }
              borderRadius={"50%"}
              background="#17202A"
              isDisabled={selector.modelLoading}
              onClick={() => handleDelete(data._id)}
            >
              {selector.modelLoading ? (
                <Spinner />
              ) : (
                <DeleteIcon color="white" />
              )}
            </Button>
          </Box>
          <Box>
            <Button
              padding={"1.5rem 1rem"}
              borderRadius={"50%"}
              background="#17202A"
              isDisabled={selector.modelLoading}
              onClick={() => dataEdit(data._id, idx)}
            >
              <EditIcon color="white" />
            </Button>
          </Box>
        </Box>
      </Box>
      <Box marginTop={!isSmallerThan400?"-4.5rem":"-0.8rem"}>
      <Text fontSize={"smaller"} textAlign={"start"} fontFamily={"Poppins"}>{data.deadline?"Deadline: "+monthCodes[`month${Number(data.deadline.substring(5,7))}`]+" "+data.deadline.substring(8,10)+", "+data.deadline.substring(2,4)+" "+timeCodes[`hour${Number(data.deadline.substring(11,13))}`].split(" ")[0]+data.deadline.substring(13,16)+" "+timeCodes[`hour${Number(data.deadline.substring(11,13))}`].split(" ")[1]:""}</Text>
      <Text fontSize={"smaller"} textAlign={"start"} fontFamily={"Poppins"}>{data.createdAt?"Created At: "+monthCodes[`month${Number(data.createdAt.substring(5,7))}`]+" "+data.createdAt.substring(8,10)+", "+data.createdAt.substring(2,4)+" "+timeCodes[`hour${Number(data.createdAt.substring(11,13))}`].split(" ")[0]+data.createdAt.substring(13,16)+" "+timeCodes[`hour${Number(data.createdAt.substring(11,13))}`].split(" ")[1]:""}</Text>
      <Text fontSize={"smaller"} textAlign={"start"} fontFamily={"Poppins"}>{data.updatedAt?"Updated At: "+monthCodes[`month${Number(data.updatedAt.substring(5,7))}`]+" "+data.updatedAt.substring(8,10)+", "+data.updatedAt.substring(2,4)+" "+timeCodes[`hour${Number(data.updatedAt.substring(11,13))}`].split(" ")[0]+data.updatedAt.substring(13,16)+" "+timeCodes[`hour${Number(data.updatedAt.substring(11,13))}`].split(" ")[1]:""}</Text>
      </Box>
    </Box>
  );
};
 
export default DataCard;
