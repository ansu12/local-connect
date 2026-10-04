export interface LocalBusiness {
  id: string;
  name: string;
  category: string;
  rating: number;
  address: string;
}

// Mock data source for LocalConnect
export async function fetchBusinesses(): Promise<LocalBusiness[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      id: "1",
      name: "Acme Plumbing",
      category: "Plumbing",
      rating: 4.8,
      address: "123 Main St, Springfield",
    },
    {
      id: "2",
      name: "Springfield Electric",
      category: "Electrician",
      rating: 4.6,
      address: "456 Oak Ave, Springfield",
    },
    {
      id: "3",
      name: "City Landscaping",
      category: "Landscaping",
      rating: 4.9,
      address: "789 Pine Rd, Springfield",
    }
  ];
}

export async function fetchBusinessById(id: string): Promise<LocalBusiness | null> {
  const businesses = await fetchBusinesses();
  return businesses.find((b) => b.id === id) || null;
}
