import { Box, Button, ColumnLayout, Modal, SpaceBetween } from '@awsui/components-react';
import { API, Auth } from 'aws-amplify';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { ProductOverview } from './categories/[category]';

export interface Product {
  readonly category: string;
  readonly id: string;
  readonly current_stock: number;
  readonly description: string;
  readonly image: string;
  readonly name: string;
  readonly price: number;
  readonly style: string;
}

const ProductDetail = (product: Product, email: string, visible: boolean, setVisible) => {
  // const imageSrc = 'http://d3b3nkj2ox59jg.cloudfront.net/images/' + product.category + '/' + product.image;
  // const imageSrc = 'http://d2xjoxj155s27u.cloudfront.net/images/' + product.category + '/' + product.image;
  const imageSrc = 'http://d6sqy0a9ziwhg.cloudfront.net/images/' + product.category + '/' + product.image;

  return (
    <div key={product.id}>
      <SpaceBetween direction="vertical" size="l">
        <Box fontWeight="bold" fontSize="heading-l">
          {product.name}
        </Box>
        <Box fontSize="body-m" color="text-body-secondary">
          {product.description}
        </Box>
        <Image
          loader={({ width }) => imageSrc + `?w=${width}`}
          src={imageSrc}
          alt="Product picture"
          width={900}
          height={600}
        />
        <Box fontSize="heading-m">
          {product.category} - {product.style}
        </Box>
        <Box color="text-body-secondary">
          ${product.price}
        </Box>
        <Box>
          <Button variant="primary" onClick={() => {
            setVisible(true);
            fetch(`/api/personalize/putEvents?eventType=buy&itemId=${product.id}&userId=${email}`);
          }}>Buy</Button>
        </Box>
      </SpaceBetween>
      <Modal
        onDismiss={() => setVisible(false)}
        visible={visible}
        size="medium"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={() => setVisible(false)}>OK</Button>
            </SpaceBetween>
          </Box>
        }
        header="Place Order"
      >
        <Box textAlign="center">
          <Box variant="p" color="text-status-success">
            <strong>Congratulations!</strong>
          </Box>
          <Box variant="p">
            You've placed order for {product.name} successfully.
          </Box>
          <Box margin={'l'}>
            <Image
              loader={({ width }) => imageSrc + `?w=${width}`}
              src={imageSrc}
              alt="Product picture"
              width={90}
              height={60}
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

const ProductPage = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState<Product>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (productId) {
      fetch('/api/products/' + productId)
        .then(res => {
          res.json().then(res => {
            setProduct(res.Items[0]);
          });
        });

      getSimilarItems();
      getUserEmail();
    }
  }, [productId]);

  useEffect(() => {
    if (email) {
      fetch(`/api/personalize/putEvents?eventType=view&itemId=${productId}&userId=${email}`);
    }
  }, [email]);

  const getSimilarItems = async () => {
    const similarItems = await API.get('RetailWebApp', '/similar-items?itemId=' + productId, {});

    fetch('/api/products/batchGet?ids=' + similarItems.itemList.map(item => item.itemId))
      .then(res => {
        res.json().then(res => {
          setSimilarProducts(res.Items);
        });
      });
  };

  const getUserEmail = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setEmail(user.attributes.email);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Layout>
      <Box textAlign="center">
        {product && ProductDetail(product, email, visible, setVisible)}
      </Box>
      {product && <Box margin={{ top: 'xxl' }}>
        <Box variant="h2" margin={{ top: 'xl', bottom: 'xl' }} color="text-status-info">Similar Products</Box>
        <ColumnLayout columns={4} variant="text-grid">
          {similarProducts.map(product => ProductOverview(product))}
        </ColumnLayout>
      </Box>}
    </Layout>
  );
};

export default ProductPage;
