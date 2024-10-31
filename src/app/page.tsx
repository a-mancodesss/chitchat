import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  await db.set("Name","Aman")
  return (<div className="flex flex-col items-center">
  <div className="text-3xl text-center font-sans">Real Time Chatapp by Aman</div>
  <Button variant={"destructive"}  size={"lg"} className="w-[6rem]">
    <Link href="/login">
    Let's explore
    </Link>
    </Button>
  </div>

  );
}
