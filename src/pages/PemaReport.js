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
          src="https://g3.ipcamlive.com/player/player.php?alias=67ce58a8dd6e1&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 1"
          allowFullScreen
        />
        <iframe
          className="video-2"
          src="https://g3.ipcamlive.com/player/player.php?alias=67ce5bf811f48&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 2"
          allowFullScreen
        />
        <iframe
          className="video-3"
          src="https://g3.ipcamlive.com/player/player.php?alias=67ce5c3e4b8a9&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 3"
          allowFullScreen
        />
        <iframe
          className="video-4"
          src="https://g3.ipcamlive.com/player/player.php?alias=67ce5c8c74e1b&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 4"
          allowFullScreen
        />
        <iframe
          className="video-5"
          src="https://g3.ipcamlive.com/player/player.php?alias=67ce5c240e0a3&autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video 5"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default PemaReport;
