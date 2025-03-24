import DeleteSite from "@/app/sites/[id]/DeleteSite";
import AddData from "@/app/rainfalldata/adddata/add";
import PocketBase, {RecordModel} from "pocketbase";
import UpdateRainfallQuantity from "@/app/rainfalldata/updatedata/update";

const pb = new PocketBase('http://127.0.0.1:8090');

async function getSite(siteId: string) {
    const res = await fetch (
        `http://127.0.0.1:8090/api/collections/sites/records/${siteId}`,
        {
            next: { revalidate: 10},
        }
    );
    const data = await res.json();
    return data;
}

async function getTodayRainfall(siteId: string) {
    const currentDate = new Date().toJSON().slice(0,10);
    const dateString: string = `${currentDate + " 00:00:00"}`;
    try {
        return await pb.collection('rainfallData').getFirstListItem(`date >= "${dateString}" && site = "${siteId}"`);
    } catch (err) {
        return null;
    }
}

export default async function SitePage({ params}: any) {
    const site = await getSite(params.id)
    const todaysRainfall = await getTodayRainfall(params.id);

    // Case where we were unable to locate a db entry. This likely means that there was no record for today's rainfall
    // Tell user no data was found and give opportunity to create an entry
    if (todaysRainfall === null) {
        return (
            <div>
                <h1>{site.name}</h1>
                <div>
                    <h3>Location: {site.location}</h3>
                    <h3>No rainfall data exists for this location today</h3>
                    <AddData siteId={site.id} />
                </div>
                <DeleteSite siteId={String(site.id)} />
            </div>
        );
    }

    // Case where we successfully retrieved a data entry.
    // Show current rainfall and give user opportunity to update
    else {
        let rainfallQuantity = todaysRainfall.rainfallQuantity;
        return (
            <div>
                <h1>{site.name}</h1>
                <div>
                    <h3>Location: {site.location}</h3>
                    <h3>Today's Rainfall: {rainfallQuantity}mm</h3>
                </div>

                <UpdateRainfallQuantity recordId={String(todaysRainfall.id)} />

                <DeleteSite siteId={String(site.id)} />
            </div>
        );
    }
}