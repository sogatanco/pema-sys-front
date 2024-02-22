import React, { useEffect, useState } from 'react';
import { Scheduler } from '@bitnoi.se/react-scheduler';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import newDate from '../../utils/formatDate';

// const mockedSchedulerData = [
//   {
//     id: '070ac5b5-8369-4cd2-8ba2-0a209130cc60',
//     label: {
//       //   icon: 'https://picsum.photos/24',
//       title: 'Pemeriksaan Kode Program di setiap Modul PEMA Sys',
//       subtitle: 'Divisi Teknologi Informasi',
//     },
//     data: [
//       {
//         id: '8b71a8a5-33dd-4fc8-9caa-b4a584ba3453',
//         startDate: new Date('2024-04-13'),
//         endDate: new Date('2024-04-28'),
//         occupancy: 3600,
//         title: 'Blackbox and Whitebox Testing',
//         subtitle: '',
//         description: '12 Subtask',
//         bgColor: 'rgb(21, 137, 252)',
//       },
//       {
//         id: '8b71a8a5-33dd-4fc8-9caa-b4a545645645',
//         startDate: new Date('2024-04-13'),
//         endDate: new Date('2024-04-15'),
//         occupancy: 0,
//         title: 'Subtask 1',
//         subtitle: 'Membuat dokumen pengantar MOU',
//         description: '',
//         bgColor: 'rgb(105, 174, 244)',
//       },
//       {
//         id: '8b71a8a5-33dd-4fc8-9caa-b4a5456454545',
//         startDate: new Date('2024-04-15'),
//         endDate: new Date('2024-04-18'),
//         occupancy: 0,
//         title: 'Subtask 2',
//         subtitle: 'Membuat dokumen legalitas',
//         description: '',
//         bgColor: 'rgb(105, 174, 244)',
//       },
//       {
//         id: '8b71a8a5-33dd-4fc8-9caa-b4a545645434535',
//         startDate: new Date('2024-04-18'),
//         endDate: new Date('2024-04-20'),
//         occupancy: 0,
//         title: 'Subtask 3',
//         subtitle: 'Membuat laporan dari lapangan',
//         description: '',
//         bgColor: 'rgb(105, 174, 244)',
//       },
//       {
//         id: '8b71a8a5-33dd-4fc8-9caa-b4a584ba23456',
//         startDate: new Date('2024-04-25'),
//         endDate: 'new Date('2024-05-05')',
//         occupancy: 3600,
//         title: 'Rapat dengan Sekretariat Perusahaan Pembahasan Pengembangan Aplikasi CSR',
//         subtitle: '',
//         description: '-',
//         bgColor: 'rgb(238,157,35)',
//       },
//     ],
//   },
//   {
//     id: '070ac5b5-8369-4cd2-8ba2-0a209130ckdorr',
//     label: {
//       //   icon: 'https://picsum.photos/24',
//       title: 'Pemindahan Sistem Administrasi Surat & SPPD ke PEMA Sys',
//       subtitle: 'Divisi Teknologi Informasi',
//     },
//     data: [
//       {
//         id: '8b71a8a5-33dd-4fc8-9caa-b4a584ba3762',
//         startDate: new Date('2024-04-22T15:31:24.272Z'),
//         endDate: new Date('2024-04-28T10:28:22.649Z'),
//         occupancy: 3600,
//         title: 'Development (Frontend & Backend)',
//         subtitle: '',
//         description: '-',
//         bgColor: 'rgb(14,183,175)',
//       },
//     ],
//   },
// ];

const Timeline = () => {
  const [filterButtonState, setFilterButtonState] = useState(0);
  const [list, setList] = useState([]);
  const [tlData, setTlData] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState();
  const toggle = () => {
    setModal(!modal);
  };

  const api = useAxios();

  const { data } = useQuery({
    queryKey: ['timeline-list'],
    queryFn: () =>
      api.get(`api/project/timeline/list-data`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    const filtered = data?.filter((item) => item?.task > 0);

    setList(filtered);
  }, [data]);

  useEffect(() => {
    const listProj = list;
    // const tasks = [];
    // const datas = [];
    for (let idx = 0; idx < list?.length; idx++) {
      for (let is = 0; is < listProj[idx].data.length; is++) {
        listProj[idx].data[is].startDate = list[idx].data[is].start_date
          ? new Date(list[idx].data[is].start_date)
          : new Date();
        listProj[idx].data[is].endDate = new Date(list[idx].data[is].end_date);
      }

      //   listProj[idx] = {
      //     id: list[idx].id,
      //     label: {
      //       title: list[idx].label.title,
      //       subtitle: list[idx].label.subtitle,
      //     },
      //     task: list[idx].task,
      //     data: tasks,
      //   };
    }

    setTlData(listProj);
  }, [list]);

  const handlePopup = (item) => {
    setModal(true);
    setSelectedTask(item);
  };

  return (
    <>
      <Row style={{ minHeight: '660px' }}>
        {tlData?.length > 0 ? (
          <Card>
            <CardBody>
              <section className="bg-info">
                <Scheduler
                  data={tlData}
                  // isLoading={isLoading}
                  //   onRangeChange={(newRange) => console.log(newRange)}
                  onTileClick={(item) => handlePopup(item)}
                  //   onItemClick={(item) => console.log(item)}
                  onFilterData={() => {
                    // Some filtering logic...
                    setFilterButtonState(1);
                  }}
                  onClearFilterData={() => {
                    // Some clearing filters logic...
                    setFilterButtonState(0);
                  }}
                  config={{
                    zoom: 0,
                    filterButtonState,
                  }}
                />
              </section>
            </CardBody>
          </Card>
        ) : (
          'Loading..'
        )}
        <Modal isOpen={modal} toggle={toggle.bind(null)} centered size="lg">
          <ModalHeader toggle={toggle.bind(null)}>Task Info</ModalHeader>
          <ModalBody>
            <table className="w-100">
              <tbody>
                <tr>
                  <td width="200">Status</td>
                  <td>:</td>
                  <td className="text-dark">
                    {selectedTask?.status === 0 ? (
                      <Badge color="primary">To do</Badge>
                    ) : selectedTask?.status === 1 ? (
                      <Badge color="warning">Inprogress</Badge>
                    ) : (
                      <Badge color="success">Done</Badge>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Task Title</td>
                  <td>:</td>
                  <td className="text-dark">{selectedTask?.title}</td>
                </tr>
                <tr>
                  <td>Start date</td>
                  <td>:</td>
                  <td className="text-dark">
                    {newDate(selectedTask?.startDate?.toLocaleString())?.split(',')[0]}
                  </td>
                </tr>
                <tr>
                  <td>End date</td>
                  <td>:</td>
                  <td className="text-dark">
                    {newDate(selectedTask?.endDate?.toLocaleString())?.split(',')[0]}
                  </td>
                </tr>
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" size="sm" outline onClick={toggle.bind(null)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </Row>
    </>
  );
};

export default Timeline;
