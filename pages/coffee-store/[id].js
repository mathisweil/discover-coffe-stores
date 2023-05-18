import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import cls from "classnames"
import styles from "../../styles/Coffee-stores.module.css"

import { fetchCoffeeStores } from "@/lib/coffee-stores"
import { StoreContext } from "@/store/store-context"
import { isEmpty, fetcher } from "@/utils"
import { useContext, useEffect, useState } from "react"
import useSWR from "swr"

export async function getStaticProps({params}) {
    const coffeeStores = await fetchCoffeeStores();
    const findCoffeeStoresByID = coffeeStores.find(coffeeStore => {
        return coffeeStore.id.toString() === params.id; 
    })
    return {
        props: {
            coffeeStore: findCoffeeStoresByID ? findCoffeeStoresByID : {}
        }
    }
}
export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.id.toString(),
            },
        };
    });
    return {
        paths,
        fallback: true,
    }
}

const CoffeeStore = (initialProps) => {
    const [voteCount, setVoteCount] = useState(0);
    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {});
    const router = useRouter();
    const id = router.query.id;
    const { state: {locatedCoffeeStores} } = useContext(StoreContext)
    const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

    useEffect(() => {
        if(data && data.length > 0 ) {
            setCoffeeStore(data[0]);
            setVoteCount(data[0].votes);
        }
    },[data]);

    useEffect(() => {
        if(isEmpty(initialProps.coffeeStore)) {
            if(locatedCoffeeStores.length > 0) {
                const coffeeStoreFromContext = locatedCoffeeStores.find(coffeeStore => {
                    return coffeeStore.id.toString() === id; 
                })
                if(coffeeStoreFromContext) {
                    setCoffeeStore(coffeeStoreFromContext);
                    handleCreateCoffeeStore(coffeeStoreFromContext);
                }
            }
        } else {
            handleCreateCoffeeStore(initialProps.coffeeStore );
        }
    },[id, initialProps, initialProps.coffeeStore])

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const { id, name, address, neighbourhood, votes, imgUrl } = coffeeStore;
            const response = await fetch('/api/createCoffeeStore', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id, 
                    name, 
                    address: address || "", 
                    neighbourhood: neighbourhood || "", 
                    votes: 0, 
                    imgUrl
                }), 
            });
            const dbCoffeeStore = await response.json();
        } catch(error) {
            console.log("error creating coffee store", error);
        }
    }

    const {name, address, neighbourhood, imgUrl} = coffeeStore; 

    const handleUpvoteButton = async  () => {
        try {
            const response = await fetch('/api/favouriteCoffeeStoreById', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                }), 
            });
            const dbCoffeeStore = await response.json();
            if(dbCoffeeStore && dbCoffeeStore.length >0) {
                let count = voteCount + 1;
                setVoteCount(count);
            } else {
                console.log("dbCoffee store undefined");
            }
            
        } catch(error) {
            console.log("error upvoting", error);
        }
    }

    if(router.isFallback) {
        return (
            <div>Loading...</div>
        );
    }
    if(error) {
        return (
            <div>Something went wrong retrieving coffee store page</div>
        );
    }
    return (
        <div className={styles.layout }>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">
                            ← Back to home
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <p className={styles.name}>{name}</p>
                    </div>
                    <Image 
                        src={imgUrl}
                        alt={name}
                        width={600}
                        height={360}
                        className={styles.storeImg}
                    />
                </div>
                <div className={cls("glass", styles.col2)}>
                    {address && (<div className={styles.iconWrapper}>
                            <Image
                                src="/static/icons/places.svg"
                                alt=""
                                width={24}
                                height={24}
                            />
                            <p className={styles.text}>{address}</p>
                        </div>
                    )}
                    {neighbourhood && (<div className={styles.iconWrapper}>
                            <Image
                                src="/static/icons/nearMe.svg"
                                alt=""
                                width={24}
                                height={24}
                            />
                            <p className={styles.text}>{neighbourhood}</p>
                        </div>
                    )}
                    <div className={styles.iconWrapper}>
                        <Image
                            src="/static/icons/star.svg"
                            alt=""
                            width={24}
                            height={24}
                        />
                        <p className={styles.text}>{voteCount}</p>
                    </div>
                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up Vote</button>
                </div>
            </div>
        </div>
        
    );
}

export default CoffeeStore;