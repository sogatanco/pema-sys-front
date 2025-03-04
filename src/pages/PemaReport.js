import React from 'react';
import './PemaReport11.css';

const PemaReport = () => {
  return (
    <div>
      {/* Title Section */}
      <div className="header">
        <h1 className='mb-0 titlereport'>Suasana Terkini Stockpile Sulphur</h1>
        <h6 style={{ color: '#fff' , marginLeft: '20px'}}>Langsa, Aceh - Indonesia</h6>
      </div>

      {/* Video Grid */}
      <div className="video-grid">  
        <iframe
          className="video-1"
          src="https://g3.ipcamlive.com/player/player.php?alias=6790a304d52e8&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 1"
          allowFullScreen
        />
        <iframe
          className="video-2"
          src="https://g3.ipcamlive.com/player/player.php?alias=6790a3be62c6f&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 2"
          allowFullScreen
        />
        <iframe
          className="video-3"
          src="https://g3.ipcamlive.com/player/player.php?alias=6790a3dad6f2a&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 3"
          allowFullScreen
        />
        <iframe
          className="video-4"
          src="https://g3.ipcamlive.com/player/player.php?alias=6790a424456e7&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 4"
          allowFullScreen
        />
        <iframe
          className="video-5"
          src="https://g3.ipcamlive.com/player/player.php?alias=6790a43731ac9&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 5"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default PemaReport;
