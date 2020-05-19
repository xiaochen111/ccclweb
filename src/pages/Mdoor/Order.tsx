import React, { PureComponent } from 'react';
import PageWrapper from '@/components/PageWrapper';
import DoorPlaceOrder from '@/components/DoorPrice/Order';

class DoorPlaceOrderPage extends PureComponent<any, any> {
  render() {
    return (
      <div style={{ width: '100%', padding: '0 20px' }}>
        <DoorPlaceOrder />
      </div>
    );
  }
}

export default DoorPlaceOrderPage;
