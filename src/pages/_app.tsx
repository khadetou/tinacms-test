import TinaProvider from "../../.tina/components/TinaDynamicProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { Navbar } from "@/components/Layout/Navbar/Navbar";

const App = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Navbar />
      <TinaProvider>
        <Component {...pageProps} />
      </TinaProvider>
    </ChakraProvider>
  );
};

export default App;
