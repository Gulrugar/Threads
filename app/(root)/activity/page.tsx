import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";
const ellipsis = require("text-ellipsis");

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const results = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        <div className="flex gap-5">
          <div className="w-full">
            {results.length > 0 ? (
              <>
                {results.map((result) => {
                  if (result.liked !== undefined) {
                    return (
                      <Link
                        key={`like-${result._id}`}
                        href={`/thread/${result.thread._id}`}
                      >
                        <article className="activity-card">
                          <Image
                            src={result.thread.author.image}
                            alt="Profile"
                            width={20}
                            height={20}
                            className="rounded-full object-cover"
                          />
                          <p className="!text-base-regular text-light-1 ml-2">
                            <span className="mr-1 text-primary-500">
                              {result.thread.author.name}
                            </span>{" "}
                            <Image
                              src="/assets/heart-filled.svg"
                              alt="reply"
                              width={24}
                              height={24}
                              className="cursor-pointer object-contain inline mr-1"
                              title="Like"
                            />
                            liked
                            <span className="ml-2 text-light-1">
                              – "{ellipsis(result.thread.text, 80)}"
                            </span>
                          </p>
                        </article>
                      </Link>
                    );
                  } else {
                    return (
                      <Link
                        key={`thread-${result._id}`}
                        href={`/thread/${result.parentId}`}
                      >
                        <article className="activity-card">
                          <Image
                            src={result.author.image}
                            alt="Profile"
                            width={20}
                            height={20}
                            className="rounded-full object-cover"
                          />
                          <p className="!text-base-regular text-light-1 ml-2">
                            <span className="mr-1 text-primary-500">
                              {result.author.name}
                            </span>{" "}
                            <Image
                              src="/assets/reply.svg"
                              alt="reply"
                              width={24}
                              height={24}
                              className="cursor-pointer object-contain inline mr-1"
                              title="Like"
                            />
                            replied
                            <span className="ml-2 text-primary-500">
                              "{ellipsis(result.text, 80)}"
                            </span>
                          </p>
                        </article>
                      </Link>
                    );
                  }
                })}
              </>
            ) : (
              <p className="!text-base-regular text-light-3">No activity yet</p>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Page;
