"use client"

import { FurnitureIndex, FurnitureIndexRequest, FurnitureIndexResponse } from '@/api/furniture-index';
import { Sidebar } from '@/components/sidebar';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const params = useParams();

    const categoryId = params?.categoryId;
    const [search, SetSearch] = useState<FurnitureIndexRequest["search"]>({
        categoryId: Number(categoryId),
        currentPage: 1,
        keyword: "",
    });
    const [furnitures, setFurnitures] = useState<FurnitureIndexResponse["furnitures"]>([]);

    useEffect(() => {
        const indexApi = async() => {
            const indexResponse = await FurnitureIndex({search});
            setFurnitures(indexResponse.furnitures);
        }

        indexApi();
    }, [search]);

    return (
        <div>
            <Sidebar />
            <h1>{categoryId}</h1>
            {furnitures.map((furniture) => (
                <div key={furniture.id}>
                    <h2>{furniture.name}</h2>
                    <img src={furniture.imageUrl} />
                    <p>{furniture.detail}</p>
                    <p>{furniture.price}</p>
                    <p>{furniture.stock}</p>
                </div>
            ))}
        </div>
    );
}
