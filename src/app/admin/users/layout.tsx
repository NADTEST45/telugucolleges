import { getCollegesMerged } from "@/lib/colleges-merged";
import { CollegeOptionsProvider } from "./CollegeOptionsProvider";

export default async function AdminUsersLayout({ children }: { children: React.ReactNode }) {
  const colleges = (await getCollegesMerged())
    .map(college => ({ code: college.code, name: college.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return <CollegeOptionsProvider value={colleges}>{children}</CollegeOptionsProvider>;
}
