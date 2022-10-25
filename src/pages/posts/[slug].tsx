import { Layout } from "../../components/Layout/Layout";
import { useTina } from "tinacms/dist/edit-state";
import { client } from "../../../.tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import {
  Box,
  Heading,
  Code,
  Text,
  ChakraComponent,
  Link,
  useColorModeValue as mode,
  chakra,
} from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";
import { Seo } from "@/components/Seo";
import { VideoPlayer } from "@/components/Blog/VideoPlayer";

interface SlugProps {
  query: any;
  variables: any;
  data: any;
}
const Slug: FC<SlugProps> = ({ query, variables, data: datas }) => {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: query,
    variables: variables,
    data: datas,
  });
  console.log(data);

  const components = {
    h1: (props) => <Heading as="h1" fontSize="6xl" my={2} {...props} />,
    h2: (props) => (
      <Heading
        as="h2"
        color={mode("purple.600", "purple.300")}
        fontSize="5xl"
        my={2}
        {...props}
      />
    ),
    h3: (props) => (
      <Heading
        as="h3"
        color={mode("purple.600", "purple.300")}
        fontSize="4xl"
        my={2}
        {...props}
      />
    ),
    h4: (props) => (
      <Heading
        as="h4"
        color={mode("purple.600", "purple.300")}
        fontSize="3xl"
        my={2}
        {...props}
      />
    ),
    h5: (props) => (
      <Heading
        as="h5"
        color={mode("purple.600", "purple.300")}
        fontSize="2xl"
        my={2}
        {...props}
      />
    ),
    h6: (props) => (
      <Heading
        as="h6"
        color={mode("purple.600", "purple.300")}
        fontSize="xl"
        my={2}
        {...props}
      />
    ),
    li: (props) => <Box as="li" fontSize="xl" my={2} mx={4} {...props} />,
    ul: (props) => <Box as="ul" fontSize="xl" my={2} mx={4} {...props} />,
    ol: (props) => <Box as="ol" fontSize="xl" my={2} mx={4} {...props} />,
    a: (props) => {
      return <Link href={props.href}>{props.children}</Link>;
    },
    code: (props) => {
      return (
        <Code colorScheme="purple" fontSize="xl" my={2}>
          {props.children}
        </Code>
      );
    },
    p: (props) => {
      return <Text fontSize="xl" my={2} {...props} />;
    },
    img: (props) => {
      const BlogImage = chakra(Image, {
        shouldForwardProp: (prop) =>
          ["height", "width", "quality", "src", "alt"].includes(prop),
      });
      return (
        <BlogImage
          mx="auto"
          src={props.url}
          height="500"
          width="1080"
          alt={props.alt}
          objectFit="contain"
          quality="70"
        />
      );
    },
    youtube: (props) => {
      return <VideoPlayer url={props.url} />;
    },
  };
  if (data && data?.post) {
    return (
      <>
        <Seo
          title={data.post.title}
          description={data.post.description}
          image={data.post.image}
          date={data.post.date}
        />
        <Box maxWidth="1080px" width="100%" mx="auto" mt={[2, 4]} mb="4" px="4">
          <article>
            <Heading
              as="h1"
              color="purple.300"
              size="3xl"
              textAlign="center"
              my={8}
            >
              {data.post.title}
            </Heading>
            <TinaMarkdown content={data.post.body} components={components} />
          </article>
        </Box>
      </>
    );
  }
  return (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  );
};

export default Slug;

export const getStaticPaths = async () => {
  const { data } = await client.queries.postConnection();
  const paths = data.postConnection.edges.map((x) => {
    return { params: { slug: x.node._sys.filename } };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (ctx) => {
  const { data, query, variables } = await client.queries.post({
    relativePath: ctx.params.slug + ".mdx",
  });

  return {
    props: {
      data,
      query,
      variables,
    },
  };
};
