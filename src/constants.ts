export const categories = {
  user: ['Account', 'Security', 'Wallet & Rewards', 'Booking'],
};
export const guides: {
  title: string;
  url: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  featured?: boolean;
  youtubeId?: string;

  order?: number;
}[] = [
  {
    title: 'Using BRP App on my Huawei phone',
    imageUrl: '/assets/user-guides/tutorial/how-to-use-brp-app-on-huawei.webp',
    description:
      'A guide for Huawei users: Using Backride Palawan app on a Huawei device',
    url: '/user-guide/tutorial/how-to-use-backride-palawan-app-on-huawei',
    tags: ['huawei', 'install', 'gspace', 'user', 'account'],
    youtubeId: 'https://www.youtube.com/embed/UneEQxMFsJA',
    order: 3,
    featured: true,
  },
  {
    title: 'How to Create an Account?',
    description: 'Step-by-step guide to creating an account',
    imageUrl: '/assets/user-guides/tutorial/how-to-create-an-account.webp',
    url: '/user-guide/tutorial/how-to-create-an-account',
    tags: ['account', 'registration', 'user', 'create', 'register'],
    youtubeId: 'https://www.youtube.com/embed/tH5-gMDLFG0',
  },
  {
    title: 'How to Log In?',
    description: 'Logging into your account made easy',
    imageUrl: '/assets/user-guides/tutorial/how-to-log-in.webp',
    url: '/user-guide/tutorial/how-to-log-in',
    tags: ['login', 'user', 'access', 'log', 'in', 'account'],

    youtubeId: 'https://www.youtube.com/embed/JOlJeQ266V4',
  },
  {
    title: 'How to Verify My Account?',
    description: 'Verifying your account for added security',
    imageUrl: '/assets/user-guides/tutorial/how-to-verify-my-account.webp',
    url: '/user-guide/tutorial/how-to-verify-my-account',
    tags: ['verification', 'security', 'user', 'id', 'account'],
    featured: false,
    youtubeId: 'https://www.youtube.com/embed/Rm9MLy02GDw',
  },
  {
    title: 'How to Change Password?',
    description: 'Step-by-step guide to changing your password',
    imageUrl: '/assets/user-guides/tutorial/how-to-change-password.webp',
    url: '/user-guide/tutorial/how-to-change-password',
    tags: ['password', 'security', 'user', 'account'],

    youtubeId: 'https://www.youtube.com/embed/g7RPXytK8Ns',
  },
  {
    title: 'How to Edit Profile?',
    description: 'Managing your profile information',
    imageUrl: '/assets/user-guides/tutorial/how-to-edit-profile.webp',
    url: '/user-guide/tutorial/how-to-edit-profile',
    tags: ['profile', 'user', 'settings', 'update', 'edit', 'account'],
    youtubeId: 'https://www.youtube.com/embed/I-KykYY60ss',
  },
  {
    title: 'How to Top-up My BRP Wallet?',
    description: 'Adding funds to your BRP Wallet',
    imageUrl: '/assets/user-guides/tutorial/how-to-top-up-brp-wallet.webp',
    url: '/user-guide/tutorial/how-to-top-up-your-brp-wallet',
    tags: [
      'top-up',
      'wallet',
      'payment',
      'topup',
      'backride palawan',
      'points',
    ],
    order: 3,
    featured: false,
    youtubeId: 'https://www.youtube.com/embed/wGBLRxCde1M',
  },
  {
    title: 'How to Earn BRP Points',
    description: 'Introducing BRP Points - What is it and how to use it?',
    imageUrl: '/assets/user-guides/tutorial/how-to-earn-brp-points.webp',
    url: '/user-guide/tutorial/how-to-earn-brp-points',
    tags: ['booking', 'ride', 'how', 'to', 'earn', 'brp', 'points', 'rewards'],
    youtubeId: 'https://www.youtube.com/embed/kW7OOPJ-wIQ',
  },
  {
    title: 'How to Book a Driver',
    description: 'Booking a driver for your ride',
    imageUrl: '/assets/user-guides/tutorial/how-to-book-a-driver.webp',
    url: '/user-guide/tutorial/how-to-book-a-driver',
    tags: ['booking', 'ride', 'driver'],
    featured: true,
    order: 1,
    youtubeId: 'https://www.youtube.com/embed/TFUtpJ6sUhE',
  },
  {
    title: 'How to Quick Book',
    description: 'Quickly booking a ride',
    imageUrl: '/assets/user-guides/tutorial/how-to-quick-book.webp',
    url: '/user-guide/tutorial/how-to-quick-book',
    tags: [
      'quick booking',
      'ride',
      'user',
      'quick ride',
      'quickbook',
      'quick',
      'book',
      'booking',
    ],
    featured: true,
    order: 2,
    youtubeId: 'https://www.youtube.com/embed/7cZxDSXsl4s',
  },
];

export const comingSoonGuides: {
  title: string;
  url: string;
  description: string;
  imageUrl: string;
}[] = [
  {
    title: 'Booking Your Backride Palawan Ride',
    description: 'Hassle-Free Booking: A Step-by-Step Guide for New Users',
    imageUrl: '/assets/user-guides/vehicles.webp',
    url: '/user-guide/book-a-ride',
  },
];

const constants = {
  guides,
  comingSoonGuides,
  categories,
  firebaseConfig: {
    apiKey: 'AIzaSyA5zmEoFA-fh528qovZfT54f4TpSbwzgwk',
    authDomain: 'brp-733b3.firebaseapp.com',
    projectId: 'brp-733b3',
    storageBucket: 'brp-733b3.appspot.com',
    messagingSenderId: '1066057716675',
    appId: '1:1066057716675:web:a9bfcffa8519425720e376',
    measurementId: 'G-0HJNTDTLSR',
  },
  prod: false,
  apiUrl: 'https://backrideph.online/api/',
  mapboxToken:
    'pk.eyJ1IjoidmJhY2tyaWRlcGFsIiwiYSI6ImNsd3J2aG45NzAwbDMybG9rdThpbjN4eHIifQ.B2VZl_4pKS-bmCP3-pgogw',
};

export default constants;
