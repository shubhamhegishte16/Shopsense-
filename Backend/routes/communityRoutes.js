const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

router.use(protect); // All community routes require authentication

router.route('/messages')
  .get(communityController.getCommunityMessages)
  .post(communityController.postCommunityMessage);

router.route('/messages/:id')
  .delete(communityController.deleteCommunityMessage);

router.route('/issues')
  .get(communityController.getMyIssues)
  .post(communityController.reportIssue);

router.route('/issues/:id')
  .delete(communityController.deleteIssue);

module.exports = router;
