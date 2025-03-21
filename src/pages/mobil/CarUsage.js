import React from "react";
import Timeline from 'react-calendar-timeline';
// make sure you include the timeline stylesheet or the timeline will not be styled
import './CarUsage.scss';
import moment from 'moment';
import "moment/locale/id";


const CarUsage = () => {
    moment.locale("id");
    const groups = [{ id: 1, title: 'Avanza BL 123 AT' },
         { id: 2, title: 'INNOVA 23 BB' },
         { id: 3, title: 'INNOVA 23 BB' },
         { id: 4, title: 'INNOVA 23 BB' },
         { id: 5, title: 'INNOVA 23 BB' }
        
        ];

    const items = [
        {
            id: 1,
            group: 1,
            title: 'Wahyudin',
            start_time: moment("2023-09-14 16:34:11", "YYYY-MM-DD HH:mm:ss"),
            end_time: moment("2023-09-14 17:34:11", "YYYY-MM-DD HH:mm:ss"),
            bgColor: 'rgba(225, 166, 244, 0.6)',
        },
        {
            id: 2,
            group: 2,
            title: 'Safrian',
            start_time: moment("2023-09-14 15:30:00", "YYYY-MM-DD HH:mm:ss"),
            end_time: moment("2023-09-14 16:30:00", "YYYY-MM-DD HH:mm:ss"),
            bgColor: 'rgba(100, 200, 100, 0.6)',
        },
        {
            id: 3,
            group: 1,
            title: 'Syahrial',
            start_time: moment("2023-09-14 18:00:00", "YYYY-MM-DD HH:mm:ss"),
            end_time: moment("2025-02-27 19:00:00", "YYYY-MM-DD HH:mm:ss"),
            bgColor: 'rgba(225, 166, 244, 0.6)',
        },
    ];



    return (
        <div>
            <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={moment().add(0, 'day')}
                defaultTimeEnd={moment().add(12, 'hour')}
                // timeSteps={{ day: 1, hour: 1 }} // Mengatur langkah waktu 
                headerLabelFormats={{
                    yearLong: "YYYY", // 2023
                    yearShort: "YY", // 23
                    monthShort: "MMM YYYY", // Sep 2023
                    monthMedium: "MMMM YYYY", // September 2023
                    monthLong: "MMMM YYYY", // September 2023
                    dayShort: "DD MMM", // 14 Sep
                    dayLong: "dddd, DD MMM YYYY", // Kamis, 14 Sep 2023
                    hourShort: "HH:mm", // 16:34
                    hourMedium: "HH:mm", // 16:34
                    hourLong: "HH:mm:ss", // 16:34:11
                }}
                // itemTouchSendsClick={false}
            >

            </Timeline>
        </div>
    );
};

export default CarUsage;
