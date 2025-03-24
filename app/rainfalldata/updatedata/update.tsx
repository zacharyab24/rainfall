"use client"

import PocketBase from "pocketbase";
import {useState} from "react";
import {useRouter} from "next/navigation";

interface Props {
    recordId: string;
}

// Preconditions: Receives id for record in the rainfallData table
// Postconditions: Updates the rainfallQuantity value in the database for the given record
export default function UpdateRainfallQuantity({ recordId } : Props) {
    const [rainfallQuantity, setRainfallQuantity] = useState(0);

    const pb = new PocketBase("/api/pb");
    const router = useRouter();


    const update = async (e:any) => {
        e.preventDefault();

        try {
            const record = await pb.collection('rainfallData').update(`${recordId}`, {
                rainfallQuantity: rainfallQuantity,
            });
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <form onSubmit={update}>
            <h3>Enter today's rainfall</h3>
            <input
                type="number"
                placeholder="Rainfall Amount (mm)"
                value={rainfallQuantity}
                onChange={(e) => setRainfallQuantity(parseFloat(e.target.value))}
                min="0"
                step="any"
            />
            <button type="submit">
                Update data
            </button>
        </form>
    )
}