import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { replies, totalRepliesCount, likes, totalLikeCount } =
    await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        <div className="flex gap-5">
          <div className="w-full">
            {replies.length > 0 && (
              <div className="text-light-2 mb-2">
                Total replies: {replies.length}
              </div>
            )}
            {replies.length > 0 ? (
              <>
                {replies.map((reply) => (
                  <Link key={reply._id} href={`/thread/${reply.parentId}`}>
                    <article className="activity-card">
                      <Image
                        src={reply.author.image}
                        alt="Profile"
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <p className="!text-base-regular text-light-1">
                        <span className="mr-1 text-primary-500">
                          {reply.author.name}
                        </span>{" "}
                        <span className="max-sm:block">
                          <Image
                            src="/assets/reply.svg"
                            alt="reply"
                            width={24}
                            height={24}
                            className="cursor-pointer object-contain inline mr-1"
                            title="Like"
                          />
                          replied
                        </span>
                      </p>
                    </article>
                  </Link>
                ))}
              </>
            ) : (
              <p className="!text-base-regular text-light-3">No replies yet</p>
            )}
          </div>
          <div className="w-full">
            {likes.length > 0 && (
              <div className="text-light-2 mb-2">
                Total likes: {likes.length}
              </div>
            )}
            {likes.length > 0 ? (
              <>
                {likes.map((like) => (
                  <Link key={like._id} href={`/thread/${like.thread._id}`}>
                    <article className="activity-card">
                      <Image
                        src={like.user.image}
                        alt="Profile"
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <p className="!text-base-regular text-light-1">
                        <span className="mr-1 text-primary-500">
                          {like.user.name}
                        </span>{" "}
                        <span className="max-sm:block">
                          <Image
                            src="/assets/heart-filled.svg"
                            alt="heart"
                            width={24}
                            height={24}
                            className="cursor-pointer object-contain inline mr-1"
                            title="Like"
                          />
                          liked
                        </span>
                      </p>
                    </article>
                  </Link>
                ))}
              </>
            ) : (
              <p className="!text-base-regular text-light-3">No likes yet</p>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Page;
