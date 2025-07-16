import React, { useRef, useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import './AvailableCar.css'; // Import CSS file

const AVANZA_IMAGE = 'https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FToyota%2FAll%20New%20Avanza%2Fmain_color%2Fhitam.png&w=640&q=75';
const DEFAULT_IMAGE = 'https://agungtoyota.co.id/app/sam/assets/product_car_model/a1f5610604298e07d5b4b2c369555fda.png';
const SCOOPY_IMAGE = 'https://i.imgur.com/6N80uyd.png';
const FORTUNER_IMAGE='https://omnispace.blob.core.windows.net/strapi-prod/2022-09-19/TRAC_SUV_Car_Toyota_Fortuner_2_ffd7275fdf.png';
const ZENIX_IMAGE='https://www.kallatoyota.co.id/storage/images/thumbnail/car-types/1673314489-hybrid-20-v-hv-cvt-modelista.png';

const AvailableCar = () => {
    const carListRef = useRef(null);
    const api = useAxios();
    const [carModels, setCarModels] = useState([]);

    useEffect(() => {
        api.get('dapi/mobil/available')
            .then((response) => {
                if (response.data.success) {
                    setCarModels(response.data.data);
                    console.log('Available cars:', response.data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching available cars:', error);
            });
    }, []);

    const scrollLeft = () => {
        carListRef.current.scrollLeft -= 300; // Adjust scroll amount as needed
    };

    const scrollRight = () => {
        carListRef.current.scrollLeft += 300; // Adjust scroll amount as needed
    };

    return (
        <div className="available-cars">
            <button type='button' className="arrow-button left-arrow" onClick={scrollLeft}>&lt;</button>
            <div className="car-list" ref={carListRef}>
                {carModels.map((car) => {
                    const brand = car.brand ? car.brand.toLowerCase() : '';
                    let image = DEFAULT_IMAGE;
                    if (brand.includes('scoopy')) {
                        image = SCOOPY_IMAGE;
                    } else if (brand.includes('vanza')) {
                        image = AVANZA_IMAGE;
                    }else if (brand.includes('fourtuner')) {
                        image = FORTUNER_IMAGE;
                    }else if (brand.includes('zenix')) {
                        image = ZENIX_IMAGE;
                    }
                    return (
                        <div key={car.plat} className="car-card">
                            <img src={image} alt={car.name} className="car-image" />
                            <h4>{car.brand}</h4>
                            <span>{car.plat}</span>
                        </div>
                    );
                })}
            </div>
            <button type='button' className="arrow-button right-arrow" onClick={scrollRight}>&gt;</button>
        </div>
    );
};


export default AvailableCar;
