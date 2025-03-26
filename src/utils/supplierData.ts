import { SupplierData } from '@/components/supplier/SupplierProfile';

// Sample supplier data
const suppliers: Record<string, SupplierData> = {
  'shimano': {
    id: 'shimano',
    name: 'Shimano Inc, Japan',
    shortDescription: 'OEM Component Producer',
    type: 'OEM Component Producer',
    logoUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Shimano-Logo-1990.png',
    rating: 4.5,
    information: 'Shimano Inc. is a Japanese multinational manufacturer of cycling components, fishing tackle, and rowing equipment. Shimano produces components for road, mountain, and hybrid bikes, including drivetrains, brakes, wheels, pedals, and cycling shoes and clothing.\n\nShimano\'s component designs are known worldwide and used by professional cyclists and everyday riders alike.',
    socialMedia: [
      { platform: 'Instagram', handle: '@shimanoofficial' },
      { platform: 'Facebook', handle: 'Shimano' },
      { platform: 'Twitter', handle: '@ShimanoEurope' },
      { platform: 'YouTube', handle: 'Shimano' }
    ],
    certifications: [
      'ISO 9001:2015 Quality Management',
      'ISO 14001:2015 Environmental Management',
      'OHSAS 18001 Health and Safety Management',
      'UCI Approved Equipment Manufacturer'
    ],
    contact: {
      address: '3-77 Oimatsu-cho, Sakai-ku, Sakai City, Osaka, Japan',
      phone: '+81-72-223-3957',
      email: 'info@shimano.com',
      website: 'www.shimano.com'
    },
    gallery: [
      {
        id: 1,
        url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//shimano.avif',
        alt: 'Shimano Workshop'
      },
      {
        id: 2,
        url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//vulz%20factory%20.jpg',
        alt: 'Vulz Factory'
      },
      {
        id: 3,
        url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//vulz33.jpeg',
        alt: 'Vulz Facility'
      },
      {
        id: 4,
        url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//vulz22.jpeg',
        alt: 'Vulz Equipment'
      }
    ],
    products: [
      {
        id: 'dt-1',
        name: 'Shimano 105 Front Calliper',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20front%20calliper.jpeg',
        price: 55,
        manufacturer: 'Shimano',
        category: 'drivetrain'
      },
      {
        id: 'dt-2',
        name: 'Shimano 105 Rear Hub',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20hub.jpeg',
        price: 89,
        manufacturer: 'Shimano',
        category: 'wheels'
      },
      {
        id: 'dt-3',
        name: 'Shimano XTR Cassette',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//cassette.jpeg',
        price: 112,
        manufacturer: 'Shimano',
        category: 'drivetrain'
      },
      {
        id: 'dt-4',
        name: 'Shimano CUES Road Bike Lever',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//CUES%20lever.jpeg',
        price: 78,
        manufacturer: 'Shimano',
        category: 'braking'
      },
      {
        id: 'dt-5',
        name: 'Shimano Dura-Ace Calliper',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Dura-ace%20calliper.jpeg',
        price: 195,
        manufacturer: 'Shimano',
        category: 'braking'
      },
      {
        id: 'dt-6',
        name: 'Shimano GRX Pedals',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//GRX%20Pedals.jpeg',
        price: 95,
        manufacturer: 'Shimano',
        category: 'pedals'
      },
      {
        id: 'dt-7',
        name: 'Shimano XTR Derailleur',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//xrt%20di2%20deralier.jpeg',
        price: 210,
        manufacturer: 'Shimano',
        category: 'drivetrain'
      },
      {
        id: 'dt-8',
        name: 'Shimano XTR Lever',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//xtra%20lever.jpeg',
        price: 145,
        manufacturer: 'Shimano',
        category: 'braking'
      },
      {
        id: 'ebc-1',
        name: 'Shimano eBike Display',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//sim%20disp.jpeg',
        price: 182,
        manufacturer: 'Shimano',
        category: 'ebike'
      },
      {
        id: 'ebc-2',
        name: 'Shimano Steps 504Wh Battery',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//504wh.jpeg',
        price: 435,
        manufacturer: 'Shimano',
        category: 'ebike'
      },
      {
        id: 'ebc-3',
        name: 'Shimano 630Wh Battery',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//630wh.jpeg',
        price: 520,
        manufacturer: 'Shimano',
        category: 'ebike'
      },
      {
        id: 'ebc-6',
        name: 'Shimano EP8 Motor',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//EP8.jpeg',
        price: 610,
        manufacturer: 'Shimano',
        category: 'ebike'
      }
    ],
    categories: [
      {
        id: 'all',
        name: 'All Products'
      },
      {
        id: 'drivetrain',
        name: 'Drivetrain'
      },
      {
        id: 'braking',
        name: 'Braking Systems'
      },
      {
        id: 'wheels',
        name: 'Wheels & Hubs'
      },
      {
        id: 'pedals',
        name: 'Pedals'
      },
      {
        id: 'ebike',
        name: 'eBike Components'
      }
    ]
  },
  'sram': {
    id: 'sram',
    name: 'SRAM Corporation, USA',
    shortDescription: 'Premium Component Manufacturer',
    type: 'Premium Component Manufacturer',
    logoUrl: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//Shimano-Logo-1990.png',
    rating: 4.7,
    information: 'SRAM LLC is an American manufacturer of bicycle components founded in 1987 in Chicago, Illinois. SRAM is an acronym comprising the names of its founders, Scott, Ray, and Sam. The company pioneered the twist shifter, and has expanded through acquisition of many component manufacturers including RockShox, Avid, Truvativ, Zipp, and Quarq.',
    socialMedia: [
      { platform: 'Instagram', handle: '@sramofficial' },
      { platform: 'Facebook', handle: 'SRAM' },
      { platform: 'Twitter', handle: '@SRAMRoad' },
      { platform: 'YouTube', handle: 'SRAMtech' }
    ],
    certifications: [
      'ISO 9001:2015 Quality Management',
      'ISO 14001:2015 Environmental Management',
      'B Corp Certified',
      'UCI Approved Equipment Manufacturer'
    ],
    contact: {
      address: '1000 W Fulton Market, Chicago, IL 60607, USA',
      phone: '+1-312-664-8800',
      email: 'info@sram.com',
      website: 'www.sram.com'
    },
    gallery: [
      {
        id: 1,
        url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//shimano.avif',
        alt: 'SRAM Headquarters'
      },
      {
        id: 2,
        url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//vulz%20factory%20.jpg',
        alt: 'SRAM Factory'
      },
      {
        id: 3,
        url: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//vulz33.jpeg',
        alt: 'SRAM Manufacturing'
      }
    ],
    products: [
      {
        id: 'sram-1',
        name: 'SRAM RED eTap AXS Rear Derailleur',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20front%20calliper.jpeg',
        price: 710,
        manufacturer: 'SRAM',
        category: 'drivetrain'
      },
      {
        id: 'sram-2',
        name: 'SRAM Force AXS Crankset',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//105%20hub.jpeg',
        price: 420,
        manufacturer: 'SRAM',
        category: 'drivetrain'
      },
      {
        id: 'sram-3',
        name: 'RockShox SID Ultimate Fork',
        image: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/images//cassette.jpeg',
        price: 899,
        manufacturer: 'SRAM',
        category: 'suspension'
      }
    ],
    categories: [
      {
        id: 'all',
        name: 'All Products'
      },
      {
        id: 'drivetrain',
        name: 'Drivetrain'
      },
      {
        id: 'braking',
        name: 'Braking Systems'
      },
      {
        id: 'suspension',
        name: 'Suspension'
      }
    ]
  },
  'brakco': {
    id: 'brakco',
    name: 'BRAKCO',
    shortDescription: 'Brake System Specialist',
    type: 'Brake Components Manufacturer',
    logoUrl: 'https://www.brakco.com/images/new_logo.png',
    rating: 4.3,
    information: 'BRAKCO is a specialized manufacturer focused on high-quality braking systems for bicycles. Based in Taiwan, BRAKCO has been designing and manufacturing reliable braking products since 1997. Their extensive product line includes disc brakes, V-brakes, brake pads, and various brake accessories for all types of cycling applications, from mountain biking to road cycling and commuting.',
    socialMedia: [
      { platform: 'Instagram', handle: '@brakco_official' },
      { platform: 'Facebook', handle: 'BRAKCO' },
      { platform: 'Twitter', handle: '@BRAKCOglobal' }
    ],
    certifications: [
      'ISO 9001:2015 Quality Management',
      'ISO 14001:2015 Environmental Management',
      'CE Certified Products'
    ],
    contact: {
      address: 'No.85, Ln. 2, Henglin Rd., Houli Dist., Taichung City, Taiwan',
      phone: '+886-4-2539-1223',
      email: 'info@brakco.com',
      website: 'www.brakco.com'
    },
    gallery: [
      {
        id: 1,
        url: 'https://www.brakco.com/_i/assets/upload/product/9c36de5115cb7df64a4ed53a363d73b7.jpg',
        alt: 'BRAKCO V-Brake'
      },
      {
        id: 2,
        url: 'https://www.brakco.com/_i/assets/upload/product/3ee61a9c9cc6dadfb0c7dd36afed8b1f.jpg',
        alt: 'BRAKCO Hydraulic Disc Brake'
      },
      {
        id: 3,
        url: 'https://www.brakco.com/_i/assets/upload/product/00b99a17aae8f7d1c1bd97b5c4da39a5.jpg',
        alt: 'BRAKCO Brake Pads'
      },
      {
        id: 4,
        url: 'https://www.brakco.com/_i/assets/upload/product/4a27ddde1d2a40677eef7c93d3f5ac37.jpg',
        alt: 'BRAKCO Mountain Bike Brakes'
      }
    ],
    products: [
      {
        id: 'brakco-1',
        name: 'BRAKCO BKR-15 V-Brake Set',
        image: 'https://www.brakco.com/_i/assets/upload/product/9c36de5115cb7df64a4ed53a363d73b7.jpg',
        price: 85,
        manufacturer: 'BRAKCO',
        category: 'rim-brake'
      },
      {
        id: 'brakco-2',
        name: 'BRAKCO DX4 Hydraulic Disc Brake',
        image: 'https://www.brakco.com/_i/assets/upload/product/3ee61a9c9cc6dadfb0c7dd36afed8b1f.jpg',
        price: 175,
        manufacturer: 'BRAKCO',
        category: 'disc-brake'
      },
      {
        id: 'brakco-3',
        name: 'BRAKCO BPR-05 Carbon Rim Brake Pads',
        image: 'https://www.brakco.com/_i/assets/upload/product/00b99a17aae8f7d1c1bd97b5c4da39a5.jpg',
        price: 35,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      },
      {
        id: 'brakco-4',
        name: 'BRAKCO LR-03 Road Brake Levers',
        image: 'https://www.brakco.com/_i/assets/upload/product/1b5a0ac2ee0d10c2bb0d12a2e75459dd.jpg',
        price: 60,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      },
      {
        id: 'brakco-5',
        name: 'BRAKCO DCR-1001 Mechanical Disc Brake',
        image: 'https://www.brakco.com/_i/assets/upload/product/3ee61a9c9cc6dadfb0c7dd36afed8b1f.jpg',
        price: 120,
        manufacturer: 'BRAKCO',
        category: 'disc-brake'
      },
      {
        id: 'brakco-6',
        name: 'BRAKCO CBSLC-01 Cable Housing Set',
        image: 'https://www.brakco.com/_i/assets/upload/product/9a78e6e28de63fb1d7e7e5f94e8d2cc9.jpg',
        price: 28,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      },
      {
        id: 'brakco-7',
        name: 'BRAKCO DCR-2001 MTB Disc Brake Set',
        image: 'https://www.brakco.com/_i/assets/upload/product/4a27ddde1d2a40677eef7c93d3f5ac37.jpg',
        price: 145,
        manufacturer: 'BRAKCO',
        category: 'disc-brake'
      },
      {
        id: 'brakco-8',
        name: 'BRAKCO BG-01 Brake Grease',
        image: 'https://www.brakco.com/_i/assets/upload/product/a72d8a8d9f1c9c9cf2abe0fd39783ad0.jpg',
        price: 18,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      },
      {
        id: 'brakco-9',
        name: 'BRAKCO BR-04 MTB V-Brake',
        image: 'https://www.brakco.com/_i/assets/upload/product/dfd3e6a80cd0a12d382cd9a8b8dc1161.jpg',
        price: 72,
        manufacturer: 'BRAKCO',
        category: 'rim-brake'
      },
      {
        id: 'brakco-10',
        name: 'BRAKCO LM-01 MTB Brake Levers',
        image: 'https://www.brakco.com/_i/assets/upload/product/9d71f60a7ea3e155f18a0b7c8f09f9e5.jpg',
        price: 45,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      }
    ],
    categories: [
      {
        id: 'all',
        name: 'All Products'
      },
      {
        id: 'rim-brake',
        name: 'Rim Brakes'
      },
      {
        id: 'disc-brake',
        name: 'Disc Brakes'
      },
      {
        id: 'brake-fitting',
        name: 'Brake Fittings'
      }
    ]
  }
};

/**
 * Retrieves supplier data based on the supplier ID
 * @param id The ID of the supplier
 * @returns The supplier data or undefined if not found
 */
export const getSupplierData = (id: string): SupplierData | undefined => {
  return suppliers[id.toLowerCase()];
};

/**
 * Gets a list of all available suppliers
 * @returns Array of supplier data
 */
export const getAllSuppliers = (): SupplierData[] => {
  return Object.values(suppliers);
};

/**
 * Adds a new supplier to the collection
 * @param supplier The supplier data to add
 */
export const addSupplier = (supplier: SupplierData): void => {
  suppliers[supplier.id.toLowerCase()] = supplier;
};

