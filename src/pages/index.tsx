import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Layout } from "../components/Layout/Layout";
import { useTina } from "tinacms/dist/edit-state";
import { client } from "../../.tina/__generated__/client";
import { NextPage } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { Hero } from "@/components/Home/Hero";
import { Projects } from "@/components/Home/Projects";
import { FeaturedArticles } from "@/components/Home/FeaturedArticles";

interface HomeProps {
  query: any;
  variables: any;
  data: any;
}
const Home: NextPage<HomeProps> = ({ query, variables, data: datas }) => {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: query,
    variables: variables,
    data: datas,
  });

  console.log(data);
  return (
    <Layout>
      {data && data.page?.block
        ? data.page.block.map((block: any, i: number) => {
            switch (block.__typename) {
              case "PageBlockHero":
                return (
                  <Fragment key={i}>
                    <Hero data={block} />
                  </Fragment>
                );
              case "PageBlockProjects":
                return (
                  <Fragment key={i + block.__typename}>
                    <Projects data={block} />
                  </Fragment>
                );
              case "PageBlockFeatures":
                return (
                  <Fragment key={i + block.__typename}>
                    <FeaturedArticles data={block} />
                  </Fragment>
                );
            }
          })
        : null}
    </Layout>
  );
};

export default Home;

export const getStaticProps = async () => {
  const { data, query, variables } = await client.queries.page({
    relativePath: "home.mdx",
  });

  return {
    props: {
      data,
      query,
      variables,
      //myOtherProp: 'some-other-data',
    },
  };
};
