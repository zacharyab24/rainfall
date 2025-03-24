'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PocketBase from "pocketbase";

export default function CreateSite() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const router = useRouter();
    const pb = new PocketBase('/api/pb');

    const create = async(e:any) => {
        e.preventDefault();

        const record = await pb.collection('sites').create({
            name: name,
            location: location,
        })

        setName('');
        setLocation('');

        router.push("/sites");
    }

    return (
        <form onSubmit={create}>
            <h3>Create a new Site</h3>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <textarea
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <button type="submit">
                Create site
            </button>
        </form>
    );
}