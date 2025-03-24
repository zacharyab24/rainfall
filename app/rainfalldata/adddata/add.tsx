"use client"

import {useState, useEffect} from "react";

interface Props {
    siteId: string;
}

export default function AddData({ siteId }: Props) {
    const [date, setDate] = useState("");
    const [rainfallQuantity, setRainfallQuantity] = useState<number | "">("");
    const [site, setSite] = useState("");

    useEffect(() => {
        const currentDate = new Date();
        const dateString: string = `${currentDate.toISOString()}`;

        setDate(dateString);
        setRainfallQuantity(0);
        setSite(siteId);
    }, [siteId]);

    const create = async(e:any) => {
        e.preventDefault();

        await fetch('http://127.0.0.1:8090/api/collections/rainfallData/records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date,
                rainfallQuantity,
                site
            }),
        });
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