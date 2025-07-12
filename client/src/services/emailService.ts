import emailjs from '@emailjs/browser';

// EmailJS configuration - Update these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = "service_q1tlpxz"; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = "template_5c73gsy"; // Replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = "iT3Fd0BkbYNQlgxs9"; // Replace with your EmailJS public key

export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const sendConsultationEmail = async (data: EmailData): Promise<void> => {
  try {
    const templateParams = {
      to_email: 'ibrahim@contentgist.com',
      from_name: data.name,
      from_email: data.email,
      phone: data.phone || 'Not provided',
      message: data.message,
      subject: 'New Free Consultation Request - ContentGist',
      reply_to: data.email,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};