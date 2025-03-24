'use client';

import {useRouter} from "next/navigation";

interface Props {
    siteId: string;
}

export default function DeleteSite({ siteId }: Props) {
    const router = useRouter();

    const remove = async() => {
        await fetch(`http://127.0.0.1:8090/api/collections/sites/records/${siteId}`, {
            method: 'DELETE',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                'Content-Type': 'application/json',
            },
        });

        router.push('/sites')
        router.refresh()
    }

    return (
        <button onClick={remove}>
            Delete Site
        </button>
    );
}