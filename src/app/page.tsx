import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  await db.set("Name","Aman")
  return (<div className="flex flex-col items-center">
  <div className="text-3xl text-center font-sans">Real Time Chatapp by Aman</div>
  <Button variant={"destructive"}  size={"lg"} className="w-[6rem]">Let's explore</Button>
  </div>

  );
}
