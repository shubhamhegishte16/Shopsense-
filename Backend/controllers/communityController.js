const CommunityMessage = require('../models/CommunityMessage');
const IssueReport = require('../models/IssueReport');

exports.getCommunityMessages = async (req, res) => {
  try {
    const messages = await CommunityMessage.find()
      .populate('sender', 'fullName avatar role')
      .populate('recallReference')
      .sort({ createdAt: 1 }); // Oldest first for chat style
    
    res.status(200).json({
      status: 'success',
      data: {
        messages
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.postCommunityMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Message content cannot be empty' });
    }

    const newMessage = await CommunityMessage.create({
      sender: req.user._id,
      content,
      type: 'user_chat'
    });

    await newMessage.populate('sender', 'fullName avatar role');

    res.status(201).json({
      status: 'success',
      data: {
        message: newMessage
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.deleteCommunityMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await CommunityMessage.findOne({ _id: messageId, sender: req.user._id });

    if (!message) {
      return res.status(404).json({ status: 'fail', message: 'Message not found or you do not have permission to delete it' });
    }

    await message.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getMyIssues = async (req, res) => {
  try {
    const issues = await IssueReport.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        issues
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.reportIssue = async (req, res) => {
  try {
    const { issueDescription } = req.body;
    if (!issueDescription || issueDescription.trim().length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Issue description cannot be empty' });
    }

    const newIssue = await IssueReport.create({
      user: req.user._id,
      issueDescription
    });

    res.status(201).json({
      status: 'success',
      data: {
        issue: newIssue
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const issue = await IssueReport.findOne({ _id: issueId, user: req.user._id });

    if (!issue) {
      return res.status(404).json({ status: 'fail', message: 'Issue not found or you do not have permission to delete it' });
    }

    await issue.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
