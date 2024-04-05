import React, { useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Button,
  Input,
  useMediaQuery,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Checkbox,
  useToast,
  Spinner,
  Skeleton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { AddIcon, SearchIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { getTasks } from "../Redux/action";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  SET_DESCRIPTION,
  SET_TITLE,
  SET_URL,
  SET_TASK_STATUS,
  SET_MODEL_LOADING,
  SET_MODEL_ADD,
  SET_TASK_ID,
  SET_CURRENT_PAGE,
  SET_NAME,
  SET_DATA,
  SET_DEADLINE,
} from "../Redux/actionType";
import DataCard from "./DataCard";
import axiosInstance, { configureTokenAxios } from "../axiosInstance";

const Tasks = () => {
  const navigate = useNavigate();
  const selector = useSelector((store) => store);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const {
    isOpen: isModelOpen,
    onOpen: openModel,
    onClose: closeModel,
  } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  const toast = useToast();

  const dataInputRef1=useRef(null);
  const dataInputRef2=useRef(null);

  //handling different screen sizes

  const [isSmallerThan1190] = useMediaQuery("(max-width: 1190px)");
  const [isSmallerThan1050] = useMediaQuery("(max-width: 1050px)");
  const [isSmallerThan850] = useMediaQuery("(max-width: 850px)");
  const [isSmallerThan500] = useMediaQuery("(max-width: 500px)");
  const [isSmallerThan475] = useMediaQuery("(max-width: 475px)");
  const [isSmallerThan400] = useMediaQuery("(max-width: 400px)");

  // if no token present it will redirect to login page

  useEffect(() => {
    const name = JSON.parse(localStorage.getItem("TASK-MANAGER-AUTH-TOKEN"));
    if (!name || !name.token) {
      navigate("/");
      return;
    }
    configureTokenAxios();
    dispatch(getTasks(location.search));
    dispatch({type:SET_NAME,payload:name.userName});
  }, []);

  useEffect(() => {
    setSearchParams({
      page: selector.currentPage != 0 ? selector.currentPage : 1,
    });
    if (selector.currentPage == 0) {
      dispatch({ type: SET_CURRENT_PAGE, payload: 1 });
      dispatch(getTasks(location.search));
    }
  }, [selector.currentPage]);

  useEffect(() => {
    if (!selector.loading) {
      dispatch(getTasks(location.search));
    }
  }, [location.search]);

  useEffect(() => {
    if (selector.addModel) {
      dispatch({ type: SET_TASK_STATUS, payload: false });
      dispatch({ type: SET_DESCRIPTION, payload: "" });
      dispatch({ type: SET_TITLE, payload: "" });
    }
  }, [isModelOpen]);

  async function handleAddTask() {
    try {
      if (selector.title == "" || selector.description == "" ||selector.deadline == "") {
        toast({
          title: `Fill all the fields`,
          position: "top-right",
          isClosable: true,
        });
        return;
      }
      dispatch({ type: SET_MODEL_LOADING, payload: true });
      console.log();
      const authCode = JSON.parse(
        localStorage.getItem("TASK-MANAGER-AUTH-TOKEN")
      );
      const config = {
        headers: {
          Authorization: "Bearer " + authCode.token,
        },
      };
      const setTask = await axiosInstance.post(`task/post`, {
        title: selector.title,
        description: selector.description,
        deadline:selector.deadline,
        status: false,
      });
      console.log(setTask);
      dispatch({ type: SET_MODEL_LOADING, payload: false });
      toast({
        title: `Posted Successfully`,
        position: "top-right",
        isClosable: true,
      });
      closeModel();
      handleReset();
    } catch (error) {
      toast({
        title: `Something went wrong`,
        position: "top-right",
        isClosable: true,
      });
      dispatch({ type: SET_MODEL_LOADING, payload: false });
    }
  }

  async function handleEdit() {
    try {
      if (selector.title == "" || selector.description == "" || selector.deadline == "") {
        toast({
          title: `Fill all the fields`,
          position: "top-right",
          isClosable: true,
        });
        return;
      }
      dispatch({ type: SET_MODEL_LOADING, payload: true });
      const setTask = await axiosInstance.put(
        `task/update/${selector.taskId}`,
        {
          title: selector.title,
          description: selector.description,
          status: selector.taskStatus,
          deadline:selector.deadline
        }
      );
      dispatch({ type: SET_MODEL_LOADING, payload: false });
      toast({
        title: `Posted Successfully`,
        position: "top-right",
        isClosable: true,
      });
      closeModel();
      handleReset();
    } catch (error) {
      toast({
        title: `Something went wrong`,
        position: "top-right",
        isClosable: true,
      });
      dispatch({ type: SET_MODEL_LOADING, payload: false });
    }
  }

  async function handlePageChange(page) {
    dispatch({ type: SET_CURRENT_PAGE, payload: page });
  }

  async function dataEdit(dataId, idx) {
    try {
      console.log(dataId, idx);
      const taskData = selector.data[idx - 1];
      dispatch({ type: SET_TITLE, payload: taskData.title });
      dispatch({ type: SET_MODEL_ADD, payload: false });
      dispatch({ type: SET_TASK_STATUS, payload: taskData.status });
      dispatch({ type: SET_DESCRIPTION, payload: taskData.description });
      dispatch({ type: SET_TASK_ID, payload: dataId });
      openModel();
    } catch (error) {
      toast({
        title: `Something went wrong`,
        position: "top-right",
        isClosable: true,
      });
    }
  }

  //handling filter buttons pending or completed

  async function handleFilterButtons(e) {
    dispatch({ type: SET_CURRENT_PAGE, payload: 1 });
    if (e.target.id == "pending") {
      setSearchParams((prevSearchParams) => {
        const params = new URLSearchParams(prevSearchParams);
        params.set("status", "pending");
        return params;
      });
    } else if ((e.target.id = "completed")) {
      setSearchParams((prevSearchParams) => {
        const params = new URLSearchParams(prevSearchParams);
        params.set("status", "completed");
        return params;
      });
    }
  }



  //handling reset button

  function handleReset() {
    dispatch({ type: SET_CURRENT_PAGE, payload: 0 });
    dataInputRef1.current.value=null;
    dataInputRef2.current.value=null;
    setSearchParams(() => {
      const params = new URLSearchParams();
      params.set("page", "1");
      return params;
    });
  }

  // handling logout

  function handleLogout() {
    localStorage.setItem("TASK-MANAGER-AUTH-TOKEN", JSON.stringify({}));
    navigate("/");
  }

  return (
    <Box display="flex" margin="auto" background="#D6EAF8" padding={"2rem 0"}>
      <Box
        width="95%"
        background="white"
        borderRadius="2rem"
        margin="auto"
        display="flex"
      >
        {isSmallerThan500 ? (
          <>
            <Button
              width={"3rem"}
              paddingTop={"2rem"}
              background={"transparent"}
              border={"none"}
              colorScheme="blue"
              onClick={openDrawer}
            >
              <HamburgerIcon color={"black"} boxSize={"8"} />
            </Button>
            <Drawer
              placement={"left"}
              onClose={closeDrawer}
              isOpen={isDrawerOpen}
            >
              <DrawerOverlay />

              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">
                  <Heading fontSize={"medium"}>Task Manager</Heading>
                </DrawerHeader>
                <DrawerBody>
                  <Button
                    border="none"
                    padding="1.5rem 1rem"
                    borderRadius="50%"
                    background="#17202A"
                    display={"block"}
                    margin={"auto"}
                    marginTop="3rem"
                    onClick={() => {
                      openModel();
                      dispatch({ type: SET_MODEL_ADD, payload: true });
                    }}
                  >
                    <AddIcon marginTop={"-1.5rem"} color="white" />
                  </Button>
                  <Input placeholder="Select Date and Time" type="date"
          fontSize={"small"} 
          display={"block"}
          margin={"auto"}
          ref={dataInputRef1}
          onChange={
            (e)=>{
              setSearchParams((prevSearchParams) => {
                const params = new URLSearchParams(prevSearchParams);
                params.set("startDate", e.target.value);
                return params;
              })
            }
          }
          marginTop={"1.5rem"} width={isSmallerThan500 ? "6rem" : "7.9rem"} />
          <Input placeholder="Select Date and Time" type="date"
          fontSize={"small"} 
          display={"block"}
          margin={"auto"}
          ref={dataInputRef2}
          onChange={
            (e)=>{
              setSearchParams((prevSearchParams) => {
                const params = new URLSearchParams(prevSearchParams);
                params.set("endDate", e.target.value);
                return params;
              })
            }
          }
          marginTop={"1.5rem"} width={isSmallerThan500 ? "6rem" : "7.9rem"} />
                  <Button
                    display={"block"}
                    margin={"auto"}
                    marginTop={"1.5rem"}
                    width={isSmallerThan500 ? "6rem" : "7.9rem"}
                    id="pending"
                    onClick={handleFilterButtons}
                  >
                    Pending
                  </Button>
                  <Button
                    display={"block"}
                    margin={"auto"}
                    marginTop={"1.5rem"}
                    width={isSmallerThan500 ? "6rem" : "7.9rem"}
                    id="completed"
                    onClick={handleFilterButtons}
                  >
                    Done
                  </Button>
                  <Button
                    display={"block"}
                    margin={"auto"}
                    marginTop={"1.5rem"}
                    width={isSmallerThan500 ? "6rem" : "7.9rem"}
                    id="reset"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button
                    display={"block"}
                    margin={"auto"}
                    marginTop={"1.5rem"}
                    width={isSmallerThan500 ? "6rem" : "7.9rem"}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <></>
        )}
        <Box
          width={"min-content"}
          borderRight="1px solid #D5D8DC"
          display={!isSmallerThan500 ? "block" : "none"}
          borderWidth="thin"
          padding={"0.7rem"}
        >
          <Heading fontSize={"medium"}>Task Manager</Heading>
          <Button
            border="none"
            padding="1.5rem 1rem"
            borderRadius="50%"
            background="#17202A"
            marginTop="3rem"
            onClick={() => {
              openModel();
              dispatch({ type: SET_MODEL_ADD, payload: true });
            }}
          >
            <AddIcon color="white" />
          </Button>
          <Input placeholder="Select Date and Time" type="date"
          fontSize={"small"} 
          ref={dataInputRef1}
          onChange={
            (e)=>{
              setSearchParams((prevSearchParams) => {
                const params = new URLSearchParams(prevSearchParams);
                params.set("startDate", e.target.value);
                return params;
              })
            }
          }
          marginTop={"1.5rem"} width={isSmallerThan500 ? "6rem" : "7.9rem"} />
          <Input placeholder="Select Date and Time" type="date"
          fontSize={"small"} 
          ref={dataInputRef2}
          onChange={
            (e)=>{
              setSearchParams((prevSearchParams) => {
                const params = new URLSearchParams(prevSearchParams);
                params.set("endDate", e.target.value);
                return params;
              })
            }
          }
          marginTop={"1.5rem"} width={isSmallerThan500 ? "6rem" : "7.9rem"} />
          <Button
            display={"block"}
            margin={"auto"}
            marginTop={"1.5rem"}
            width={isSmallerThan500 ? "6rem" : "7.9rem"}
            id="pending"
            onClick={handleFilterButtons}
          >
            Pending
          </Button>
          <Button
            display={"block"}
            margin={"auto"}
            marginTop={"1.5rem"}
            width={isSmallerThan500 ? "6rem" : "7.9rem"}
            id="completed"
            onClick={handleFilterButtons}
          >
            Done
          </Button>
          <Button
            display={"block"}
            margin={"auto"}
            marginTop={"1.5rem"}
            width={isSmallerThan500 ? "6rem" : "7.9rem"}
            id="reset"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            display={"block"}
            margin={"auto"}
            marginTop={"1.5rem"}
            width={isSmallerThan500 ? "6rem" : "7.9rem"}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
        <Box
          padding={!isSmallerThan400 ? "1.5rem" : "1.5rem 0.5rem 0.5rem 0.5rem"}
          width={"100%"}
        >
          <Box display="flex">
            <Box>
              <Input
                height="2.5rem"
                borderColor="#D5D8DC"
                borderWidth="thin"
                borderRadius="0.5rem 0 0 0.5rem"
                type="text"
                onChange={(e) => {
                  dispatch({ type: SET_URL, payload: e.target.value });
                }}
                placeholder={"search"}
              />
            </Box>
            <Box>
              {" "}
              <Button
                background="#D6EAF8"
                border="none"
                padding="0"
                borderRadius="0 0.5rem 0.5rem 0"
                onClick={() => {
                  setSearchParams((prevSearchParams) => {
                    const params = new URLSearchParams(prevSearchParams);
                    params.set("q", selector.url);
                    return params;
                  });
                }}
              >
                <SearchIcon />
              </Button>
            </Box>
          </Box>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Heading
              fontSize="2rem"
              marginTop={"2rem"}
              fontWeight="500"
              fontFamily="Poppins"
              textAlign="start"
            >
              Tasks
            </Heading>
            <Heading
              fontSize="1rem"
              marginTop={"2rem"}
              fontWeight="300"
              fontFamily="Poppins"
              textAlign="end"
            >
              {selector.name}
            </Heading>
          </Box>
          {!selector.error ? (
            !selector.loading ? (
              <Box
                marginTop={"2rem"}
                display="grid"
                gridGap={"2rem"}
                minH={"30rem"}
                gridTemplateColumns={
                  !isSmallerThan1190
                    ? "repeat(3,1fr)"
                    : !isSmallerThan850
                    ? "repeat(2,1fr)"
                    : "repeat(1,1fr)"
                }
                sx={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {selector.data.length != 0 ? (
                  selector.data.map((e, idx) => {
                    return (
                      <DataCard
                        key={idx}
                        idx={idx + 1}
                        dataEdit={dataEdit}
                        Data={e}
                      />
                    );
                  })
                ) : (
                  <Box height={"50vh"} maxH={"30rem"}>
                    <Heading textAlign={"center"}>No Task</Heading>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
                marginTop={"2rem"}
                display="grid"
                gridGap={"2rem"}
                gridTemplateColumns={
                  !isSmallerThan1190
                    ? "repeat(3,1fr)"
                    : !isSmallerThan850
                    ? "repeat(2,1fr)"
                    : "repeat(1,1fr)"
                }
              >
                <Skeleton
                  width={isSmallerThan400 ? "12rem" : "17.9rem"}
                  height={!isSmallerThan400 ? "17.9rem" : "20rem"}
                  borderRadius={"1rem"}
                />
                <Skeleton
                  width={isSmallerThan400 ? "12rem" : "17.9rem"}
                  height={!isSmallerThan400 ? "17.9rem" : "20rem"}
                  borderRadius={"1rem"}
                />
                <Skeleton
                  width={isSmallerThan400 ? "12rem" : "17.9rem"}
                  height={!isSmallerThan400 ? "17.9rem" : "20rem"}
                  borderRadius={"1rem"}
                />
                <Skeleton
                  width={isSmallerThan400 ? "12rem" : "17.9rem"}
                  height={!isSmallerThan400 ? "17.9rem" : "20rem"}
                  borderRadius={"1rem"}
                />
                <Skeleton
                  width={isSmallerThan400 ? "12rem" : "17.9rem"}
                  height={!isSmallerThan400 ? "17.9rem" : "20rem"}
                  borderRadius={"1rem"}
                />
                <Skeleton
                  width={isSmallerThan400 ? "12rem" : "17.9rem"}
                  height={!isSmallerThan400 ? "17.9rem" : "20rem"}
                  borderRadius={"1rem"}
                />
              </Box>
            )
          ) : (
            <Box height={"50vh"} maxH={"30rem"}>
              <Heading textAlign={"center"}>{"Error"}</Heading>
            </Box>
          )}
          <Box margin={"auto"} marginTop={"1rem"}>
            <ResponsivePagination
              total={selector.pages}
              current={selector.currentPage}
              onPageChange={(page) => handlePageChange(page)}
            />
          </Box>
        </Box>
      </Box>
      <BasicUsage
        isModelOpen={isModelOpen}
        openModel={openModel}
        closeModel={closeModel}
        dispatch={dispatch}
        selector={selector}
        handleEdit={handleEdit}
        handleAddTask={handleAddTask}
      />
    </Box>
  );
};

function BasicUsage({
  isModelOpen,
  closeModel,
  openModel,
  dispatch,
  selector,
  handleAddTask,
  handleEdit,
}) {
  return (
    <>
      <Modal isOpen={isModelOpen} onClose={closeModel}>
        <ModalOverlay />
        <ModalContent
          fontFamily={"Poppins"}
          background="white"
          borderRadius="1.2rem"
          padding="1rem"
          margin="auto"
        >
          <ModalHeader>
            {selector.addModel ? "Add Task" : "Edit Task"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={!selector.addModel ? selector.title : null}
                onChange={(e) =>
                  dispatch({ type: SET_TITLE, payload: e.target.value })
                }
                placeholder="Title"
              />
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={!selector.addModel ? selector.description : null}
                onChange={(e) =>
                  dispatch({ type: SET_DESCRIPTION, payload: e.target.value })
                }
                placeholder="Description"
              />
              <FormLabel>Deadline</FormLabel>
              <Input
                type="datetime-local"
                value={!selector.addModel ? selector.deadline : null}
                onChange={(e) =>
                  dispatch({ type: SET_DEADLINE, payload: e.target.value })
                }
                step="3600" 
                placeholder="Deadline"
              />

              <FormLabel display={selector.addModel ? "none" : "flex"}>
                Status
              </FormLabel>
              <Checkbox
                display={selector.addModel ? "none" : "flex"}
                colorScheme="green"
                isChecked={selector.taskStatus ? true : false}
                onChange={(e) =>
                  dispatch({
                    type: SET_TASK_STATUS,
                    payload: selector.taskStatus ? false : true,
                  })
                }
              >
                Status : {selector.taskStatus ? "Completed" : "Pending"}
              </Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={selector.modelLoading}
              colorScheme="blue"
              display={"block"}
              margin={"auto"}
              onClick={selector.addModel ? handleAddTask : handleEdit}
            >
              {selector.modelLoading ? (
                <Spinner />
              ) : selector.addModel ? (
                "Add Task"
              ) : (
                "Edit Task"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Tasks;
