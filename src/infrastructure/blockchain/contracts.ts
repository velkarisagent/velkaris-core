export interface ContractABI {
  name: string;
  address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abi: any[];
}

export const VELKARIS_MARKETPLACE_ABI: ContractABI = {
  name: 'VelkarisMarketplace',
  address: process.env.MARKETPLACE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  abi: [
    {
      type: 'function',
      name: 'purchaseListing',
      inputs: [
        { name: 'listingId', type: 'bytes32' },
        { name: 'buyerAddress', type: 'address' },
      ],
      outputs: [{ name: 'orderId', type: 'bytes32' }],
    },
    {
      type: 'function',
      name: 'completePurchase',
      inputs: [{ name: 'orderId', type: 'bytes32' }],
      outputs: [{ name: 'success', type: 'bool' }],
    },
    {
      type: 'event',
      name: 'PurchaseRecorded',
      inputs: [
        { name: 'orderId', type: 'bytes32', indexed: true },
        { name: 'buyerAddress', type: 'address', indexed: true },
        { name: 'amount', type: 'uint256' },
      ],
    },
  ],
};

export const VELKARIS_PAYMENT_ABI: ContractABI = {
  name: 'VelkarisPayment',
  address: process.env.PAYMENT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  abi: [
    {
      type: 'function',
      name: 'recordPayment',
      inputs: [
        { name: 'orderId', type: 'bytes32' },
        { name: 'amount', type: 'uint256' },
        { name: 'paymentToken', type: 'address' },
      ],
      outputs: [{ name: 'transactionHash', type: 'bytes32' }],
    },
    {
      type: 'function',
      name: 'settleEscrow',
      inputs: [
        { name: 'orderId', type: 'bytes32' },
        { name: 'sellerAddress', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: 'success', type: 'bool' }],
    },
  ],
};
