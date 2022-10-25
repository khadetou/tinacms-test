import { Layout } from "../../components/Layout/Layout";
import Link from "next/link";
import { useTina } from "tinacms/dist/edit-state";
import { client } from "../../../.tina/__generated__/client";
import { Heading, SimpleGrid, Box } from "@chakra-ui/react";
import { FeaturedPost } from "../../components/Blog/FeaturedPost/FeaturedPost";

export default function PostList(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const postsList = data.postConnection?.edges;

  const sortedPosts = postsList?.sort((a: any, b: any) => {
    let dat1: any = new Date(b.node.date);
    let dat2: any = new Date(a.node.date);
    return dat1 - dat2;
  });

  console.log(sortedPosts);

  return (
    <>
      <Layout>
        <Box maxWidth="1080px" width="100%" mx="auto" mt={[2, 4]} mb={4} px={4}>
          <Heading as="h1" textAlign="center" fontSize="3xl" m={2}>
            All Posts
          </Heading>
          <SimpleGrid columns={[1, null, 3]} spacing="40px" mt={4}>
            {sortedPosts?.map((post) => (
              <FeaturedPost
                key={post.node.id}
                href={`/posts/${post.node._sys.filename}`}
                props={post.node}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const { data, query, variables } = await client.queries.postConnection();

  return {
    props: {
      data,
      query,
      variables,
      //myOtherProp: 'some-other-data',
    },
  };
};
