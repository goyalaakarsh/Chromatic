"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";

import { v2 as cloudinary } from 'cloudinary'
const populateUser = async (query: unknown) => {
    if (query && typeof query === 'object' && 'populate' in query) {
        return (query as { populate: Function }).populate({
            path: 'author',
            model: User,
            select: '_id firstName lastName clerkId',
        });
    } else {
        throw new Error('Query does not support populate');
    }
};


// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
    try {
        await connectToDatabase();

        const author = await User.findById(userId);

        if (!author) {
            throw new Error("User not found");
        }

        const newImage = await Image.create({
            ...image,
            author: author._id,
        })

        revalidatePath(path);

        return JSON.parse(JSON.stringify(newImage));
    } catch (error) {
        handleError(error)
    }
}

// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
    try {
        await connectToDatabase();

        const imageToUpdate = await Image.findById(image._id);

        if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
            throw new Error("Unauthorized or image not found");
        }

        const updatedImage = await Image.findByIdAndUpdate(
            imageToUpdate._id,
            image,
            { new: true }
        )

        revalidatePath(path);

        return JSON.parse(JSON.stringify(updatedImage));
    } catch (error) {
        handleError(error)
    }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
    try {
        await connectToDatabase();

        await Image.findByIdAndDelete(imageId);
    } catch (error) {
        handleError(error)
    } finally {
        redirect('/')
    }
}

// GET IMAGE
export async function getImageById(imageId: string) {
    try {
        await connectToDatabase();

        const image = await populateUser(Image.findById(imageId));

        if (!image) {
          throw new Error("Image not found");
        }
        
        return JSON.parse(JSON.stringify(image));
        
    } catch (error) {
        handleError(error)
    }
}

// GET IMAGES
export async function getAllImages({
    limit = 9,
    page = 1,
    searchQuery = '',
}: {
    limit?: number;
    page: number;
    searchQuery?: string;
}) {
    try {
        await connectToDatabase();

        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });

        // Build the expression for Cloudinary search
        let expression = 'folder=imaginify';
        if (searchQuery) {
            expression += ` AND ${searchQuery}`;
        }

        // Execute Cloudinary search and get resources
        const { resources } = await cloudinary.search.expression(expression).execute();
        const resourceIds = resources.map((resource: { public_id: string }) => resource.public_id);

        // Build query for database search
        let query: any = {}; // Declare query as any to be flexible

        if (searchQuery) {
            query = {
                publicId: {
                    $in: resourceIds,
                },
            };
        }

        // Apply pagination (skip, limit)
        const skipAmount = (Number(page) - 1) * limit;

        // Construct the query and apply populate, sort, skip, limit
        const queryWithPagination = Image.find(query)
            .sort({ updatedAt: -1 })
            .skip(skipAmount)
            .limit(limit);

        // Apply populateUser on the query to handle population
        const images = await populateUser(queryWithPagination);

        // Calculate total images for pagination
        const totalImages = await Image.find(query).countDocuments();
        const savedImages = await Image.find().countDocuments();

        return {
            data: JSON.parse(JSON.stringify(images)),
            totalPage: Math.ceil(totalImages / limit),
            savedImages,
        };
    } catch (error) {
        handleError(error);
    }
}


// GET IMAGES BY USER
export async function getUserImages({
    limit = 9,
    page = 1,
    userId,
}: {
    limit?: number;
    page: number;
    userId: string;
}) {
    try {
        await connectToDatabase();

        const skipAmount = (Number(page) - 1) * limit;

        // Apply the query methods (sort, skip, limit) on the query first
        const query = Image.find({ author: userId })
            .sort({ updatedAt: -1 })
            .skip(skipAmount)
            .limit(limit);

        // Pass the query to populateUser to apply the populate
        const images = await populateUser(query);

        // Get the total count of images
        const totalImages = await Image.find({ author: userId }).countDocuments();

        // Return the response
        return {
            data: JSON.parse(JSON.stringify(images)),
            totalPages: Math.ceil(totalImages / limit),
        };
    } catch (error) {
        handleError(error);
    }
}