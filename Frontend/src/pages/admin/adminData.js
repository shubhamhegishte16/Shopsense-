export const users = [
  ['Priya Deshmukh', 'priya.d@example.com', 'Aug 14, 2026', 'Active', '24', '18,450', '2 mins ago', '2', '/Shopsense logo.png'],
  ['Rohan Verma', 'rohan.v@example.com', 'Aug 13, 2026', 'Active', '18', '12,230', '15 mins ago', '1', null],
  ['Sneha Iyer', 'sneha.iyer@example.com', 'Aug 13, 2026', 'Active', '31', '22,890', '1 hour ago', '0', '/Shopsense logo.png'],
  ['Ajay Kumar', 'ajay.kumar@example.com', 'Aug 12, 2026', 'Active', '12', '7,560', '3 hours ago', '1', null],
  ['Meera Shah', 'meera.shah@example.com', 'Aug 11, 2026', 'Active', '9', '5,430', '5 hours ago', '0', null],
  ['Vivek Singh', 'vivek.singh@example.com', 'Aug 10, 2026', 'Suspended', '6', '2,980', '2 days ago', '3', null],
  ['Kavya Nair', 'kavya.nair@example.com', 'Aug 10, 2026', 'Active', '27', '15,610', '1 day ago', '0', '/Shopsense logo.png'],
  ['Amit Sharma', 'amit.sharma@example.com', 'Aug 9, 2026', 'Active', '16', '9,230', '2 days ago', '1', null],
  ['Deepak Patil', 'deepak.patil@example.com', 'Aug 8, 2026', 'Inactive', '3', '1,250', '7 days ago', '0', null],
  ['Neha Gupta', 'neha.gupta@example.com', 'Aug 7, 2026', 'Active', '14', '8,430', '3 days ago', '2', '/Shopsense logo.png'],
];

export const receipts = [
  ['RCPT-00045123', 'Priya Deshmukh', 'D-Mart', 'Aug 14, 2026', '10:32 AM', '2,845.60', 'Processed', 'Success', '/Shopsense logo.png'],
  ['RCPT-00045122', 'Rohan Verma', 'Reliance Smart', 'Aug 14, 2026', '09:15 AM', '1,234.00', 'Processed', 'Success', null],
  ['RCPT-00045121', 'Sneha Iyer', 'BigBasket', 'Aug 14, 2026', '08:47 AM', '978.30', 'Processing', 'In Progress', '/Shopsense logo.png'],
  ['RCPT-00045120', 'Ajay Kumar', 'More Supermarket', 'Aug 14, 2026', '07:55 AM', '3,210.75', 'Needs Review', 'Success', null],
];

export const products = [
  ['Amul Taaza Toned Milk 1 L', 'Amul', 'Dairy & Eggs', 'D-Mart', '65.00', '-', 'Active', 'Aug 14, 2026'],
  ['Lays Classic Salted 52 g', 'Lays', 'Snacks & Beverages', 'Reliance Smart', '20.00', '-', 'Active', 'Aug 14, 2026'],
  ['Fortune Sunlite Refined Oil 1 L', 'Fortune', 'Household Essentials', 'BigBasket', '145.00', '-', 'Active', 'Aug 13, 2026'],
  ['Maggi 2-Minute Noodles 280 g', 'Maggi', 'Snacks & Beverages', 'D-Mart', '32.00', '-', 'Active', 'Aug 13, 2026'],
  ['Cadbury Dairy Milk Chocolate', 'Cadbury', 'Snacks & Beverages', 'Reliance Smart', '85.00', '-', 'Active', 'Aug 13, 2026'],
  ['MDH Turmeric Powder 100 g', 'MDH', 'Grocery & Staples', 'More Supermarket', '28.00', 'Recalled', 'Active', 'Aug 12, 2026'],
  ['Dove Intense Repair Shampoo', 'Dove', 'Personal Care', 'Blinkit', '199.00', '-', 'Active', 'Aug 12, 2026'],
];

export const recalls = [
  ['RC-2026-00024', 'Amul Taaza Toned Milk 1 L', 'Amul', 'Possible contamination (Listeria)', 'High', 'Aug 14, 2026', 'Active', '512'],
  ['RC-2026-00023', 'FreshFarm Spinach 250 g', 'FreshFarm', 'Incorrect allergen label', 'Medium', 'Aug 12, 2026', 'Active', '286'],
  ['RC-2026-00022', 'NutriBite Protein Bar', 'NutriBite', 'Undeclared peanuts', 'High', 'Aug 10, 2026', 'Inactive', '174'],
  ['RC-2026-00021', 'DailyFresh Paneer 200 g', 'DailyFresh', 'Storage temperature breach', 'Medium', 'Aug 8, 2026', 'Expired', '93'],
];

export const communityReports = [
  ['#CI-1256', 'Receipt scanner incorrectly identified Amul Taaza as Amul Gold.', 'Receipt Scanning Issue', 'Priya Deshmukh', 'High', 'Open', 'Aug 14, 2026', '10:32 AM'],
  ['#CI-1255', 'The price of Britannia Milk Bikis is showing incorrect.', 'Incorrect Price', 'Rohan Verma', 'Medium', 'In Progress', 'Aug 14, 2026', '09:15 AM'],
  ['#CI-1254', 'Pantry expiry date is not updating automatically.', 'App Bug / Glitch', 'Sneha Iyer', 'Medium', 'Open', 'Aug 13, 2026', '08:47 AM'],
  ['#CI-1253', 'AI suggested overpriced alternatives. Not helpful.', 'AI Recommendation Issue', 'Ajay Kumar', 'Low', 'In Progress', 'Aug 13, 2026', '07:22 AM'],
];

export const notifications = [
  ['NTF-1842', 'Food Recall Alert', 'Amul Taaza Toned Milk 1L', 'recall', 'All Users', '12,532 users', 'High', 'Sent', 'Aug 14, 2026', '10:30 AM', 'Aug 14, 2026 10:31 AM', 'Admin', 'We have detected that Amul Taaza Toned Milk 1L (Batch B2408) has been recalled due to possible contamination. If you have purchased this product, please stop using it and stay safe.', 'Recall_Details_Amul_Milk.pdf', '215 KB'],
  ['NTF-1841', 'Receipt Processing Failed', "We couldn't process your receipt", 'system', 'All Users', '-', 'Medium', 'Sent', 'Aug 14, 2026', '09:15 AM', 'Aug 14, 2026 09:15 AM', 'System', 'A receipt could not be processed because the uploaded image was unclear. Please upload a sharper image with the full receipt visible.', '', ''],
  ['NTF-1840', 'New Feature: Pantry Advisor', 'Smart suggestions for your pantry', 'feature', 'All Users', '12,532 users', 'Medium', 'Sent', 'Aug 13, 2026', '06:40 PM', 'Aug 13, 2026 06:42 PM', 'Admin', 'Pantry Advisor is now live with smart expiry reminders, restock prompts, and shopping suggestions based on your recent receipts.', '', ''],
  ['NTF-1839', 'Scheduled Maintenance', 'ShopSense will be briefly unavailable', 'system', 'Premium Users', '1,284 users', 'Low', 'Scheduled', 'Aug 15, 2026', '01:00 AM', 'Aug 15, 2026 01:00 AM', 'Ops Team', 'We will perform maintenance to improve platform reliability. The app may be unavailable for up to 20 minutes.', '', ''],
  ['NTF-1838', 'Weekly Savings Summary', 'Your savings report is ready', 'admin_note', 'Active Users', '8,410 users', 'Low', 'Draft', 'Aug 12, 2026', '05:25 PM', '-', 'Admin', 'Your weekly savings summary is ready. Open Insights to review top deals, missed savings, and smarter shopping suggestions.', '', ''],
  ['NTF-1837', 'Offer Push Failed', 'Discount alert delivery issue', 'system', 'Segment: Offers', '3,906 users', 'Medium', 'Failed', 'Aug 11, 2026', '02:10 PM', '-', 'System', 'The promotion alert could not be delivered to a subset of users because the push provider rejected the request.', '', ''],
];
