import {fetchOrders} from '../scripts/services/api.js';

export let orders = [];

function normalizeOrder({_id, ...order}) {
  return {
    ...order,
    id: _id
  };
}

export async function loadOrdersFetch() {
  const ordersData = await fetchOrders();

  orders = ordersData.map(normalizeOrder);

  return orders;
}

export function addOrder(order) {
  orders.unshift(normalizeOrder(order));
}

export function getOrder(orderId) {
  return orders.find(
      (order) => order.id === orderId
  );
}
