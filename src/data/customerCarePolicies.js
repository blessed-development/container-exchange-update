export const CUSTOMER_CARE_POLICIES = [
  {
    slug: 'container-standards',
    title: 'Conditions',
    summary: 'Understand container grades, normal used-container wear, and what to confirm before reserving a unit.',
    eyebrow: 'BUY WITH CLARITY',
    sections: [
      {
        heading: 'Condition is part of the product',
        paragraphs: [
          'Shipping containers are industrial steel equipment. A used unit may show dents, surface rust, repairs, patch paint, decals, or other evidence of its working life. Those cosmetic characteristics are not the same as a condition failure.',
          'Before an order is confirmed, Containers Exchange helps match the requested size, configuration, and condition grade to the intended use. The final order details should identify the agreed grade and product specification.',
        ],
      },
      {
        heading: 'Common condition grades',
        bullets: [
          'New / One-Trip: a newer container that has completed a single cargo journey and may still show normal handling marks.',
          'IICL: a higher used-container condition commonly chosen when appearance and cargo-service suitability matter.',
          'Cargo Worthy: a used unit that may be suitable for freight use when it holds applicable current certification. Confirm current certification requirements before export.',
          'Wind & Water Tight: a practical storage-grade option intended to keep ordinary weather out; it is not automatically certified for ocean transport.',
          'AS-IS: a lower-cost option that can show significant wear or require repair. Confirm suitability before reserving.',
        ],
      },
      {
        heading: 'Confirm before payment',
        bullets: [
          'Container size, height, door configuration, and stated grade.',
          'Whether the unit is new or used, and the practical condition expected for that grade.',
          'Quoted container price, delivery charge, tax treatment, and any order-specific services.',
          'Delivery address, access constraints, and the intended placement plan.',
        ],
      },
    ],
  },
  {
    slug: 'payments-reservations',
    title: 'Payments',
    summary: 'How a reservation request becomes a confirmed container order.',
    eyebrow: 'A CLEAR ORDER PROCESS',
    sections: [
      {
        heading: 'A reservation request is not a completed purchase',
        paragraphs: [
          'Submitting details through the Containers Exchange checkout flow sends a reservation request to our team. It does not, by itself, charge a card, reserve a specific serial-numbered unit, guarantee availability, or create a completed sales contract.',
          'This step allows us to confirm the exact container, delivery requirements, total cost, and timing with you before payment is requested.',
        ],
      },
      {
        heading: 'What we confirm with you',
        bullets: [
          'The requested size, condition grade, and configuration.',
          'Current availability for the selected market.',
          'The container amount, delivery charge, taxes, and any order-specific fees.',
          'A delivery plan that reflects the address and site-access information you provide.',
          'The payment instructions and written order terms that apply to the confirmed order.',
        ],
      },
      {
        heading: 'Before you send payment',
        paragraphs: [
          'Please review the written confirmation carefully. Ask us to correct any difference in size, grade, location, delivery address, price, or fee before authorizing payment. A payment should be made only through instructions provided by Containers Exchange after the order details have been confirmed.',
        ],
      },
    ],
  },
  {
    slug: 'returns-cancellations',
    title: 'Returns',
    summary: 'How to raise a cancellation request or report an order concern promptly.',
    eyebrow: 'ORDER SUPPORT',
    sections: [
      {
        heading: 'Before payment',
        paragraphs: [
          'If you no longer wish to proceed with a reservation request, contact Containers Exchange before authorizing payment. We will confirm in writing that the request has been withdrawn.',
        ],
      },
      {
        heading: 'After order confirmation',
        paragraphs: [
          'Containers are large, condition-specific industrial products that may require allocation, handling, transport scheduling, and delivery coordination. If you need to change or cancel a confirmed order, contact us immediately with your order details. We will review the request against the written order confirmation and any work or transport already committed to the order.',
          'Do not arrange a return, collection, chargeback, or third-party yard visit without written authorization from Containers Exchange.',
        ],
      },
      {
        heading: 'If something is not right at delivery',
        bullets: [
          'Inspect the container and its visible condition before accepting delivery where safe and practical to do so.',
          'Photograph and note a material concern on delivery documentation before the driver leaves, when possible.',
          'Contact Containers Exchange promptly with your order reference, delivery date, photographs, and a clear description of the concern.',
          'We will review reported concerns against the confirmed specification and applicable written order terms.',
        ],
      },
    ],
  },
  {
    slug: 'terms-of-sale',
    title: 'Terms',
    summary: 'The core terms that apply when a reservation becomes a confirmed order.',
    eyebrow: 'ORDER TERMS',
    sections: [
      {
        heading: 'Quotes and confirmations',
        paragraphs: [
          'Website information and reservation requests are intended to help start an order conversation. Availability, delivery options, taxes, and the total payable amount are confirmed in writing before payment is requested.',
          'A written order confirmation identifies the applicable product, price, delivery address, and any order-specific conditions. Please review it before payment.',
        ],
      },
      {
        heading: 'Delivery access and acceptance',
        paragraphs: [
          'The customer is responsible for providing accurate delivery information and a safe, suitable approach and placement area. Delivery personnel may decline or adjust an unsafe placement. Any access, timing, or placement constraint should be shared before the delivery plan is confirmed.',
          'Partner operating locations are not public showrooms. Pickup, inspection, or third-party driver access requires advance written authorization.',
        ],
      },
      {
        heading: 'Questions about an order',
        paragraphs: [
          'For a question about a reservation, written confirmation, delivery plan, or payment instruction, contact Containers Exchange using the email address shown below. We will respond using the order details available to our team.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    summary: 'How we use the information customers provide when requesting a quote or reservation.',
    eyebrow: 'YOUR INFORMATION',
    sections: [
      {
        heading: 'Information you provide',
        paragraphs: [
          'When you request a quote, make a reservation inquiry, or contact Containers Exchange, you may provide your name, email address, phone number, delivery location, container requirements, and message details.',
        ],
      },
      {
        heading: 'How we use it',
        bullets: [
          'To respond to your enquiry and prepare or discuss a container quote.',
          'To confirm availability, delivery details, and order information when you ask us to proceed.',
          'To protect the website from spam and fraudulent submissions.',
          'To maintain records connected with customer support, reservations, and confirmed orders.',
        ],
      },
      {
        heading: 'Contacting us about privacy',
        paragraphs: [
          'For a privacy question or a request relating to information you have submitted, email Containers Exchange using the contact address below and include enough detail for us to identify your request.',
        ],
      },
    ],
  },
];

export const getCustomerCarePolicy = (slug) =>
  CUSTOMER_CARE_POLICIES.find((policy) => policy.slug === slug);
