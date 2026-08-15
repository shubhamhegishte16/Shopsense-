const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('admin'));

router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.get('/users/:userId/latest-receipt', adminController.getUserLatestReceipt);
router.patch('/users/:userId/suspension', adminController.setUserSuspension);

router.get('/receipts', adminController.getReceipts);
router.get('/receipts/:receiptId', adminController.getReceiptDetails);
router.post('/receipts/:receiptId/notes', adminController.addReceiptNote);

router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:productId', adminController.updateProduct);
router.delete('/products/:productId', adminController.deleteProduct);

module.exports = router;
