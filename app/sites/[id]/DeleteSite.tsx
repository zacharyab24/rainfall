'use client';

import {useRouter} from "next/navigation";
import PocketBase from "pocketbase";

interface Props {
    siteId: string;
}

export default function DeleteSite({ siteId }: Props) {
    const pb = new PocketBase('/api/pb');
    const router = useRouter();

    const remove = async() => {
        await pb.collection('sites').delete(`${siteId}`);

        router.push('/sites')
        router.refresh()
    }

    return (
        <button onClick={remove}>
            Delete Site
        </button>
    );
}