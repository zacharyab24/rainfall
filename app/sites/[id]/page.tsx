import DeleteSite from "@/app/sites/[id]/DeleteSite";
import AddData from "@/app/rainfalldata/adddata/add";

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
return (

export default async function SitePage({ params}: any) {
    const site = await getSite(params.id)
        <div>
            <h1>{site.name}</h1>
            <AddData siteId={site.id} />
            <div>
                <h3>location: {site.location}</h3>
                <h3>Today's Rainfall: </h3>
            </div>
            <DeleteSite siteId={String(site.id)} />
        </div>

    );
}