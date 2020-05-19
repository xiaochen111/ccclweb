import React, { PureComponent } from 'react';
import PageWrapper from '@/components/PageWrapper';
import DoorPlaceOrder from '@/components/DoorPrice/Order';

class DoorPlaceOrderPage extends PureComponent<any, any> {
  render() {
    return (
      <PageWrapper>
        <DoorPlaceOrder />
      </PageWrapper>
    );
  }
}

export default DoorPlaceOrderPage;
