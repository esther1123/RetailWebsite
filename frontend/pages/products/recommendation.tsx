import { Box, ColumnLayout } from '@awsui/components-react';
import { API, Auth } from 'aws-amplify';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Product } from './[productId]';

const ProductOverview = (product: Product) => {
  // const imageSrc = 'http://d3b3nkj2ox59jg.cloudfront.net/images/' + product.category + '/' + product.image;
  // const imageSrc = 'http://d2xjoxj155s27u.cloudfront.net/images/' + product.category + '/' + product.image;
  const imageSrc = 'http://d6sqy0a9ziwhg.cloudfront.net/images/' + product.category + '/' + product.image;

  return (
    <div key={product.id}>
      <Link href={'/products/' + product.id}>
        <Image
          className="overview-image"
          loader={({ width }) => imageSrc + `?w=${width}`}
          src={imageSrc}
          alt="Product picture"
          width={300}
          height={200}
        />
      </Link>
      <Box fontWeight="bold">
        {product.name}
      </Box>
      <Box fontWeight="light">
        {product.category} - {product.style}
      </Box>
      <Box color="text-body-secondary">
        ${product.price}
      </Box>
    </div>
  );
};

const RecommendationPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const onLoad = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const email = user.attributes.email;

        if (email) {
          const recommentdations = await API.get('RetailWebApp', '/recommendations?userId=' + email, {});

          fetch('/api/products/batchGet?ids=' + recommentdations.itemList.map(item => item.itemId))
            .then(res => {
              res.json().then(res => {
                setProducts(res.Items);
              });
            });
        }
      } catch (e) {
        console.error(e);
      }
    };

    onLoad();
  }, [useRouter()]);

  return (
    <Layout>
      <Head>
        <title>Recommendations</title>
      </Head>

      <ColumnLayout columns={4} variant="text-grid">
        {products.map(product => ProductOverview(product))}
      </ColumnLayout>
    </Layout>
  );
};

export default RecommendationPage;