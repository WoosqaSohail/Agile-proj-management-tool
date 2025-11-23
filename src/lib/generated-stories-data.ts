// Mock data for generated user stories from document analysis

export interface GeneratedStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  points: number;
  priority: "low" | "medium" | "high" | "critical";
  confidenceScore: number;
  sourceExcerpts: SourceExcerpt[];
  rationale: RationaleItem[];
  status: "pending" | "accepted" | "rejected" | "edited";
}

export interface SourceExcerpt {
  id: string;
  text: string;
  pageNumber: number;
  section: string;
  highlightedText: string;
}

export interface RationaleItem {
  factor: string;
  score: number;
  description: string;
}

export const mockGeneratedStories: GeneratedStory[] = [
  {
    id: "gen-1",
    title: "User Authentication with Multi-Factor Authentication",
    description:
      "As a user, I want to securely authenticate using email/password with optional MFA so that my account remains protected from unauthorized access.",
    acceptanceCriteria: [
      "Users can register with email and password",
      "Password must meet security requirements (min 8 chars, special characters)",
      "Users can enable/disable MFA via SMS or authenticator app",
      "Failed login attempts are tracked and account is locked after 5 attempts",
      "Users receive email notification on successful login from new device",
    ],
    points: 13,
    priority: "high",
    confidenceScore: 0.94,
    sourceExcerpts: [
      {
        id: "excerpt-1",
        text: "The system must provide secure user authentication mechanisms. All users shall be required to create an account using a valid email address and a strong password that meets industry-standard security requirements. The authentication system must support multi-factor authentication (MFA) as an optional security layer, allowing users to receive verification codes via SMS or use time-based one-time password (TOTP) authenticator applications. To prevent brute force attacks, the system shall implement account lockout policies after multiple failed login attempts. Users should be notified via email whenever their account is accessed from an unrecognized device or location.",
        pageNumber: 3,
        section: "3.1 Security Requirements",
        highlightedText:
          "secure user authentication mechanisms... multi-factor authentication (MFA)... account lockout policies... notified via email",
      },
    ],
    rationale: [
      {
        factor: "Keyword Match",
        score: 0.95,
        description:
          'High relevance: "authentication", "MFA", "security", "password" found 12 times',
      },
      {
        factor: "Section Context",
        score: 0.92,
        description:
          'Located in "Security Requirements" section with explicit requirement language',
      },
      {
        factor: "Requirement Indicators",
        score: 0.89,
        description: 'Contains "must", "shall", "required" - strong requirement signals',
      },
      {
        factor: "Feature Completeness",
        score: 0.93,
        description: "Source provides complete feature description with acceptance criteria",
      },
    ],
    status: "pending",
  },
  {
    id: "gen-2",
    title: "Product Search with Advanced Filters",
    description:
      "As a customer, I want to search for products using keywords and apply filters (category, price range, ratings) so that I can quickly find items that match my needs.",
    acceptanceCriteria: [
      "Search bar accepts text input and returns relevant results",
      "Results update in real-time as user types (debounced)",
      "Filters available: category, price range, rating, brand",
      "Search results show product image, title, price, and rating",
      "Pagination or infinite scroll for large result sets",
      "Search history is saved for logged-in users",
    ],
    points: 8,
    priority: "high",
    confidenceScore: 0.91,
    sourceExcerpts: [
      {
        id: "excerpt-2",
        text: "The e-commerce platform must include a robust product search capability. Users should be able to enter keywords in a prominent search bar to find products. The search functionality shall provide real-time suggestions as users type. Additionally, customers must be able to refine their search results using various filters including product category, price range (with min/max inputs), customer ratings, and brand names. Search results should display essential product information including thumbnail images, product titles, current pricing, and aggregate customer ratings. The system should handle large result sets efficiently using pagination or infinite scroll mechanisms.",
        pageNumber: 7,
        section: "4.2 Product Discovery Features",
        highlightedText:
          "robust product search... real-time suggestions... filters including product category, price range... customer ratings",
      },
    ],
    rationale: [
      {
        factor: "Keyword Match",
        score: 0.93,
        description: 'High frequency: "search", "filter", "product", "category" appear 15 times',
      },
      {
        factor: "Section Context",
        score: 0.88,
        description: 'In "Product Discovery Features" - directly relevant to user story',
      },
      {
        factor: "User Goal Alignment",
        score: 0.92,
        description: "Source clearly describes user needs and expected behavior",
      },
      {
        factor: "Technical Detail",
        score: 0.87,
        description: "Includes implementation details (real-time, pagination)",
      },
    ],
    status: "pending",
  },
  {
    id: "gen-3",
    title: "Shopping Cart Management",
    description:
      "As a customer, I want to add items to my shopping cart, update quantities, and remove items so that I can manage my purchase before checkout.",
    acceptanceCriteria: [
      "Users can add products to cart from product listing or detail pages",
      "Cart icon displays current item count",
      "Users can view cart contents in a sidebar or dedicated page",
      "Quantity can be increased/decreased with validation (max stock)",
      "Items can be removed from cart individually",
      "Cart persists across sessions for logged-in users",
      "Cart shows subtotal with price calculations",
    ],
    points: 8,
    priority: "high",
    confidenceScore: 0.89,
    sourceExcerpts: [
      {
        id: "excerpt-3",
        text: "Shopping cart functionality is essential for the e-commerce experience. Users must be able to add products to their cart from any product view. The cart should maintain a running count of items, visible via a cart icon in the header. Customers shall have the ability to view their cart contents, modify quantities (respecting inventory limits), and remove items they no longer wish to purchase. For registered users, cart contents should persist across browsing sessions. The cart must display individual item prices, quantities, and calculate subtotals automatically.",
        pageNumber: 8,
        section: "4.3 Shopping Cart",
        highlightedText:
          "Shopping cart functionality... add products to their cart... modify quantities... remove items... persist across browsing sessions",
      },
    ],
    rationale: [
      {
        factor: "Keyword Match",
        score: 0.91,
        description: 'Key terms: "cart", "add", "quantity", "remove" found 10 times',
      },
      {
        factor: "Section Context",
        score: 0.95,
        description: 'Dedicated "Shopping Cart" section - high relevance',
      },
      {
        factor: "Feature Completeness",
        score: 0.85,
        description: "Covers CRUD operations comprehensively",
      },
      {
        factor: "User Perspective",
        score: 0.86,
        description: "Written from user's point of view with clear actions",
      },
    ],
    status: "pending",
  },
  {
    id: "gen-4",
    title: "Order Checkout with Payment Processing",
    description:
      "As a customer, I want to complete my purchase through a secure checkout process with multiple payment options so that I can finalize my order conveniently.",
    acceptanceCriteria: [
      "Multi-step checkout: shipping info, payment method, review order",
      "Support for credit/debit cards, PayPal, and digital wallets",
      "Address validation and auto-complete",
      "Order summary shows all items, shipping cost, tax, and total",
      "Secure payment processing with PCI compliance",
      "Order confirmation page with order number",
      "Confirmation email sent to customer",
    ],
    points: 21,
    priority: "critical",
    confidenceScore: 0.96,
    sourceExcerpts: [
      {
        id: "excerpt-4a",
        text: "The checkout process is critical to the platform's success. It must be designed as a multi-step flow that guides users through: (1) entering or selecting shipping address, (2) choosing payment method, and (3) reviewing the complete order before final submission. The system shall support major payment methods including credit cards (Visa, Mastercard, Amex), debit cards, PayPal, and popular digital wallets like Apple Pay and Google Pay. All payment processing must comply with PCI DSS standards to ensure secure handling of sensitive financial data.",
        pageNumber: 9,
        section: "4.4 Checkout and Payment",
        highlightedText:
          "checkout process... multi-step flow... shipping address... payment method... reviewing the complete order",
      },
      {
        id: "excerpt-4b",
        text: "Upon successful payment authorization, customers must receive an order confirmation page displaying a unique order number and order details. An automated confirmation email containing the order summary, tracking information (when available), and customer service contact details shall be sent to the email address associated with the order within 5 minutes of completion.",
        pageNumber: 10,
        section: "4.4 Checkout and Payment (continued)",
        highlightedText:
          "order confirmation page... unique order number... automated confirmation email... order summary",
      },
    ],
    rationale: [
      {
        factor: "Keyword Match",
        score: 0.97,
        description:
          'Critical terms: "checkout", "payment", "order", "confirmation" - 18 occurrences',
      },
      {
        factor: "Section Context",
        score: 0.96,
        description: 'Primary focus of "Checkout and Payment" section',
      },
      {
        factor: "Multiple Sources",
        score: 0.94,
        description: "Story synthesized from 2 related paragraphs for completeness",
      },
      {
        factor: "Business Critical",
        score: 0.95,
        description: "Identified as critical business functionality in document",
      },
    ],
    status: "pending",
  },
  {
    id: "gen-5",
    title: "User Profile and Preferences Management",
    description:
      "As a registered user, I want to manage my profile information and preferences so that I can keep my account up-to-date and customize my experience.",
    acceptanceCriteria: [
      "Users can edit name, email, phone number, and profile photo",
      "Email changes require verification",
      "Users can manage multiple saved addresses",
      "Notification preferences can be configured (email, SMS, push)",
      "Users can view and edit communication preferences",
      "Privacy settings allow control over data sharing",
    ],
    points: 5,
    priority: "medium",
    confidenceScore: 0.82,
    sourceExcerpts: [
      {
        id: "excerpt-5",
        text: "Registered users should have access to a profile management section where they can update their personal information such as name, contact email, phone number, and profile picture. Changes to email addresses must trigger a verification process. Users should be able to save multiple shipping addresses for convenience. The system shall provide granular notification preferences, allowing users to opt in or out of various communication channels including email newsletters, SMS alerts, and push notifications. Privacy controls should enable users to manage their data sharing preferences in compliance with privacy regulations.",
        pageNumber: 11,
        section: "4.5 User Account Management",
        highlightedText:
          "profile management... update their personal information... notification preferences... Privacy controls",
      },
    ],
    rationale: [
      {
        factor: "Keyword Match",
        score: 0.84,
        description: 'Relevant terms: "profile", "preferences", "account" - 8 matches',
      },
      {
        factor: "Section Context",
        score: 0.83,
        description: 'Located in "User Account Management" section',
      },
      {
        factor: "Feature Completeness",
        score: 0.79,
        description: "Moderate detail - covers main profile features",
      },
      {
        factor: "Lower Priority",
        score: 0.75,
        description: 'Document uses "should" rather than "must" - medium priority',
      },
    ],
    status: "pending",
  },
];

export const mockSourceDocument = {
  filename: "acme-web-requirements.pdf",
  uploadDate: new Date("2025-10-25"),
  pages: 45,
  sections: [
    { id: "1", title: "1. Introduction", pageStart: 1 },
    { id: "2", title: "2. System Overview", pageStart: 2 },
    { id: "3", title: "3. Security Requirements", pageStart: 3 },
    { id: "4", title: "4. Functional Requirements", pageStart: 5 },
    { id: "4.1", title: "4.1 User Management", pageStart: 5 },
    { id: "4.2", title: "4.2 Product Discovery Features", pageStart: 7 },
    { id: "4.3", title: "4.3 Shopping Cart", pageStart: 8 },
    { id: "4.4", title: "4.4 Checkout and Payment", pageStart: 9 },
    { id: "4.5", title: "4.5 User Account Management", pageStart: 11 },
    { id: "5", title: "5. Non-Functional Requirements", pageStart: 13 },
  ],
};
