import React, { useEffect, useRef, useState } from 'react';

const images = [
    // Ganti dengan path gambar lokal/public atau URL gambar
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
];

const SlideShow = ({ interval = 3000 }) => {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef();

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearTimeout(timerRef.current);
    }, [current, interval]);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
            }}
        >
            <img
                src={images[current]}
                alt={`slide-${current}`}
                style={{
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    transition: 'opacity 0.5s',
                }}
            />
            <div style={{
                position: 'absolute',
                top: 20,
                right: 30,
                color: '#fff',
                background: 'rgba(0,0,0,0.4)',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 18,
                zIndex: 10000,
            }}>
                {current + 1} / {images.length}
            </div>
        </div>
    );
};

export default SlideShow;
