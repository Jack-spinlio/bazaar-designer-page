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
    logoUrl: 'https://www.brakco.com/images/en/logo.svg',
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
        url: 'https://www.brakco.com/images/products/brake_shoe.jpg',
        alt: 'BRAKCO Brake Shoe'
      },
      {
        id: 2,
        url: 'https://www.brakco.com/images/products/brake_pad.jpg',
        alt: 'BRAKCO Brake Pad'
      },
      {
        id: 3,
        url: 'https://www.brakco.com/images/products/standard_rotor.jpg',
        alt: 'BRAKCO Standard Rotor'
      },
      {
        id: 4,
        url: 'https://www.brakco.com/images/products/sport_rotor.jpg',
        alt: 'BRAKCO Sport Rotor'
      }
    ],
    products: [
      {
        id: 'brakco-1',
        name: 'BRAKCO Brake Shoe',
        image: 'https://www.brakco.com/images/products/brake_shoe.jpg',
        price: 25,
        manufacturer: 'BRAKCO',
        category: 'rim-brake'
      },
      {
        id: 'brakco-2',
        name: 'BRAKCO Brake Pad',
        image: 'https://www.brakco.com/images/products/brake_pad.jpg',
        price: 35,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      },
      {
        id: 'brakco-3',
        name: 'BRAKCO Standard Rotor',
        image: 'https://www.brakco.com/images/products/standard_rotor.jpg',
        price: 45,
        manufacturer: 'BRAKCO',
        category: 'disc-brake'
      },
      {
        id: 'brakco-4',
        name: 'BRAKCO Sport Rotor',
        image: 'https://www.brakco.com/images/products/sport_rotor.jpg',
        price: 60,
        manufacturer: 'BRAKCO',
        category: 'disc-brake'
      },
      {
        id: 'brakco-5',
        name: 'BRAKCO Centerlock Rotor',
        image: 'https://www.brakco.com/images/products/centerlock_rotor.jpg',
        price: 75,
        manufacturer: 'BRAKCO',
        category: 'disc-brake'
      },
      {
        id: 'brakco-6',
        name: 'BRAKCO CMA Adapter',
        image: 'https://www.brakco.com/images/products/cma_adapter.jpg',
        price: 28,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      },
      {
        id: 'brakco-7',
        name: 'BRAKCO Centerlock Adapter',
        image: 'https://www.brakco.com/images/products/centerlock_adapter.jpg',
        price: 32,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      },
      {
        id: 'brakco-8',
        name: 'BRAKCO Hydraulic Hose',
        image: 'https://www.brakco.com/images/products/hydraulic_hose.jpg',
        price: 18,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      },
      {
        id: 'brakco-9',
        name: 'BRAKCO Hydraulic Parts',
        image: 'https://www.brakco.com/images/products/hydraulic_parts.jpg',
        price: 38,
        manufacturer: 'BRAKCO',
        category: 'brake-fitting'
      },
      {
        id: 'brakco-10',
        name: 'BRAKCO Mechanical Parts',
        image: 'https://www.brakco.com/images/products/mechanical_parts.jpg',
        price: 29,
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
  return suppliers[id?.toLowerCase()];
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
