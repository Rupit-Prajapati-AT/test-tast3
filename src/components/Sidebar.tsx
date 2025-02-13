import { Box, Flex, IconButton } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import React, { FC } from "react";
import MyForm, { MyFormProps } from "./MyForm";

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
        bg="gray.800"
        color="white"
        transition="width 0.3s"
        p={3}
      >
        <IconButton
          aria-label="Toggle Menu"
          onClick={() => {
            setIsOpen(!isOpen);
            props.setEditValues(undefined);
          }}
          color="white"
          bg="transparent"
          _hover={{ bg: "gray.600" }}
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
