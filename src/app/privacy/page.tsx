'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center text-primary hover:text-primary-400 transition-colors mb-8"
      >
        <FiArrowLeft className="mr-2" />
        Back to Home
      </Link>

      <div className="bg-light-card dark:bg-dark-card rounded-2xl p-8 shadow-md border border-light-border dark:border-dark-border">
        <h1 className="text-4xl font-orbitron font-bold mb-6 text-light-text-primary dark:text-dark-text-primary">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none text-light-text-secondary dark:text-dark-text-secondary">
          <p className="font-rajdhani text-lg">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            1. Introduction
          </h2>
          <p>
            Welcome to Cashminder. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            2. The Data We Collect
          </h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong className="text-primary">Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong className="text-primary">Contact Data</strong> includes email address and telephone numbers.</li>
            <li><strong className="text-primary">Financial Data</strong> includes transaction data, spending patterns, and financial goals.</li>
            <li><strong className="text-primary">Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong className="text-primary">Usage Data</strong> includes information about how you use our website and services.</li>
          </ul>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            3. How We Use Your Data
          </h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>To register you as a new customer.</li>
            <li>To process and deliver our services to you.</li>
            <li>To manage our relationship with you.</li>
            <li>To improve our website, products/services, marketing, and customer relationships.</li>
            <li>To recommend products or services which may be of interest to you.</li>
          </ul>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            4. Data Security
          </h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            5. Your Legal Rights
          </h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            6. Contact Us
          </h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p className="mt-4">
            <strong className="text-primary">Email:</strong> shivanshpathak0001@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
