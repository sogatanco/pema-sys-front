import React, { useRef } from 'react';
import './AvailableCar.css'; // Import CSS file

// Sample data for car models
const carModels = [
    { name: 'Toyota Innova', sales: 'BL 2342 AT', image: 'https://agungtoyota.co.id/app/sam/assets/product_car_model/a1f5610604298e07d5b4b2c369555fda.png' },
    { name: 'Totota Avsanza', sales: 'BL 3543 LW', image: 'https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FToyota%2FAll%20New%20Avanza%2Fmain_color%2Fhitam.png&w=640&q=75' },
    { name: 'Totota Avasnza', sales: 'BL 1543 LW', image: 'https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FToyota%2FAll%20New%20Avanza%2Fmain_color%2Fhitam.png&w=640&q=75' },
    { name: 'Totota Avaehwnza', sales: 'BL 1222 LH', image: 'https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FToyota%2FAll%20New%20Avanza%2Fmain_color%2Fhitam.png&w=640&q=75' },
];
const AvailableCar = () => {
    const carListRef = useRef(null);

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
                {carModels.map((car) => (
                    <div key={car.name} className="car-card">
                        <img src={car.image} alt={car.name} className="car-image" />
                        <h4>{car.name}</h4>
                        <span>{car.sales}</span>
                    </div>
                ))}
            </div>
            <button type='button' className="arrow-button right-arrow" onClick={scrollRight}>&gt;</button>
        </div>
    );
};


export default AvailableCar;
