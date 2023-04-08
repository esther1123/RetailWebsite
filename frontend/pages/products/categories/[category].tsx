import { Box, ColumnLayout } from '@awsui/components-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import { Product } from '../[productId]';

export const categories: string[] = [
  'Tools',
  'Footwear',
  'Books',
  'Housewares',
  'Homedecor',
  'Apparel',
  'Jewelry',
  'Beauty',
  'Electronics',
  'Accessories',
  'Seasonal',
  'Outdoors',
  'Floral',
  'Furniture',
  'Instruments',
  'Groceries'
];

export const ProductOverview = (product: Product) => {
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
      <Box color="text-body-secondary">
        ${product.price}
      </Box>
    </div>
  );
};

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?category=' + category)
      .then(res => {
        res.json().then(res => {
          setProducts(res.Items);
        });
      });
  }, [router.query.category]);


  return (
    <Layout>
      <ColumnLayout columns={4} variant="text-grid">
        {products.map(product => ProductOverview(product))}
      </ColumnLayout>
    </Layout>
  );
};

export default CategoryPage;
