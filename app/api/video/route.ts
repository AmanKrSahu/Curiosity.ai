import Replicate from "replicate";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

let replicate: Replicate;

try {
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    
    if (!replicateToken) {
        throw new Error("Replicate API token is missing");
    }

    replicate = new Replicate({
        auth: replicateToken,
    });
} 
catch (error) {
    console.error("Error setting up Replicate:", error);
}

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired.", {status: 403});
        }

        const response = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt
                }
            }
        );

        if(!isPro){
            await increaseApiLimit();
        }

        return NextResponse.json(response);
    } 
    catch (error) {
        console.error("[VIDEO_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}