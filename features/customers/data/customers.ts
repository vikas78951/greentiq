import type {
  Customer,
  CustomerGender,
  CustomerStatus,
} from "@/features/customers/types/types"

const names = [
  "Aarav Sharma",
  "Priya Mehta",
  "Rahul Verma",
  "Ananya Patel",
  "Rohan Shah",
  "Neha Joshi",
  "Arjun Kapoor",
  "Isha Desai",
  "Vikram Singh",
  "Sneha Rao",
]

export const companies = [
  "TechNova Solutions",
  "CloudPeak Systems",
  "FinEdge Technologies",
  "BrightLabs",
  "Vertex Digital",
  "NextWave Systems",
  "BlueOrbit",
  "QuantumWorks",
  "DataSphere",
  "NexaSoft",
]

const genders: CustomerGender[] = ["male", "female"]
const statuses: CustomerStatus[] = ["active", "inactive"]

const getAvatar = (gender: CustomerGender, index: number) => {
  const genderPath = gender === "male" ? "men" : "women"

  return `https://randomuser.me/api/portraits/${genderPath}/${index}.jpg`
}

export const customers: Customer[] = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1
  const gender = genders[index % genders.length]
  const name = names[index % names.length]
  const company = companies[index % companies.length]
  const status = statuses[index % statuses.length]

  return {
    id: `cus_${String(id).padStart(3, "0")}`,
    order: index,
    name: `${name} ${id > 10 ? id : ""}`.trim(),
    gender,
    avatar: getAvatar(gender, id),
    email: `${name.toLowerCase().replace(" ", ".")}${id}@example.com`,
    phone: `+91 98${String(10000000 + id).slice(0, 8)}`,
    company,
    status,
    lastContactDate: `2026-${String((id % 8) + 1).padStart(2, "0")}-${String(
      (id % 28) + 1
    ).padStart(2, "0")}`,
    notes: `Customer notes for ${name}.`,
    createdAt: `2026-01-${String((id % 28) + 1).padStart(2, "0")}T09:00:00Z`,
    updatedAt: `2026-08-${String((id % 20) + 1).padStart(2, "0")}T10:00:00Z`,
  }
})
