'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateSite() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const router = useRouter();

    const create = async(e:any) => {
        e.preventDefault();

        await fetch('http://127.0.0.1:8090/api/collections/sites/records', {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                location,
            }),
        });

        setName('');
        setLocation('');

        router.push("/sites");
        //router.refresh();
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