import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, Button } from "reactstrap";
import { Camera } from "react-camera-pro";
import { CameraAlt } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Absen.css";
import { useAlert } from 'react-alert'
import useAxios from "../../hooks/useAxios";
import useAuth from '../../hooks/useAuth';

const Absen = () => {
    const [inout, setInout] = useState('');
    const alert = useAlert()
    const api = useAxios();
    const camera = useRef(null);
    const { auth } = useAuth();
    const [office, setOffice] = useState({ lat: null, lng: null });
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const getOffice = () => {
        api.get(`dapi/hr/office`).then((res) => {
            setOffice({
                lat: parseFloat(res?.data?.data.latitude),
                lng: parseFloat(res?.data?.data.longitude)
            })
        })
    }

    const getDistance = (loc1, loc2) => {
        const R = 6371e3; // Radius bumi dalam meter
        const lat1 = (loc1.lat * Math.PI) / 180;
        const lat2 = (loc2.lat * Math.PI) / 180;
        const deltaLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
        const deltaLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Jarak dalam meter
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {

                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    console.log('tete', userLocation)

                    setTimeout(() => {
                        const distance = getDistance(userLocation, office);
                        if (distance <= 100) { // Cek radius dalam satuan meter
                            setIsCameraOpen(true);
                        } else {
                            setInout('')
                            alert.show('Lokasi Tidak Sesuai, coba lagi !', userLocation.lng);
                        }
                    }, 1000)
                },
                (err) => {
                    alert.show("Error pada pengambilan lokasi: ", err);
                },
                {
                    enableHighAccuracy: true, // Minta lokasi yang lebih akurat
                    timeout: 10000, // Waktu tunggu maksimal
                    maximumAge: 0 // Lokasi yang tidak usang
                }
            );
        } else {
            alert.show("Geolocation tidak didukung oleh browser ini.");
        }
    };

    useEffect(() => {
        getOffice();
    }, []);

    const clockIn = () => {
        setInout('in');
        getLocation();
    };

    const clockOut = () => {
        setInout('out');
        getLocation();
    }

    const takePhoto = async () => {
        const photo = camera.current.takePhoto();
        setIsCameraOpen(false);


        await api.post(`dapi/hr/clock_in`, { poto: photo, jenis: inout }).then((res) => {
            console.log(res)
            alert.show(res.data.message)
            setInout('')
        })





    };

    return (
        <div className="absen-container">
            {/* Header */}
            <div className="head bg-primary text-white py-5 px-3 w-100">
                <Row className="align-items-center">
                    <Col>
                        <h3 className="fs-4">Halo, {auth?.user?.first_name}</h3>
                        <p>Selamat Pagi</p>
                    </Col>
                    <Col className="text-end">
                        <img
                            src="https://cdn.idntimes.com/content-images/post/20230515/gambar-profil-wa-keren-41d3732660868cf4a36d801d1301f672.jpg"
                            alt="Profile"
                            className="profile-img"
                        />
                    </Col>
                </Row>
            </div>

            {/* Menu */}
            <div className="bawah mt-n5">
                <Row className="text-center">
                    <Col>
                        <Card className="p-2">
                            <div className="menu-item">🕒</div>
                            <span className="text-muted small">Riwayat</span>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="p-2">
                            <div className="menu-item">📄</div>
                            <span className="text-muted small">Pengajuan</span>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="p-2">
                            <div className="menu-item">📆</div>
                            <span className="text-muted small">Cuti</span>
                        </Card>
                    </Col>
                </Row>

                {/* Absen */}
                <Card className="p-3 mt-3">
                    <span className="small mb-4">Selasa, 11 Maret 2025</span>

                    {/* Clock In */}
                    <Row className="d-flex align-items-center mb-3">
                        <Col>
                            <span className="small">
                                <strong>08:00 WIB</strong>
                                <br />
                                Actual Clock In
                                {/* {location.lng} */}
                            </span>
                        </Col>
                        <Col>
                            <Button color="warning" className="w-100" outline onClick={clockIn}>
                                {inout === 'in' ? 'Loading . . . .' : 'Masuk ➜'}
                            </Button>
                        </Col>
                    </Row>

                    {/* Clock Out */}
                    <Row className="d-flex align-items-center mb-3">
                        <Col>
                            <span className="small">
                                <strong>17:00 WIB</strong>
                                <br />
                                Actual Clock Out
                            </span>
                        </Col>
                        <Col>
                            <Button color="info" className="w-100" outline onClick={clockOut}>
                                {inout === 'out' ? 'Loading . . . .' : 'Pulang ➜'}
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* Kamera Full Screen (Portrait) */}
            {isCameraOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "#000",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* Kamera */}
                    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
                        <Camera
                            ref={camera}
                            facingMode="user"
                            videoConstraints={{
                                width: 1080,
                                height: 1920,
                                facingMode: "user",
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                zIndex: 1, // Pastikan kamera ada di bawah tombol
                            }}
                        />

                        {/* Tombol Ambil Foto */}
                        <CameraAlt style={{ fontSize: 32, color: "#000" }} />
                        <button
                            type="button"
                            onClick={takePhoto}
                            style={{
                                position: "absolute",
                                bottom: "80px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                                border: "none",
                                zIndex: 2, // Tombol di atas kamera
                                cursor: "pointer",
                            }}
                        >

                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Absen;
