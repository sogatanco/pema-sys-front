import React, { useEffect, useRef, useState } from 'react';
import useAxios from '../../hooks/useAxios';

const Lalin = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef();
  const api = useAxios();

  useEffect(() => {
    api.get('dapi/lay')
      .then(res => {
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const baseUrl = process.env.REACT_APP_BASEURL;
          setSlides(res.data.data.map(item => ({
            url: `${baseUrl}layar/${item.url}?t=${Date.now()}`,
            duration: item.duration || 3000
          })));
        }
      })
      .catch(err => {
        console.error('Error fetching slides:', err);
      });
  }, []);

  useEffect(() => {
    if (!slides.length) return undefined;
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, slides[current].duration);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [current, slides]);

  if (!slides.length) return null;

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
        src={slides[current].url}
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
        {current + 1} / {slides.length}
      </div>
    </div>
  );
};

export default Lalin;
