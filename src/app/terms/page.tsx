'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function TermsOfService() {
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
          Terms of Service
        </h1>

        <div className="prose prose-lg max-w-none text-light-text-secondary dark:text-dark-text-secondary">
          <p className="font-rajdhani text-lg">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or using Cashminder, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            2. Use License
          </h2>
          <p>
            Permission is granted to temporarily use Cashminder for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose;</li>
            <li>Attempt to decompile or reverse engineer any software contained in Cashminder;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            3. Disclaimer
          </h2>
          <p>
            The materials on Cashminder are provided on an 'as is' basis. Cashminder makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="mt-4">
            Further, Cashminder does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            4. Limitations
          </h2>
          <p>
            In no event shall Cashminder or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Cashminder, even if Cashminder or a Cashminder authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            5. Accuracy of Materials
          </h2>
          <p>
            The materials appearing on Cashminder could include technical, typographical, or photographic errors. Cashminder does not warrant that any of the materials on its website are accurate, complete, or current. Cashminder may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            6. Links
          </h2>
          <p>
            Cashminder has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Cashminder of the site. Use of any such linked website is at the user's own risk.
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            7. Modifications
          </h2>
          <p>
            Cashminder may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2 className="text-2xl font-rajdhani font-semibold mt-8 mb-4 text-light-text-primary dark:text-dark-text-primary">
            8. Governing Law
          </h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </div>
      </div>
    </div>
  );
}
