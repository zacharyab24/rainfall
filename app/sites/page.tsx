import Link from "next/link"
import styles from './page.module.css';

async function getSites() {
    const res = await fetch('http://127.0.0.1:8090/api/collections/sites/records?page=1&perPage=30', {cache: 'no-store'});
    const data = await res.json();
    return data?.items as any[];
}

export const metadata = {
    title: 'Sites',
}


export default async function SitesPage() {
    const sites = await getSites();

    return (
        <div>
            <h1>Sites</h1>
            <div className={styles.button}>
                <Link href="/sites/create" className={styles.link}>
                    New Site
                </Link>
            </div>

            <div>
                {sites?.map((site) => (
                    <Site key={site.id} site={site} />
                ))}
            </div>
        </div>
    )
}

function Site({ site }: any) {
    const {id, name, location, rainfall, owner, created, updated} = site || {};

    return (
        <Link href={`/sites/${id}`}>
            <div className={styles.site}>
                <h2>{name}</h2>
                <h5>{location}</h5>
                <h5>{rainfall}</h5>
            </div>
        </Link>
    )
}
