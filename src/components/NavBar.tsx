import { HStack, Image, Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";

const NavBar = () => {
  return (
    <HStack justifyContent={"space-between"}>
      <Image src={logo} boxSize={"60px"} />
      <ChakraLink as={ReactRouterLink} to={"/engine"}>
        Play Against Stockfish
      </ChakraLink>
      <ChakraLink as={ReactRouterLink} to={"/offline"}>
        Offline Chess
      </ChakraLink>
      <ChakraLink as={ReactRouterLink} to={"/online"}>
        Online Chess
      </ChakraLink>
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
