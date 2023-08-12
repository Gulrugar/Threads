import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.action";

interface Props {
  currentUserId: string;
  userModelId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({
  currentUserId,
  accountId,
  userModelId,
  accountType,
}: Props) => {
  let result: any;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) return redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.length > 0 ? (
        result.threads.map((thread: any) => (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            userModelId={userModelId}
            parentId={thread.parentId}
            content={thread.text}
            likes={thread.likes}
            author={
              accountType === "User"
                ? {
                    name: result.name,
                    image: result.image,
                    id: result.id,
                  }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            }
            community={
              accountType == "Community"
                ? { name: result.name, id: result.id, image: result.image }
                : thread.community
            }
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        ))
      ) : (
        <article className="flex w-full flex-col rounded-xl bg-dark-2 p-7">
          <div className="flex items-start justify-between">
            <div className="flex w-full flex-1 flex-row gap-4">
              <div className="w-full">
                <p className="text-center">No threads yet</p>
              </div>
            </div>
          </div>
        </article>
      )}
    </section>
  );
};

export default ThreadsTab;
