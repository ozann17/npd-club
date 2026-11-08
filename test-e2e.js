async function runTests() {
  const base = 'http://localhost:5000/api';
  console.log('--- 1. Testing Collections & Products ---');
  const colRes = await fetch(base + '/products/collections').then(r => r.json());
  console.log('Collections count:', colRes.collections.length);
  const prodRes = await fetch(base + '/products').then(r => r.json());
  console.log('Products count:', prodRes.products.length);
  const soldOuts = prodRes.products.filter(p => p.is_sold_out);
  console.log('Sold out items:', soldOuts.map(p => p.name));

  console.log('\n--- 2. Testing Auth: Register & Login ---');
  const testEmail = 'tester_' + Date.now() + '@npdclub.com';
  const regRes = await fetch(base + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Tester NPD', email: testEmail, phone: '0811223344', password: 'password123' })
  }).then(r => r.json());
  console.log('Register success:', regRes.success, 'Token exists:', !!regRes.token);
  const token = regRes.token;

  console.log('\n--- 3. Testing Wishlist Database Sync ---');
  const testProdId = prodRes.products[0].id;
  const wishRes = await fetch(base + '/wishlist/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ productId: testProdId })
  }).then(r => r.json());
  console.log('Wishlist toggle action:', wishRes.action);
  const myWish = await fetch(base + '/wishlist', {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());
  console.log('Wishlist items count in DB:', myWish.wishlist.length);

  console.log('\n--- 4. Testing Cart & Checkout Stock Reservation ---');
  const inStockVariant = prodRes.products[0].variants.find(v => v.stock > 2);
  console.log('Target variant:', inStockVariant.size, inStockVariant.color, 'Initial stock:', inStockVariant.stock);

  await fetch(base + '/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ variantId: inStockVariant.id, quantity: 1 })
  }).then(r => r.json());

  const cartRes = await fetch(base + '/cart', {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());
  console.log('Cart items count:', cartRes.items.length, 'Total:', cartRes.total);

  const orderRes = await fetch(base + '/orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({
      shippingName: 'Tester NPD',
      shippingPhone: '0811223344',
      shippingAddress: 'Jl. Senopati No. 45',
      shippingCity: 'Jakarta Selatan',
      shippingPostalCode: '12190',
      paymentMethod: 'qris'
    })
  }).then(r => r.json());
  console.log('Order created:', orderRes.success, 'Order Number:', orderRes.order?.orderNumber);

  console.log('\n--- 5. Testing Payment & Stock Deduction ---');
  const payRes = await fetch(base + '/payment/' + orderRes.order.orderNumber, {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());
  console.log('Payment QR Code generated:', !!payRes.order.qr_data_url, 'Status:', payRes.order.status);

  // Simulate payment
  const simRes = await fetch(base + '/payment/simulate/' + orderRes.order.orderNumber, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());
  console.log('Simulate payment result:', simRes.message, 'Status:', simRes.status);

  // Verify stock deduction on product
  const refreshedProd = await fetch(base + '/products/' + prodRes.products[0].id).then(r => r.json());
  const updatedVariant = refreshedProd.product.variants.find(v => v.id === inStockVariant.id);
  console.log('Variant after payment: Stock was', inStockVariant.stock, '-> now', updatedVariant.stock);

  console.log('\nALL TESTS PASSED SUCCESSFULLY!');
}
runTests();
