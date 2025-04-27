'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiMail, FiGithub, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Contact() {
  const contactLinks = [
    {
      name: 'Email',
      value: 'shivanshpathak0001@gmail.com',
      icon: <FiMail size={24} />,
      href: 'mailto:shivanshpathak0001@gmail.com',
      color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    },
    {
      name: 'GitHub',
      value: 'shivanshpathak01',
      icon: <FiGithub size={24} />,
      href: 'https://github.com/shivanshpathak01',
      color: 'bg-gray-700/10 text-gray-700 dark:text-gray-300 hover:bg-gray-700/20',
    },
    {
      name: 'Instagram',
      value: 'shivanshpathak._',
      icon: <FiInstagram size={24} />,
      href: 'https://instagram.com/shivanshpathak._',
      color: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
    },
    {
      name: 'Twitter',
      value: 'I_m_shivansh',
      icon: <FiTwitter size={24} />,
      href: 'https://twitter.com/I_m_shivansh',
      color: 'bg-blue-400/10 text-blue-400 hover:bg-blue-400/20',
    },
    {
      name: 'LinkedIn',
      value: 'Shivansh Pathak',
      icon: <FiLinkedin size={24} />,
      href: 'https://www.linkedin.com/in/shivansh-pathak-02a72121a/',
      color: 'bg-blue-700/10 text-blue-700 dark:text-blue-400 hover:bg-blue-700/20',
    },
  ];

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold mb-6 text-light-text-primary dark:text-dark-text-primary">
            Contact the Developer
          </h1>
          <p className="text-xl font-rajdhani text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Have questions, feedback, or just want to say hello? Feel free to reach out through any of the channels below.
          </p>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center p-6 rounded-xl ${link.color} transition-all duration-300 hover:scale-105`}
            >
              <div className="mr-4">
                {link.icon}
              </div>
              <div>
                <h3 className="text-lg font-rajdhani font-semibold text-light-text-primary dark:text-dark-text-primary">{link.name}</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">{link.value}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary font-rajdhani">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
        </div>
      </div>
    </div>
  );
}
