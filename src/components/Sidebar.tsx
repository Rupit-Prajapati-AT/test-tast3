import { Box, Flex, IconButton } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import React, { FC } from "react";
import { MyForm, MyFormProps } from "./Form";

interface SideBarProps extends MyFormProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: FC<SideBarProps> = ({ isOpen, setIsOpen, ...props }) => {
  return (
    <Flex>
      <Box
        w={isOpen ? "350px" : "60px"}
        h="100vh"
        transition="width 0.3s"
        p={3}
        borderRight={"1px solid red"}
        borderColor={"gray.100"}
      >
        <IconButton
          aria-label="Toggle Menu"
          onClick={() => {
            setIsOpen(!isOpen);
            props.setEditValues(undefined);
          }}
          color="white"
          bg="gray.900"
          _hover={{ bg: "gray.700" }}
          mb={4}
        >
          <FiMenu />
        </IconButton>
        {isOpen && <MyForm {...props} />}
      </Box>
    </Flex>
  );
};

export default Sidebar;
