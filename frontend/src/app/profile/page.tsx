import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline mb-8">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Feature Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <UserCog className="w-16 h-16 mb-4"/>
          <p className="text-lg">The user profile page is currently under construction.</p>
          <p>Soon you'll be able to edit your profile, see your followers, and more!</p>
        </CardContent>
      </Card>
    </div>
  );
}
