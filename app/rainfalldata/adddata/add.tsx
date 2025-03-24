"use client"

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import PocketBase from "pocketbase";

interface Props {
    siteId: string;
}

export default function AddData({ siteId }: Props) {
    const [date, setDate] = useState("");
    const [rainfallQuantity, setRainfallQuantity] = useState<number | "">("");
    const [site, setSite] = useState("");

    const pb = new PocketBase('/api/pb');
    const router = useRouter();

    useEffect(() => {
        const currentDate = new Date();
        const dateString: string = `${currentDate.toISOString()}`;

        setDate(dateString);
        setRainfallQuantity(0);
        setSite(siteId);
    }, [siteId]);

    const create = async(e:any) => {
        e.preventDefault();

        const record = await pb.collection('sites').create({
            date: date,
            rainfallQuantity: rainfallQuantity,
            site: site,
        })

        router.refresh()
    }

    return (
        <form onSubmit={create}>
            <h3>Enter today's rainfall</h3>
            <input
                type="number"
                placeholder="Rainfall Amount (mm)"
                value={rainfallQuantity}
                onChange={(e) => setRainfallQuantity(e.target.value === "" ? "" : parseFloat(e.target.value))}
                min="0"
                step="any"
            />
            <button type="submit">
                Add data
            </button>
        </form>
    );
}