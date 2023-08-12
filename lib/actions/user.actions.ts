"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { FilterQuery, SortOrder } from "mongoose";
import Like from "../models/like.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      // upsert means both updating and inserting
      { upsert: true }
    );

    if (path === "/profile/edit") {
      // revalidatePath allows you to revalidate data associated with a specific path. This is useful for scenarios where you want to update your cached data without waiting for a revalidation period to expire.
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
      strictPopulate: false,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: [
          {
            path: "community",
            model: Community,
            select: "_id id name image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "name image id",
            },
          },
          {
            path: "likes",
            model: Like,
            select: "_id user thread liked",
          },
        ],
      })
      .exec();

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

export async function fetchUserReplies(userId: string) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId });

    const userThreads = await Thread.find({ author: user._id });

    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: user._id },
    })
      .populate({ path: "author", model: User })
      .populate({ path: "community", model: Community })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      })
      .populate({ path: "likes", model: Like, select: "_id user thread liked" })
      .exec();

    const totalRepliesCount = await Thread.countDocuments({
      _id: { $in: childThreadIds },
      author: { $ne: user._id },
    });

    return { replies, totalRepliesCount };
  } catch (error: any) {
    throw new Error(`Failed to fetch user replies: ${error.message}`);
  }
}

interface FetchUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchUsersParams) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    const likes = await Like.find({
      thread: { $in: userThreads },
      user: { $ne: userId },
    })
      .populate({
        path: "user",
        model: User,
        select: "name image _id",
      })
      .populate({
        path: "thread",
        model: Thread,
        select: "text parentId",
        populate: {
          path: "author",
          model: User,
          select: "name image",
        },
      });

    // Combine the replies and likes arrays
    const combinedResults = replies.concat(likes);

    // Sort the combined array by createdAt in descending order
    combinedResults.sort((a, b) => b.createdAt - a.createdAt);

    return combinedResults.slice(0, 50);
  } catch (error: any) {
    throw new Error(`Failed to fetch activity: ${error.message}`);
  }
}
