import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import RepliesTab from "@/components/shared/RepliesTab";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value={profileTabs[0].value}
            className="w-full text-light-1"
          >
            <ThreadsTab
              currentUserId={user.id}
              userModelId={JSON.stringify(userInfo._id)}
              accountId={userInfo.id}
              accountType="User"
            />
          </TabsContent>
          <TabsContent
            value={profileTabs[1].value}
            className="w-full text-light-1"
          >
            <RepliesTab
              currentUserId={user.id}
              userModelId={JSON.stringify(userInfo._id)}
              accountId={userInfo.id}
            />
          </TabsContent>
          <TabsContent
            value={profileTabs[2].value}
            className="w-full text-light-1"
          >
            <article className="flex w-full flex-col rounded-xl bg-dark-2 p-7">
              <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                  <div className="w-full">
                    <p className="text-center">Not yet implemented</p>
                  </div>
                </div>
              </div>
            </article>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
