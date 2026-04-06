import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl">
          {user?.email?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.email}</h2>
          <p className="text-gray-500">Book Enthusiast</p>
        </div>
      </div>

      <div className="space-y-4">
        <section>
          <h3 className="font-semibold mb-1">Bio</h3>
          <p className="text-gray-600">
            Avid reader who loves discovering new stories and sharing reviews.
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-1">Reading Interests</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Fiction</li>
            <li>Technology</li>
            <li>Self Development</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
