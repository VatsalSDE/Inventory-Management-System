# 📧 Email Setup Guide for Billing System

## Overview
The billing system now supports sending professional bills directly to dealer email addresses. This guide will help you set up email functionality.

## 🔧 Setup Steps

### 1. **Gmail Setup (Recommended for Development)**

#### Option A: Use App Password (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App Passwords
3. Generate an app password for "Mail"
4. Use this password instead of your regular Gmail password

#### Option B: Use Less Secure Apps (Not Recommended)
1. Go to Google Account Settings > Security
2. Turn on "Less secure app access" (Note: This is being phased out)

### 2. **Environment Variables**

Add these to your `.env` file in the `backend` directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. **Alternative Email Services**

#### Outlook/Hotmail
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### Yahoo
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

#### Custom SMTP Server
```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
EMAIL_SECURE=true
```

## 🚀 **Testing Email Functionality**

1. **Start the backend server**: `npm run dev`
2. **Navigate to the Billing page** in your frontend
3. **Select an order** and click the "Send Email" button
4. **Check the console** for email sending logs
5. **Check the dealer's email** for the bill

## 📋 **Email Features**

- **Professional HTML formatting** with company branding
- **Complete bill details** including items and totals
- **Company header** with Vinayak Lakshmi branding
- **Dealer information** and order details
- **Itemized product list** with quantities and prices
- **Total amount calculation**

## 🔒 **Security Notes**

- **Never commit** your `.env` file to version control
- **Use app passwords** instead of regular passwords when possible
- **Consider using** email services like SendGrid or AWS SES for production
- **Rate limiting** is recommended for production use

## 🐛 **Troubleshooting**

### Common Issues:

1. **"Invalid login" error**
   - Check your email and password
   - Ensure 2FA is properly configured with app passwords

2. **"Connection timeout" error**
   - Check your internet connection
   - Verify firewall settings
   - Try different email service

3. **"Authentication failed" error**
   - Verify app password is correct
   - Check if less secure apps is enabled (if using that method)

### Debug Mode:

To see detailed email logs, check your backend console when sending emails.

## 📞 **Support**

If you encounter issues:
1. Check the backend console for error messages
2. Verify your email credentials
3. Test with a different email service
4. Check your email provider's security settings

---

**Note**: This email system is designed for development and small-scale production use. For large-scale production, consider using dedicated email services like SendGrid, AWS SES, or Mailgun.
