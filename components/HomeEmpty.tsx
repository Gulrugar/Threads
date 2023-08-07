"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const HomeEmpty = () => {
  const router = useRouter();
  return (
    <>
      <h1 className="head-text text-center">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        <p className="no-result text-light-2">Sign in to view Threads</p>
        <div className="flex justify-center items-center">
          <Button
            className="bg-primary-500 w-40"
            onClick={() => router.push("/sign-in")}
          >
            Sign in
          </Button>
        </div>
      </section>
    </>
  );
};

export default HomeEmpty;
