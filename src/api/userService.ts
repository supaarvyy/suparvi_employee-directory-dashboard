import { API_BASE_URL, MOCK_API_DELAY_MS } from "../constants/config";
import {
  Employee,
  EmployeeStatus,
  FetchEmployeesResponse,
} from "../types/employee";

// In-memory status store to persist status updates during session
const statusOverrides: Record<number, EmployeeStatus> = {};

// Cache full users list to allow instant client-side case-insensitive searching across all pages
let cachedAllUsers: Employee[] = [];

async function getAllUsers(): Promise<Employee[]> {
  if (cachedAllUsers.length > 0) return cachedAllUsers;

  // DummyJSON allows fetching up to limit=100 (which covers all mock users)
  const response = await fetch(`${API_BASE_URL}?limit=100`);
  if (!response.ok) {
    throw new Error("Failed to fetch employees from API");
  }

  const data = await response.json();

  cachedAllUsers = (data.users || []).map((user: any, index: number) => {
    const assignedStatus: EmployeeStatus =
      statusOverrides[user.id] ||
      (["Active", "Inactive", "On Leave"][index % 3] as EmployeeStatus);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      image: user.image || "",
      company: {
        name: user.company?.name || "Independent",
        title: user.company?.title || "Staff",
        department: user.company?.department || "General",
      },
      address: {
        address: user.address?.address || "123 Main St",
        city: user.address?.city || "City",
        state: user.address?.state || "State",
        postalCode: user.address?.postalCode || "00000",
      },
      status: assignedStatus,
    };
  });

  return cachedAllUsers;
}

export async function fetchEmployees(
  page: number,
  limit: number,
  searchQuery: string
): Promise<FetchEmployeesResponse> {
  // Small artificial delay for smooth UX
  await new Promise((resolve) => setTimeout(resolve, 200));

  const allUsers = await getAllUsers();
  const query = searchQuery.trim().toLowerCase();

  // Filter case-insensitively by first name, last name, or email
  const filteredUsers = allUsers.filter((emp) => {
    if (!query) return true;
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return (
      fullName.includes(query) ||
      emp.firstName.toLowerCase().includes(query) ||
      emp.lastName.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
  });

  // Paginate locally
  const startIndex = (page - 1) * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

  return {
    users: paginatedUsers,
    total: filteredUsers.length,
  };
}

export async function fetchEmployeeById(id: number): Promise<Employee> {
  const allUsers = await getAllUsers();
  const found = allUsers.find((u) => u.id === id);
  if (found) return found;

  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee details");
  }
  const user = await response.json();
  const assignedStatus: EmployeeStatus = statusOverrides[user.id] || "Active";

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    username: user.username,
    image: user.image || "",
    company: {
      name: user.company?.name || "Independent",
      title: user.company?.title || "Staff",
      department: user.company?.department || "General",
    },
    address: {
      address: user.address?.address || "123 Main St",
      city: user.address?.city || "City",
      state: user.address?.state || "State",
      postalCode: user.address?.postalCode || "00000",
    },
    status: assignedStatus,
  };
}

export async function updateEmployeeStatus(
  id: number,
  status: EmployeeStatus
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY_MS));
  statusOverrides[id] = status;
  if (cachedAllUsers.length > 0) {
    cachedAllUsers = cachedAllUsers.map((emp) =>
      emp.id === id ? { ...emp, status } : emp
    );
  }
}

export interface FeedbackPayload {
  employeeId: number;
  rating: number;
  comments: string;
}

export async function submitFeedback(
  payload: FeedbackPayload
): Promise<{ success: boolean }> {
  // Simulating a mock network API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Feedback submitted successfully:", payload);
      resolve({ success: true });
    }, 600);
  });
}
