export interface Job {
  id: string;
  title: string;
  company: string;
  country: string;
  gender: string;
  salary: string;
  category: string;
  image: string;
  description?: string;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Construction Engineer",
    company: "Al Hamad Construction",
    country: "Qatar",
    gender: "Male",
    salary: "$3,500 - $4,500/month",
    category: "Construction",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1170&auto=format&fit=crop",
    description:
      "Lead construction projects for commercial buildings and infrastructure development.",
  },
  {
    id: "2",
    title: "Registered Nurse",
    company: "St. Mary's Hospital",
    country: "United Kingdom",
    gender: "Any",
    salary: "$3,800 - $5,200/month",
    category: "Healthcare",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1780&auto=format&fit=crop",
    description:
      "Providing direct patient care in a state-of-the-art medical facility.",
  },
  {
    id: "3",
    title: "Software Engineer",
    company: "TechVision",
    country: "Singapore",
    gender: "Any",
    salary: "$4,500 - $7,000/month",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1573495612937-f978cc14e4b9?q=80&w=1169&auto=format&fit=crop",
    description:
      "Develop cutting-edge applications for clients across various industries.",
  },
  {
    id: "4",
    title: "Hotel Management Staff",
    company: "Luxury Resorts International",
    country: "United Arab Emirates",
    gender: "Any",
    salary: "$2,800 - $3,500/month",
    category: "Hospitality",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1170&auto=format&fit=crop",
    description:
      "Manage day-to-day operations at a 5-star hotel with exceptional service standards.",
  },
  {
    id: "5",
    title: "Mechanical Engineer",
    company: "SaeedTech Engineering",
    country: "Saudi Arabia",
    gender: "Male",
    salary: "$4,000 - $6,000/month",
    category: "Engineering",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop",
    description:
      "Design and optimize mechanical systems for industrial applications.",
  },
  {
    id: "6",
    title: "Healthcare Assistant",
    company: "MediCare Solutions",
    country: "Canada",
    gender: "Any",
    salary: "$2,500 - $3,200/month",
    category: "Healthcare",
    image:
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?q=80&w=1527&auto=format&fit=crop",
    description:
      "Provide essential support to medical staff and patients in a healthcare setting.",
  },
  {
    id: "7",
    title: "Construction Supervisor",
    company: "BuildWell International",
    country: "Australia",
    gender: "Male",
    salary: "$5,000 - $6,500/month",
    category: "Construction",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1470&auto=format&fit=crop",
    description:
      "Oversee construction projects and coordinate teams for timely delivery.",
  },
  {
    id: "8",
    title: "Frontend Developer",
    company: "Innovative Solutions",
    country: "Germany",
    gender: "Any",
    salary: "$4,200 - $5,800/month",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1780&auto=format&fit=crop",
    description:
      "Create responsive web applications with modern JavaScript frameworks.",
  },
  {
    id: "9",
    title: "Hotel Receptionist",
    company: "Grand Plaza Hotels",
    country: "Malaysia",
    gender: "Female",
    salary: "$1,800 - $2,300/month",
    category: "Hospitality",
    image:
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1471&auto=format&fit=crop",
    description:
      "Welcome guests and ensure a pleasant stay at our international hotel chain.",
  },
];
