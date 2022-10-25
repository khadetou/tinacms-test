import TinaCMS from "tinacms";
import { tinaConfig } from "../schema";

// Importing the TinaProvider directly into your page will cause Tina to be added to the production bundle.
// Instead, import the tina/provider/index default export to have it dynamially imported in edit-moode
/**
 *
 * @private Do not import this directly, please import the dynamic provider instead
 */
const TinaProvider = ({ children }) => {
  return <TinaCMS 
  {...tinaConfig}
  documentCreatorCallback={{
    onNewDocument: ({ collection:{slug}, breadcrumbs})=>{
      const relativeUrl = `/${slug}/${breadcrumbs.join("/")}`;
      return (window.location.href = relativeUrl);
    },
    filterCollections:(options)=>{
      return options.filter((option)=> option.label === "Blog Posts");
    }
  }}
  >{children}</TinaCMS>;
};

export default TinaProvider;
