import { fetchUserReplies } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  userModelId: string;
  accountId: string;
}

const RepliesTab = async ({ currentUserId, accountId, userModelId }: Props) => {
  const result = await fetchUserReplies(accountId);

  if (!result) return redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.length > 0 ? (
        result.map((thread: any) => (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            userModelId={userModelId}
            parentId={thread.parentId}
            content={thread.text}
            likes={thread.likes}
            author={{
              name: thread.author.name,
              image: thread.author.image,
              id: thread.author.id,
            }}
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            linkToParent={true}
          />
        ))
      ) : (
        <article className="flex w-full flex-col rounded-xl bg-dark-2 p-7">
          <div className="flex items-start justify-between">
            <div className="flex w-full flex-1 flex-row gap-4">
              <div className="w-full">
                <p className="text-center">No replies yet</p>
              </div>
            </div>
          </div>
        </article>
      )}
    </section>
  );
};

export default RepliesTab;
