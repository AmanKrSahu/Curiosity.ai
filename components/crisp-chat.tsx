"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("e51dd4a6-1759-483a-b5e7-ecc2398329b7");
    }, []);

    return null;
}