import React, { useEffect, useState } from "react";
import Timeline from 'react-calendar-timeline';
// make sure you include the timeline stylesheet or the timeline will not be styled
import './CarUsage.scss';
import moment from 'moment';
import "moment/locale/id";
import useAxios from '../../hooks/useAxios';


const CarUsage = () => {
    moment.locale("id");
    const api = useAxios();
    const [groups, setGroups] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        api.get('dapi/mobil/get')
            .then((response) => {
                if (response.data.success) {
                    const newGroups = response.data.data.map((car) => ({
                        id: car.id,
                        title: `${car.brand} ${car.plat}`
                    }));
                    setGroups(newGroups);
                    console.log('Available cars:', newGroups);

                    // Setelah groups sudah ada, baru get pengambilan-calendar
                    api.get('dapi/mobil/pengambilan-calendar')
                        .then((calendarResponse) => {
                            if (calendarResponse.data.success) {
                                // Buat mapping group title ke id
                                const groupMap = {};
                                newGroups.forEach(g => {
                                    groupMap[g.title] = g.id;
                                });

                                const newItems = calendarResponse.data.data.map((item, idx) => {
                                    let groupId = item.group || item.group_id;
                                    if (!groupId && item.brand && item.plat) {
                                        const key = `${item.brand} ${item.plat}`;
                                        groupId = groupMap[key] || 1;
                                    }
                                    return {
                                        id: item.id || idx + 1,
                                        group: groupId || 1,
                                        title: item.title || item.user || '-',
                                        start_time: moment(item.start_time),
                                        end_time: moment(item.end_time),
                                        bgColor: item.bgColor || 'rgba(225, 166, 244, 0.6)'
                                    };
                                });
                                setItems(newItems);

                                console.log('Pengambilan calendar:', newItems);
                            }
                        })
                        .catch((error) => {
                            console.error('Error fetching pengambilan calendar:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error fetching available cars:', error);
            });
    }, []);



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
