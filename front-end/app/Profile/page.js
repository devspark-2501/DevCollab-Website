import { getServerSession } from "next-auth";
import { connectDB } from "@/database/db";
import User from "@/database/models/user";
// import ProfilePage from "../Components/layout/ProfilePage";

export const metadata = {
  title: "Dev Collab | Profile"
};

export default async function Profile() {
  const session = await getServerSession();

  await connectDB();
  const user = await User.findOne({ email: session?.user?.email }).lean();

  if (!session || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white">
        <p className="text-gray-400">You are not logged in.</p>
      </div>
    );
  }

  // pass plain data as props — no mongoose objects to client
  return (
    <ProfilePage
      name={user.name}
      email={user.email}
      image={session.user.image}
      createdAt={user.createdAt.toString()}
      provider={user.password?.replace("oauth_", "")}
    />
  );
}