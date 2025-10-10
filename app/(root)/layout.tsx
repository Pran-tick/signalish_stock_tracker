import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/sign-in");

  const user = {
    name: session.user.id,
    id: session.user.id,
    email: session.user.id,
  };
  return (
    <main className="min-h-screen text-gray-400">
      {/* header */}
      <Header user={user} />
      <div className="container p-10">{children}</div>
    </main>
  );
};

export default layout;
